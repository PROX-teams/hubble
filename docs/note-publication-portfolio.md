# 노트 작성·저장·발행의 정합성 개선

작성 중인 내용, 서버에 임시저장한 내용, 독자가 보는 게시글을 분리하고, 동시 수정과 게시 재시도에 대응한 작업이다. 작성·발행 과정에서 게시글뿐 아니라 스토리 소속, 태그 연결, 임시저장 발행 상태, 게시 요청 처리 기록까지 함께 관리하도록 개선했다.

이 문서의 결과는 코드에 구현한 동작을 의미한다. 실제 운영 장애가 발생했다는 주장이나 처리량·응답 시간 개선 수치는 포함하지 않는다. Java 컴파일과 관련 프론트엔드 TypeScript 검사를 수행했으며, 실제 DB 마이그레이션 실행·동시 요청·장애 통합 검증은 완료하지 않았다. 테스트 추가·실행은 사용자 요청에 따라 제외했다.

## 1. 임시저장과 게시글의 생명주기 분리

### 문제 상황
기존 게시 요청은 에디터 내용을 받아 게시글을 생성·수정하고, 프론트엔드는 선택한 임시저장 ID를 초기화했다. 이 흐름만으로는 서버의 임시저장 기록과 게시글의 연결·발행 완료 상태를 보장하기 어려웠다. 발행 후에도 미발행 목록에 기록이 남거나, 수정용 임시저장 글을 새 게시글로 처리하는 문제가 발생할 수 있었다.

### 설계 계획 및 근거
임시저장 글에 수정 대상과 발행 상태를 기록한다. 수정 중인 내용을 공개 게시글과 분리하면 편집을 중단해도 기존 공개 내용이 유지된다. 새 글의 직접 게시도 유지해 임시저장을 필수 단계로 만들지 않는다.

### 설계
- `Draft`에 `noteId`, `published`, `baseNoteVersion`을 보관한다.
- 게시 요청은 최신 에디터 내용과 선택적인 `draftId`를 보낸다. 임시저장 기록과 수정 대상의 일치를 검사한다.
- 게시 성공 시 임시저장 기록을 게시글에 연결하고 발행 완료로 변경한다.
- 발행 완료 기록은 목록에서 제외하되, 반복 발행 판별에 사용하도록 보존한다.
- 수정용 임시저장 내용은 수정 완료 전까지 공개 게시글에 반영하지 않는다.

### 결과
임시저장 없이 새 글을 게시하는 흐름을 유지하면서 임시저장·발행의 연결을 명시했다. 같은 임시저장 기록의 반복 발행은 기존 게시글을 반환하고, 완료된 기록에 대한 추가 저장은 거절한다. 발행 완료 기록의 보존 기간과 정리 정책은 후속 과제다.

관련 코드: [Draft.java](/Users/bum/Desktop/hubble-client/server/common/src/main/java/com/hubble/note/entity/Draft.java), [NoteService.java](/Users/bum/Desktop/hubble-client/server/api/src/main/java/com/hubble/note/service/NoteService.java), [useNoteDraft.ts](/Users/bum/Desktop/hubble-client/client/src/features/note/write-note/model/useNoteDraft.ts)

## 2. 여러 탭의 임시저장 충돌 방지

### 문제 상황
같은 임시저장 글을 여러 탭에서 열면 두 탭이 같은 과거 내용을 기준으로 저장할 수 있다. 버전 검사 없이 저장하면 나중에 처리된 요청이 다른 탭의 변경을 덮어쓸 수 있다.

### 설계 계획 및 근거
화면에서 편집을 시작한 버전과 서버에서 조회한 버전을 비교하고, 조회 이후 SQL 실행까지의 경쟁은 JPA 낙관적 락으로 검사한다. 서버가 최신 데이터를 조회했다는 사실만으로 화면의 내용도 최신이라고 판단할 수 없으므로 두 단계의 검사가 필요하다.

### 설계
- `Draft.version`에 `@Version`을 적용한다.
- 조회 응답에 버전을 포함하고, 기존 기록의 저장 요청에 버전을 요구한다.
- 요청 버전과 조회한 DB 버전이 다르면 HTTP 409로 거절한다.
- `saveAndFlush()`에서 JPA가 버전 조건으로 UPDATE하고 충돌을 감지한다.
- 성공 응답의 버전을 다음 저장에 사용한다. 충돌 시 화면 내용을 유지하고 자동저장을 중단한다.

### 결과
오래된 화면에서 보낸 저장과 서버 처리 도중의 동시 변경을 검사하는 코드를 구현했다. 저장 실패 시 최신 버전으로 자동 재저장하지 않아 다른 탭의 변경을 무조건 덮어쓰지 않는다. 변경 이력 보관이나 자동 병합은 포함하지 않는다. 서로 다른 내용의 요청이 도착하는 순서를 사용자의 편집 순서로 보장하는 기능도 아니다.

관련 코드: [Draft.java:49](/Users/bum/Desktop/hubble-client/server/common/src/main/java/com/hubble/note/entity/Draft.java:49), [DraftService.java:55](/Users/bum/Desktop/hubble-client/server/api/src/main/java/com/hubble/note/service/DraftService.java:55), [DraftService.java:78](/Users/bum/Desktop/hubble-client/server/api/src/main/java/com/hubble/note/service/DraftService.java:78)

## 3. 발행과 게시글 수정의 버전 검사

### 문제 상황
임시저장 충돌만 막으면 발행 시점의 오래된 내용은 별도로 보호되지 않는다. 다른 탭이 임시저장 글이나 공개 게시글을 변경한 뒤, 이전 내용을 보고 있던 탭이 게시·수정 완료를 요청할 수 있다.

### 설계 계획 및 근거
발행은 임시저장 버전을, 게시글 수정은 공개 게시글의 내용 버전을 검사한다. 조회수·좋아요 같은 변경은 편집 충돌과 구분해야 하므로 게시글에는 내용 전용 버전을 사용한다.

### 설계
- 발행 시 임시저장 행을 잠근 뒤 `draftVersion`을 비교한다.
- 게시글에는 수동으로 관리하는 `contentVersion`을 사용한다. `Note`의 이 필드는 `@Version`이 아니다.
- 수정용 임시저장에는 편집을 시작한 게시글 버전인 `baseNoteVersion`을 보관한다.
- 게시글 행 잠금 아래 요청 버전·기준 버전·현재 내용 버전을 검사하고, 내용 수정 시 버전을 증가시킨다.

### 결과
임시저장 글을 발행하는 시점과 기존 게시글을 수정하는 시점에 충돌을 거절하는 로직을 구현했다. 조회수 등은 내용 버전과 분리했다. 버전이 맞는다는 사실만으로 사용자의 의도가 옳다고 판단하거나 자동 병합하지 않는다.

관련 코드: [NoteService.java:95](/Users/bum/Desktop/hubble-client/server/api/src/main/java/com/hubble/note/service/NoteService.java:95), [NoteService.java:155](/Users/bum/Desktop/hubble-client/server/api/src/main/java/com/hubble/note/service/NoteService.java:155), [Note.java](/Users/bum/Desktop/hubble-client/server/common/src/main/java/com/hubble/note/entity/Note.java)

## 4. 게시 전체의 트랜잭션 정합성

### 문제 상황
게시에는 게시글 저장, 필요한 스토리·태그 생성, 태그 연결, 임시저장 발행 완료, 요청 성공 기록이 포함된다. 일부 작업만 확정되면 태그가 빠진 글이나 재시도 판별 기록이 없는 게시글이 남을 수 있다.

### 설계 계획 및 근거
게시의 성공 기준을 여러 DB 변경이 함께 확정되는 것으로 정의한다. 게시글과 처리 기록을 별도로 커밋하면 응답 유실 후 재시도에서 중복 여부를 정확히 판단하기 어렵다.

### 설계
- `PublicationService.publish()`에 `@Transactional`을 적용한다.
- 기본 전파 방식으로 호출되는 `NoteService.createNote()`가 동일 트랜잭션에 참여한다.
- 요청 기록 확보부터 게시글·태그 연결·발행 완료·성공 결과 기록까지 함께 커밋한다.
- `ResponseStatusException`은 다시 발생시키고, JSON 처리 등의 체크 예외는 `IllegalStateException`으로 변환해 실패를 외부로 전달한다.
- 예외 핸들러는 롤백을 수행하는 것이 아니라 HTTP 오류 응답을 작성한다.

### 결과
게시 과정의 DB 변경을 함께 커밋·롤백하는 경계를 구현했다. 롤백은 이번에 생성·변경한 데이터만 취소하며 기존 공유 태그를 삭제하지 않는다. DB 커밋 후의 통신 실패나 외부 서비스 작업은 이 트랜잭션으로 취소하지 못한다. 실제 실패 주입 검증은 남아 있다.

관련 코드: [PublicationService.java:44](/Users/bum/Desktop/hubble-client/server/api/src/main/java/com/hubble/note/service/PublicationService.java:44), [PublicationService.java:71](/Users/bum/Desktop/hubble-client/server/api/src/main/java/com/hubble/note/service/PublicationService.java:71), [DraftConflictHandler.java](/Users/bum/Desktop/hubble-client/server/api/src/main/java/com/hubble/note/controller/DraftConflictHandler.java)

## 5. 응답 유실과 재시도의 멱등성

### 문제 상황
DB 커밋에 성공해도 성공 응답이 브라우저에 도착하지 않을 수 있다. 사용자가 다시 게시하면 새 ID의 게시글이 생성되어 내용이 같은 글이 두 개 생길 수 있다. 임시저장 ID만으로는 임시저장 없이 게시하는 요청을 구분할 수 없다.

### 설계 계획 및 근거
하나의 게시 의도에 요청번호를 부여하고 재시도에서도 같은 번호를 사용한다. 내용이 같다는 이유로 모든 새 글을 금지하지 않고, 같은 요청의 반복 처리만 막는다. 처리 기록은 응답 유실 후에도 남아야 하므로 DB에 저장한다. 별도 테이블은 선택한 구현 방식이며 멱등성의 필수 구성은 아니다.

### 설계
- POST 게시 요청에 `Idempotency-Key`를 요구한다.
- `publication_requests`에 사용자 ID·요청번호·요청 해시·성공 응답을 보관한다.
- `(user_id, request_key)`에 유일성 제약을 적용한다.
- 업서트로 처리 기록을 확보하고 잠금 조회한 뒤 게시한다. 같은 번호의 동시 요청은 DB 잠금에서 대기할 수 있다.
- 같은 번호·같은 내용은 저장된 결과를 반환하고, 같은 번호·다른 내용은 409로 거절한다.
- `pending` 예약과 성공 기록은 게시글과 같은 트랜잭션이다. 실패하면 새 예약도 롤백한다. 상태는 현재 별도 컬럼 대신 `payloadHash`의 예약 문자열로 표현한다.

### 결과
임시저장 없이 게시하는 요청에도 동일 요청번호의 재시도 대응을 구현했다. 먼저 처리한 요청이 성공하면 다음 요청은 기존 결과를 반환하고, 먼저 처리한 요청이 롤백되면 다음 요청이 게시를 진행한다. 서로 다른 번호로 보낸 요청까지 중복으로 판단하지 않는다. 기록 만료·삭제 정책과 실제 동시 요청 검증은 남아 있다.

관련 코드: [PublicationRequest.java](/Users/bum/Desktop/hubble-client/server/common/src/main/java/com/hubble/note/entity/PublicationRequest.java), [PublicationRequestRepository.java](/Users/bum/Desktop/hubble-client/server/common/src/main/java/com/hubble/note/repository/PublicationRequestRepository.java), [PublicationService.java:54](/Users/bum/Desktop/hubble-client/server/api/src/main/java/com/hubble/note/service/PublicationService.java:54)

## 6. 브라우저 재시도와 이전 게시 결과 확인

### 문제 상황
이전 구현은 실패한 게시의 원본 내용을 보관하고 다음 게시 때 재사용했다. 사용자가 내용을 수정했는데 이전 본문이 전송될 수 있어 새 게시 의도와 재시도를 구분해야 했다. 또한 이전 요청의 결과가 불명확한 상태에서 새 요청번호로 게시하면 늦게 완료된 첫 요청과 중복될 수 있다.

### 설계 계획 및 근거
이전 본문을 일반 게시 동작에서 대신 전송하지 않는다. 즉시 재시도는 같은 내용·번호를 유지하고, 결과가 불명확하면 새 게시 전에 이전 요청의 결과를 서버에서 확정한다. 단순 조회에서 기록이 없다는 사실만으로 아직 처리 중인 요청을 실패로 단정할 수 없다.

### 설계
- `publicationAttempt.ts`를 제거하고 `publicationRecovery.ts`로 대체했다.
- 요청번호와 내용 비교용 fingerprint를 메모리·사용자별 sessionStorage에 보관한다.
- 통신 오류 및 408·429·5xx에 대해 동일 요청을 최대 3회 시도한다.
- 결과가 불명확하면 다음 게시 전 resolve API를 호출한다.
- 완료된 요청이면 성공 결과를 반환한다. 미반영 요청은 같은 키에 `cancelled` 기록을 만들어 늦은 원 요청이 게시되지 않도록 한다.
- 이전 성공 내용과 현재 내용이 다르면 현재 편집 내용을 유지하고 이전 성공을 안내한다. 결과 확인이 실패하면 새 게시를 진행하지 않는다.

### 결과
이전 본문을 현재 내용 대신 전송하는 흐름을 제거하고, 결과가 불명확한 요청을 확인하는 경로를 구현했다. 취소 확인도 게시와 동일 요청 기록을 기준으로 경쟁하도록 했다. 저장소 접근 제한, 실제 네트워크 단절, 페이지 전환 등의 브라우저 검증은 남아 있다.

관련 코드: [publicationRecovery.ts](/Users/bum/Desktop/hubble-client/client/src/features/note/write-note/model/publicationRecovery.ts), [usePublishNote.ts](/Users/bum/Desktop/hubble-client/client/src/widgets/notebook-meta-sidebar/notebook-meta-editor/model/usePublishNote.ts), [PublicationService.java:26](/Users/bum/Desktop/hubble-client/server/api/src/main/java/com/hubble/note/service/PublicationService.java:26)

## 7. 사용자 단위 잠금에서 실제 데이터 단위 잠금으로 개선

### 문제 상황
초기 멱등성 구현은 사용자 행을 잠갔다. 같은 사용자의 요청번호가 서로 달라도 게시 요청이 순서대로 실행되고, 사용자 행을 변경하는 다른 작업에도 잠금 대기가 전파될 수 있었다. 사용자 잠금만으로 공유 태그 등 모든 경쟁을 해결하는 것도 아니었다.

### 설계 계획 및 근거
중복 방지 대상은 같은 사용자 전체가 아니라 같은 게시 요청이다. 요청 기록을 기준으로 경쟁을 제어하고, 스토리·게시글 등 보호해야 하는 실제 데이터에 필요한 잠금을 적용한다.

### 설계
- 사용자 행 잠금 메서드와 호출을 제거하고 사용자 존재는 일반 조회로 확인한다.
- 게시·결과 확인은 사용자·요청번호 조합의 처리 기록을 기준으로 잠금을 공유한다.
- 스토리 연결·이동·삭제는 대상 스토리를 잠근다.
- 게시글 수정은 현재 소속과 이동 대상 스토리를 ID 순으로 잠근 뒤 임시저장 글·게시글을 검사한다.

### 결과
서로 다른 요청번호가 사용자 행 잠금 때문에 기다리는 구조를 제거했다. 같은 스토리·태그를 사용하는 요청은 여전히 대기할 수 있다. 처리량 개선 수치는 측정하지 않았다. 스토리 삭제의 잠금 순서와 이동의 잠금 순서가 엇갈릴 수 있어, 순서 통일과 교착 상태 검증은 후속 과제다. 잠금 범위 추가 개선은 현재 보류했다.

관련 코드: [PublicationRequestRepository.java:13](/Users/bum/Desktop/hubble-client/server/common/src/main/java/com/hubble/note/repository/PublicationRequestRepository.java:13), [NoteService.java:101](/Users/bum/Desktop/hubble-client/server/api/src/main/java/com/hubble/note/service/NoteService.java:101), [StoryService.java:79](/Users/bum/Desktop/hubble-client/server/api/src/main/java/com/hubble/story/service/StoryService.java:79)

## 8. 스토리 소유권·삭제·기본 스토리 중복 보호

### 문제 상황
브라우저가 보낸 스토리 ID의 존재만 확인하면 다른 사용자의 스토리에 게시할 수 있다. 게시와 삭제가 겹치거나 스토리 삭제 후 소속을 정하지 않으면 노트와 임시저장 글이 잘못된 소속을 참조할 수 있다. 기본 스토리의 조회 후 생성도 동시 요청에서 중복 생성될 수 있다.

### 설계 계획 및 근거
스토리 ID는 클라이언트 입력이므로 서버에서 소유권을 검증한다. 삭제는 소속 콘텐츠의 처리 정책과 함께 정의한다. 기본 스토리 중복은 애플리케이션 조회뿐 아니라 DB 제약으로 방어한다.

### 설계
- 사용자 소유의 활성 스토리만 연결할 수 있게 조회·검사한다.
- 일반 스토리 삭제 시 노트와 미발행 임시저장 글을 기본 스토리로 이동하고 소프트 삭제한다.
- 이동된 노트와 임시저장 글의 버전을 증가시킨다.
- 기본 스토리는 표시 필드와 활성 기본 소유자 유일성 제약으로 사용자당 하나만 허용하고 업서트로 생성한다.
- 기본 스토리 삭제·이름 변경을 거절한다. 과거 타인 노트가 잘못 연결된 경우 자동 이동 대신 삭제를 거절한다.

### 결과
요청의 스토리 ID 조작을 검사하고, 스토리 삭제 이후 소속 정책을 코드로 명시했다. 기본 스토리의 동시 생성에 DB 제약과 업서트를 적용했다. 기존 중복 스토리를 임의로 합치지 않았으며, 실제 DB 제약 적용과 삭제 경쟁 검증은 남아 있다.

관련 코드: [StoryService.java](/Users/bum/Desktop/hubble-client/server/api/src/main/java/com/hubble/story/service/StoryService.java), [StoryRepository.java](/Users/bum/Desktop/hubble-client/server/common/src/main/java/com/hubble/story/repository/StoryRepository.java), [DraftRepository.java](/Users/bum/Desktop/hubble-client/server/common/src/main/java/com/hubble/note/repository/DraftRepository.java)

## 9. 태그 동시 생성·정규화·연결 무결성

### 문제 상황
서로 다른 글이 같은 새 태그를 동시에 사용하면 조회 후 생성 사이에 경쟁이 생긴다. 대소문자·공백 등의 표현 차이는 태그를 분리할 수 있고, 같은 태그를 중복 연결하거나 연결된 태그를 삭제하면 관계 무결성 문제가 생길 수 있다.

### 설계 계획 및 근거
태그 이름 정책을 통일하고 DB 유일성 제약과 업서트를 함께 사용한다. JPA 저장 오류를 잡고 같은 트랜잭션에서 계속 진행하는 방식은 롤백 전용 상태가 될 수 있어 피한다. 공유 태그 자체의 삭제와 게시글에서 연결 제거를 구분한다.

### 설계
- 입력에 NFKC 정규화·앞뒤 공백 제거·연속 공백 축약·소문자화를 적용한다.
- 중복 입력을 제거하고 이름을 정렬해 처리한다. 최대 20개, 이름은 최대 30 코드포인트로 제한한다.
- `INSERT ... ON DUPLICATE KEY UPDATE`로 태그를 확보하고 잠금 조회로 ID를 읽는다.
- DB collation이 같은 이름으로 판단하는 경우를 고려해 ID 기준으로도 중복 제거한다.
- 기존 `(note_id, tag_id)` 유일성 제약과 태그 외래키 삭제 제한을 확인하고, 공유 Tag로 삭제 cascade를 적용하지 않는다.

### 결과
동일 이름 태그 생성 경쟁에 업서트로 대응하고 중복 연결을 방어했다. 태그 연결을 제거해도 공유 태그 자체는 유지한다. 연결 유일성·외래키는 기존 제약을 확인한 것이며 전부 새로 도입한 것은 아니다. 기존 이름의 소급 병합, 모든 교착 상태의 자동 재시도, 일괄 조회 최적화는 구현하지 않았다.

관련 코드: [NoteService.java:301](/Users/bum/Desktop/hubble-client/server/api/src/main/java/com/hubble/note/service/NoteService.java:301), [TagRepository.java](/Users/bum/Desktop/hubble-client/server/common/src/main/java/com/hubble/note/repository/TagRepository.java), [NoteTag.java](/Users/bum/Desktop/hubble-client/server/common/src/main/java/com/hubble/note/entity/NoteTag.java)

## 10. 원본 게시글 삭제 시 작성 중인 내용 보존

### 문제 상황
게시글의 수정 내용을 임시저장한 뒤 원본 게시글이 삭제되면, 수정 대상이 사라진 기록이 남는다. 이를 그대로 수정 발행하거나 임시저장 내용을 함께 삭제하면 잘못된 처리 또는 작성 내용 유실이 발생할 수 있다.

### 설계 계획 및 근거
원본 삭제와 임시저장 보존 정책을 같은 트랜잭션으로 처리한다. 수정 대상을 잃어도 사용자가 작성한 제목·본문은 보존하고, 오래된 화면이 원본 연결을 되살리지 못하도록 버전을 변경한다.

### 설계
- 노트 삭제 시 미발행 수정용 임시저장의 `noteId`, `baseNoteVersion`을 비운다.
- 제목·본문·태그는 유지해 새 글의 임시저장으로 보존한다.
- 임시저장 버전을 증가시키고 원본 삭제와 함께 처리한다.

### 결과
원본 게시글 삭제 이후에도 작성 중인 내용을 새 글로 이어갈 수 있는 정책을 구현했다. 오래된 수정 요청은 버전·대상 검사로 거절한다. 삭제된 게시글을 자동 복원하거나 기존 게시글 ID를 재사용하지 않는다.

관련 코드: [NoteService.java:180](/Users/bum/Desktop/hubble-client/server/api/src/main/java/com/hubble/note/service/NoteService.java:180), [DraftRepository.java:40](/Users/bum/Desktop/hubble-client/server/common/src/main/java/com/hubble/note/repository/DraftRepository.java:40)

## 11. DB 성공 후 화면 갱신 실패 대응

### 문제 상황
게시나 스토리 이동이 DB에 반영돼도 프론트엔드 캐시가 남아 있으면 화면에 이전 목록·태그·소속이 표시될 수 있다. 재조회 실패를 숨기면 사용자에게 최신 데이터인 것처럼 보일 수 있다.

### 설계 계획 및 근거
DB 저장 성공과 화면 재조회 성공을 별개로 취급한다. 관련 캐시를 무효화하고, 재조회 실패 시 사용자에게 실패와 재조회 경로를 제공한다.

### 설계
- 게시 및 스토리 삭제 등의 성공 후 관련 노트·스토리·임시저장·태그 캐시를 무효화한다.
- 스토리별 태그는 별도 story-tag 테이블에 중복 저장하지 않고 실제 노트 관계에서 계산한다.
- 이전 데이터가 있는 활성 쿼리의 갱신 실패는 QueryProvider에서 알리고 재조회 버튼을 제공한다.

### 결과
DB 반영 후 관련 화면 데이터를 갱신하는 경로와 재조회 실패 안내를 구현했다. DB 커밋을 화면 갱신 실패 때문에 롤백하지 않는다. 서버·브라우저 전체의 즉각적 일관성이나 오프라인 복구를 보장한 것은 아니다.

관련 코드: [invalidateContent.ts](/Users/bum/Desktop/hubble-client/client/src/shared/api/invalidateContent.ts), [QueryProvider.tsx](/Users/bum/Desktop/hubble-client/client/src/shared/api/QueryProvider.tsx)

## 검증과 다음 작업

현재 결과로 주장할 수 있는 범위는 코드의 보호 로직과 컴파일·타입 검사다. 장애 감소율·처리량·응답 시간은 측정 전에는 성과로 쓰지 않는다.

다음 검증이 필요하다.
- 같은 요청번호의 동시 게시가 게시글 하나와 동일한 응답으로 끝나는지 확인한다.
- 태그 연결·성공 결과 기록 실패 시 새 게시글·새 태그·예약 기록이 함께 롤백되는지 확인한다.
- 여러 탭 저장·게시글 수정·발행에서 충돌 요청이 최신 내용을 덮어쓰지 않는지 확인한다.
- 게시·이동·삭제의 잠금 순서를 통일하고 실제 교착 상태와 잠금 대기를 확인한다.
- 마이그레이션 적용 및 실제 DB의 외래키·유일성 제약을 확인한다.
- 성공 응답 유실, 결과 확인과 늦은 원 요청의 경쟁을 브라우저·DB에서 검증한다.
- 처리 기록과 발행 완료 임시저장의 보존·삭제 정책을 정한다.

포트폴리오 본문에서는 4·5·7번을 중심으로 묶고, 2·3번을 동시 편집 사례로 연결하면 설계 근거와 한계를 설명하기 좋다. 나머지는 데이터 관계 보호와 사용자 작성 내용 보존의 구체적인 사례로 활용할 수 있다.

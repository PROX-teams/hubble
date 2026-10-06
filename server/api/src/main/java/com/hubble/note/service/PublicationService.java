package com.hubble.note.service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hubble.note.dto.request.NoteCreateRequest;
import com.hubble.note.dto.response.NoteResponse;
import com.hubble.note.entity.PublicationRequest;
import com.hubble.note.repository.PublicationRequestRepository;
import com.hubble.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;
@Service @RequiredArgsConstructor
public class PublicationService {
    private final UserRepository users;
    private final PublicationRequestRepository requests;
    private final NoteService notes;
    private final ObjectMapper mapper;

    public record Resolution(String state, NoteResponse note) {}

    // Reserve and lock only this request key; publish and resolve share this barrier.
    @Transactional
    public Resolution resolve(Long userId, String key) {
        if (key == null || !key.matches("[A-Za-z0-9_-]{1,100}")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 게시 요청 번호입니다.");
        }
        users.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다."));
        requests.reserve(userId, key, "cancelled");
        var previous = requests.findForUpdate(userId, key);
        if (previous.isPresent()) {
            if ("cancelled".equals(previous.get().getPayloadHash())) return new Resolution("cancelled", null);
            try {
                return new Resolution("completed", mapper.readValue(previous.get().getResponseJson(), NoteResponse.class));
            } catch (java.io.IOException exception) { throw new IllegalStateException("게시 결과 확인 실패", exception); }
        }
        return new Resolution("cancelled", null);
    }

    @Transactional
    public NoteResponse publish(Long userId, String key, NoteCreateRequest payload) {
        if (key == null || !key.matches("[A-Za-z0-9_-]{1,100}")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "게시 요청 번호가 필요합니다.");
        }
        users.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다."));
        try {
            String hash = HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(mapper.writeValueAsString(payload).getBytes(StandardCharsets.UTF_8)));
            requests.reserve(userId, key, "pending");
            var record = requests.findForUpdate(userId, key).orElseThrow();
            var previous = "pending".equals(record.getPayloadHash())
                    ? java.util.Optional.<PublicationRequest>empty() : java.util.Optional.of(record);
            if (previous.isPresent()) {
                if ("cancelled".equals(previous.get().getPayloadHash())) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "이전 게시 요청은 종료되었습니다.");
                }
                if (!previous.get().getPayloadHash().equals(hash)) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "같은 게시 요청 번호에 다른 내용을 사용할 수 없습니다.");
                }
                return mapper.readValue(previous.get().getResponseJson(), NoteResponse.class);
            }
            NoteResponse response = notes.createNote(userId, payload);
            record.complete(hash, mapper.writeValueAsString(response));
            requests.saveAndFlush(record);
            return response;
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (java.io.IOException | java.security.NoSuchAlgorithmException exception) {
            throw new IllegalStateException("게시 요청 결과 기록에 실패했습니다.", exception);
        }
    }
}

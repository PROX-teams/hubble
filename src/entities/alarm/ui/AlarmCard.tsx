import Avatar from "@/entities/user/ui/avatar/Avatar";
import * as S from "./Alarm.css";
import CheckIcon from "@/shared/assets/icons/alarm/alarm-check.svg";

interface AlarmCardProps {
  userId: number; // 사용자 고유 ID (아바타 컴포넌트에 전달)
  date: string; // 알림 날짜
  message: string; // 알림 내용
  isDone: boolean; // 알림 확인 여부
  userName: string; // 크리에이터명
  imageUrl?: string; // 프로필 이미지 URL (아바타 컴포넌트에 전달)
}

export default function AlarmCard({
  date,
  message,
  isDone = false,
  userId,
  imageUrl,
  userName,
}: AlarmCardProps) {
  return (
    <li className={S.container}>
      <Avatar size={20} src={imageUrl} name={userName} userId={userId} />

      <div className={S.innerWrapper}>
        <div className={S.contentWrapper}>
          <div className={S.meta}>
            <strong className={S.userName}>{userName}</strong>
            <span className={S.date}>{date}</span>
          </div>
          <p className={S.message}>{message}</p>
        </div>

        {!isDone && (
          <div className={S.checkWrapper}>
            <CheckIcon className={S.check} />
          </div>
        )}
      </div>
    </li>
  );
}

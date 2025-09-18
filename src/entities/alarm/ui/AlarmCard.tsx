import Avatar from "@/entities/user/ui/avatar/Avatar";
import * as S from "./AlarmCard.css";
import { Alarm } from "../alarm.types";

interface AlarmCardProps extends Alarm {
  actionSlot?: React.ReactNode; // 알림 체크 액션 버튼 슬롯
}

export default function AlarmCard({
  date,
  message,
  isDone = false,
  userId,
  imageUrl,
  userName,
  actionSlot,
}: AlarmCardProps) {
  return (
    <div className={S.container}>
      <Avatar size={20} src={imageUrl} name={userName} userId={userId} />

      <div className={S.innerWrapper}>
        <div className={S.contentWrapper}>
          <div className={S.meta}>
            <strong className={S.userName}>{userName}</strong>
            <span className={S.date}>{date}</span>
          </div>
          <p className={S.message}>{message}</p>
        </div>

        {!isDone && actionSlot}
      </div>
    </div>
  );
}

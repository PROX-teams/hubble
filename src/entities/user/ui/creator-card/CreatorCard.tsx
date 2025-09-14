import Link from "next/link";
import Avatar from "@/entities/user/ui/avatar/Avatar";
import * as S from "./CreatorCard.css";

interface CreatorCardProps {
  userId: number; // 사용자 고유 ID
  imageUrl?: string; // 프로필 이미지 URL
  name: string; // 크리에이터명
  introduction?: string; // 소개글
}

/**
 * 크리에이터 카드 컴포넌트입니다.
 * 클릭 시 해당 크리에이터의 대시보드 페이지로 이동합니다.
 */

export default function CreatorCard({
  userId,
  imageUrl,
  name,
  introduction,
}: CreatorCardProps) {
  return (
    <Link href={`/dashboard/${userId}`} className={S.container}>
      <Avatar size={38} src={imageUrl} name={name} userId={userId} />

      <div className={S.contentWrapper}>
        <strong className={S.name}>{name}</strong>
        {introduction && introduction.length > 0 && (
          <p className={S.introduction}>{introduction}</p>
        )}
      </div>
    </Link>
  );
}

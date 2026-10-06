"use client";

import React from "react";
import Avatar from "@/entities/user/ui/avatar/Avatar";
import type { UserInfo } from "@/entities/user/user.types";
import type { Note } from "@/entities/note/note.types";
import { CreatorAboutCard } from "./CreatorAboutCard";
import { ContributionLog } from "@/widgets/contribution-log/ui/ContributionLog";
import * as S from "./CreatorProfileCard.css";

interface CreatorProfileCardProps {
  userId: number;
  creator?: UserInfo;
  notes?: Note[];
}

/**
 * 크리에이터 스토리북 상단 프로필 위젯
 * - 상단 프로필 헤더 (아바타, 닉네임, 직무)
 * - 하단 2단 그리드: About 소개 카드 & 기여도 로그(Contribution Log)
 */
export const CreatorProfileCard = ({
  userId,
  creator,
  notes = [],
}: CreatorProfileCardProps) => {
  return (
    <section className={S.profileSection} aria-label="크리에이터 프로필">
      {/* 1. 상단 프로필 요약 헤더 */}
      <div className={S.profileHeader}>
        <div className={S.profileInfoGroup}>
          <Avatar
            size={65}
            src={creator?.profileImageUrl}
            name={creator?.nickname ?? "Creator"}
            userId={userId}
          />
          <div className={S.profileTextGroup}>
            <h1 className={S.profileName}>{creator?.nickname ?? "크리에이터"}</h1>
            <p className={S.profileRole}>{creator?.role ?? "Software Engineer"}</p>
          </div>
        </div>
      </div>

      {/* 2. 2단 그리드 (About 카드 & Contribution Log 카드) */}
      <div className={S.gridCards}>
        <CreatorAboutCard
          email={creator?.email}
          githubUrl={creator?.githubUrl}
          bio={creator?.bio}
          nickname={creator?.nickname}
        />
        <ContributionLog notes={notes} />
      </div>
    </section>
  );
};

export default CreatorProfileCard;

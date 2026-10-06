"use client";

import React from "react";
import EmailCopyButton from "@/features/dashboard/copy-email/ui/email-copy-button/EmailCopyButton";
import GithubLinkButton from "@/features/dashboard/visit-github/ui/github-link-button/GithubLinkButton";
import * as S from "./CreatorAboutCard.css";

interface CreatorAboutCardProps {
  email?: string;
  githubUrl?: string;
  bio?: string;
  nickname?: string;
}

const DEFAULT_BIO =
  "생각과 지식을 기록하고 공유하는 크리에이터입니다. 지속 가능한 성장을 위한 개발 이야기와 프로젝트 경험을 담고 있습니다.";

export const CreatorAboutCard = ({
  email,
  githubUrl,
  bio,
  nickname,
}: CreatorAboutCardProps) => {
  const displayBio = bio || DEFAULT_BIO;
  const effectiveGithubUrl = githubUrl || (nickname ? `https://github.com/${nickname}` : "https://github.com");

  return (
    <article className={S.card} aria-label="크리에이터 소개">
      <header className={S.header}>
        <h3 className={S.title}>About</h3>
        <div className={S.actionGroup}>
          {email && <EmailCopyButton email={email} size="xs" />}
          <GithubLinkButton href={effectiveGithubUrl} />
        </div>
      </header>
      <p className={S.content}>{displayBio}</p>
    </article>
  );
};

export default CreatorAboutCard;

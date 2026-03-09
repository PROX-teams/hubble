import * as S from "./GithubLinkButton.css";
import GithubIcon from "@/shared/assets/logo/github.svg";

interface GithubLinkButtonProps {
  href: string;
}

/**
 * 사용자의 깃허브 주소로 이동시키는 라우팅 버튼입니다.
 */

export default function GithubLinkButton({ href }: GithubLinkButtonProps) {
  return (
    <a href={href} className={S.container} target="_blank">
      <GithubIcon className={S.icon} />
      Github
    </a>
  );
}

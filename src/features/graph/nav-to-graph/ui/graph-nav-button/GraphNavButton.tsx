import RoutingIcon from "@/shared/assets/icons/main/routing.svg";
import * as S from "./GraphNavButton.css";
import Link from "next/link";

/**
 * Node Graph 페이지로 이동시키는 라우팅 버튼입니다.
 */

export default function GraphNavButton() {
  return (
    <Link href="/graph" className={S.container}>
      Node Graph 경험해 보기
      <div className={S.iconWrapper}>
        <RoutingIcon className={S.icon} />
      </div>
    </Link>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import * as S from "./Avatar.css";
import getAvatarStyles from "@/entities/user/lib/styles/getAvatarStyles";

interface AvatarProps {
  size?: number; // width, height 크기 (기본값: 40)
  src?: string; // 이미지 URL
  name?: string; // 사용자 이름 (이미지가 없을 때 첫 글자 표시)
  userId: number; // 유저 고유 ID (배경색 결정용)
}

/**
 * 사용자의 프로필 이미지를 표시하는 아바타 컴포넌트입니다.
 * - 이미지가 없을 경우, 사용자 이름의 첫 글자를 표시합니다.
 * - 배경색은 userId를 기반으로 결정됩니다.
 */

export default function Avatar({ size = 40, src, name, userId }: AvatarProps) {
  const [isError, setIsError] = useState<boolean>(false);
  const showImg = !!src && !isError;
  const dynamicStyles = getAvatarStyles(size, userId, showImg);

  useEffect(() => {
    if (src) setIsError(false);
  }, [src]);

  const handleError = () => setIsError(true);

  return (
    <div className={S.container} style={dynamicStyles}>
      {showImg ? (
        <Image
          src={src}
          width={size}
          height={size}
          alt="profile-image"
          className={S.img}
          onError={handleError}
        />
      ) : (
        <span className={S.text}>{name?.[0]}</span>
      )}
    </div>
  );
}

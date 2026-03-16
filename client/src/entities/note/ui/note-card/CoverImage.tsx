import Image from "next/image";
import { dimmedOverlay, imgWrapper } from "./NoteCard.css";
import { Variant } from "./NoteCard";

interface CoverImageProps {
  imageUrl: string;
  variant: Variant;
  priority?: boolean;
}

// next.config.ts의 remotePatterns와 동기화된 허용 도메인 목록
const ALLOWED_HOSTS = ["velog.velcdn.com", "localhost"];

const isAllowedHost = (url: string) => {
  try {
    // 상대 경로는 허용
    if (url.startsWith("/")) return true;
    
    const { hostname } = new URL(url);
    return ALLOWED_HOSTS.includes(hostname);
  } catch {
    // 유효하지 않은 URL 형식일 경우 차단
    return false;
  }
};

export default function CoverImage({ imageUrl, variant, priority = false }: CoverImageProps) {
  // 허용되지 않은 도메인이거나 가짜 데이터인 경우, next/image 에러를 방지하기 위해 렌더링하지 않음
  const isValidImage = imageUrl && isAllowedHost(imageUrl);

  return (
    <div className={imgWrapper({ variant })}>
      {isValidImage ? (
        <Image
          src={imageUrl}
          alt="cover-image"
          fill
          style={{ objectFit: "cover" }}
          priority={priority}
        />
      ) : (
        /* 이미지가 없거나 잘못된 주소일 때 보여줄 기본 배경 (Placeholder) */
        <div 
          style={{ 
            width: '100%', 
            height: '100%', 
            backgroundColor: '#f3f4f6', // 기본 회색 배경
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af',
            fontSize: '12px'
          }} 
        >
          No Image
        </div>
      )}

      {/* dimmed */}
      <div className={dimmedOverlay} />
    </div>
  );
}

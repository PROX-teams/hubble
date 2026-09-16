import Image from "next/image";
import { dimmedOverlay, imgWrapper } from "./NoteCard.css";
import { Variant } from "./NoteCard";

interface CoverImageProps {
  imageUrl?: string;
  variant: Variant;
  priority?: boolean;
}

// variant별 카드 너비에 최적화된 반응형 sizes 정의 (불필요한 고해상도 이미지 다운로드 방지)
const SIZES_BY_VARIANT: Record<Variant, string> = {
  small: "(max-width: 768px) 50vw, 202px",
  large: "(max-width: 768px) 100vw, 305px",
  wide: "(max-width: 768px) 100vw, 382px",
  compact: "236px",
};

// 이미지 다운로드 대기 시간 동안 보여줄 가벼운 쉬머 블러 플레이스홀더 (Base64)
const SHIMMER_SVG = `
<svg width="200" height="200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f1f5f9" offset="20%" />
      <stop stop-color="#e2e8f0" offset="50%" />
      <stop stop-color="#f1f5f9" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="#f1f5f9" />
  <rect id="r" width="200" height="200" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-200" to="200" dur="1.2s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

const BLUR_DATA_URL = `data:image/svg+xml;base64,${toBase64(SHIMMER_SVG)}`;

const isValidUrl = (url: string) => {
  if (url.startsWith("/")) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export default function CoverImage({ imageUrl, variant, priority = false }: CoverImageProps) {
  const isValid = imageUrl && isValidUrl(imageUrl);

  return (
    <div className={imgWrapper({ variant })}>
      {isValid ? (
        <Image
          src={imageUrl}
          alt="cover-image"
          fill
          sizes={SIZES_BY_VARIANT[variant] ?? "250px"}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          style={{ objectFit: "cover" }}
          priority={priority}
        />
      ) : (
        /* 이미지가 없거나 잘못된 주소일 때 보여줄 기본 배경 */
        <div 
          style={{ 
            width: '100%', 
            height: '100%', 
            backgroundColor: '#f3f4f6',
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

      {/* dimmed 오버레이 */}
      <div className={dimmedOverlay} />
    </div>
  );
}

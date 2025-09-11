import Image from "next/image";
import { dimmedOverlay, imgWrapper } from "./ArticleCard.css";
import { Variant } from "./ArticleCard";

interface CoverImageProps {
  imageUrl: string;
  variant: Variant;
}

export default function CoverImage({ imageUrl, variant }: CoverImageProps) {
  return (
    <div className={imgWrapper({ variant })}>
      <Image
        src={imageUrl}
        alt="cover-image"
        fill
        style={{ objectFit: "cover" }}
      />

      {/* dimmed */}
      <div className={dimmedOverlay} />
    </div>
  );
}

import Image from "next/image";
import { dimmedOverlay, imgWrapper } from "./NoteCard.css";
import { Variant } from "./NoteCard";

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

'use client';

import { useRef } from 'react';
import { Carousel, type CarouselRef } from "@/shared/ui/carousel/Carousel";
import { CarouselButton } from "@/shared/ui/carousel/CarouselButton";
import NoteCard from "@/entities/note/ui/note-card/NoteCard";
import articleMock from '@/shared/mock/article.json';

// 테스트용 mock 데이터 생성 (12개)
const mockArticles = Array.from({ length: 12 }, (_, i) => ({
  ...articleMock,
  id: i + 1,
  title: `${i + 1}번째: ${articleMock.title}`,
}));

export default function MainPage() {
  const carouselRef = useRef<CarouselRef>(null);

  return (
    <div style={{ padding: '40px' }}>
        <div>
          <CarouselButton direction="prev" onClick={() => carouselRef.current?.prev()} />
          <CarouselButton direction="next" onClick={() => carouselRef.current?.next()} />
        </div>

      <div style={{ width: '1000px' }}>
        <Carousel ref={carouselRef} visibleCount={4} interval={4000}>
          {mockArticles.map((article) => (
            <NoteCard 
              key={article.id} 
              data={article} 
              variant="small"
            />
          ))}
        </Carousel>
      </div>
    </div>
  );
}

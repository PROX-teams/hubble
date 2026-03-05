'use client';

import { useRef } from 'react';
import { Carousel, type CarouselRef } from "@/shared/ui/carousel/Carousel";
import { CarouselButton } from "@/shared/ui/carousel/CarouselButton";
import NoteCard from "@/entities/note/ui/note-card/NoteCard";
import articleMock from '@/shared/mock/article.json';
import { MainBanner } from '@/widgets/main-banner/MainBanner';
import * as s from './page.css';

// 테스트용 mock 데이터 생성 (12개)
const mockArticles = Array.from({ length: 12 }, (_, i) => ({
  ...articleMock,
  id: i + 1,
  title: `${i + 1}번째: ${articleMock.title}`,
}));

export default function MainPage() {
  const carouselRef = useRef<CarouselRef>(null);

  // 배너의 레이아웃이 컴포넌트 자체에 의해 조절되고 있다. (아니 고정값이다.) 
  return (
    <div className={s.pageContainer}>
      <MainBanner />
      <div className={s.contentSection}>
        <div className={s.sectionHeader}>
          <h2 className={s.sectionTitle}>추천 아티클</h2>
            <CarouselButton direction="prev" onClick={() => carouselRef.current?.prev()} />
            <CarouselButton direction="next" onClick={() => carouselRef.current?.next()} />
        </div>
        <div className={s.carouselWrapper}>
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
    </div>
  );
}

'use client';

import { useRef } from 'react';
import { Carousel, type CarouselRef } from "@/shared/ui/carousel/Carousel";
import { CarouselButton } from "@/shared/ui/carousel/CarouselButton";
import NoteCard from "@/entities/note/ui/note-card/NoteCard";
import articleMock from '@/shared/mock/article.json';
import creatorMock from '@/shared/mock/creator.json';
import { MainBanner } from '@/widgets/main-banner/MainBanner';
import * as s from './page.css';
import CreatorCard from '@/entities/user/ui/creator-card/CreatorCard';

// 테스트용 mock 데이터 생성 (12개)
const mockArticles = Array.from({ length: 12 }, (_, i) => ({
  ...articleMock,
  id: i + 1,
  title: `${i + 1}번째: ${articleMock.title}`,
}));

const mockCreators = Array.from({ length: 6 }, (_, i) => {
  const original = creatorMock[i % creatorMock.length];
  return {
    ...original,
    userId: i + 1,
    name: `${original.name}${i + 1}`,
  };
});

export default function MainPage() {
  const carouselRef = useRef<CarouselRef>(null);

  return (
    <div>
    <div className={s.pageContainer}>
      <div className={s.firstcontainer}>
        <MainBanner />  
        <div className={s.container}>
          <div className={s.contentSection}>
            {/* Most Loved 섹션 */}
            <div className={s.sectionHeader}>
              <h2 className={s.sectionTitle}>Most Loved</h2>
              <div className={s.buttonGroup}>
                <CarouselButton direction="prev" onClick={() => carouselRef.current?.prev()} />
                <CarouselButton direction="next" onClick={() => carouselRef.current?.next()} />
              </div>
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
      </div>
      {/* Trending Creators 섹션 */}
      <div className={s.creatorsSection}>
        <h2 className={s.sectionTitle}>Trending Creators</h2>
        <div className={s.creatorsWrapper}>
          {mockCreators.map((creator) => (
            <CreatorCard
              key={creator.userId}
              userId={creator.userId}
              name={creator.name}
              imageUrl={creator.imageUrl}
              introduction={creator.introduction}
            />
          ))}
        </div>
      </div>
    </div>
    {/*이부분에 구분선이 있어야할듯 */}
    <div className={s.divider} />
    {/*여러가지 캐러셀이 올라갈것 가장인기 많은 그주에 인기많은 등등*/}
    <div className={s.container}>
      <div className={s.contentSection}>
        {/* Most Loved 섹션 */}
        <div className={s.sectionHeader}>
          <h2 className={s.sectionTitle}>Most Loved</h2>
        </div>
        <div className={s.carouselWrapper}>
          <Carousel visibleCount={4} interval={4000}>
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
  {/*예시 두번째*/}
    <div className={s.container}>
      <div className={s.contentSection}>
        {/* Most Loved 섹션 */}
        <div className={s.sectionHeader}>
          <h2 className={s.sectionTitle}>Most Loved</h2>
        </div>
        <div className={s.carouselWrapper}>
          <Carousel visibleCount={4} interval={4000}>
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


    </div>
  );
}

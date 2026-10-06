
import { MainBanner } from '@/widgets/main-banner/MainBanner';
import { MostLovedSection } from '@/widgets/most-loved-section';
import { TrendingCreatorsSection } from '@/widgets/trending-creators-section';
import { DiscoverSection } from '@/widgets/discover-section';
import { TrendingStoriesSection } from '@/widgets/trending-stories-section';
import * as s from './page.css';

export default function MainPage() {
  return (
    <div className={s.pageContainer}>
      <MainBanner />
      <div className={s.middleSection}>
        <MostLovedSection />
        <TrendingCreatorsSection />
      </div>
      <div className={s.divider} />
      <DiscoverSection />
      <div className={s.divider} />
      <TrendingStoriesSection />
    </div>
  );
}

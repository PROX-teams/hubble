import Image from 'next/image';
import * as s from './MainBanner.css';
import mainBannerImg from '@/shared/assets/images/banner/main-banner.png';

// 텍스트와 내부 컨텐츠를 박을 수 있으면 더 좋을 듯, 추후 디벨롭
export const MainBanner = () => {
  return (
    <section className={s.bannerContainer}>
      <Image
        src={mainBannerImg}
        alt="메인 배너"
        fill
        priority
        className={s.bannerImage}
        placeholder="blur"
      />
      <div className={s.contentWrapper}>
        {/* 폰트는 어떻게 적용할거야?? 해당 태그 적절해? */}
        <h1 className={s.title}>
          IT 직군을 위한<br />
          성장형 컨텐츠 플랫폼, PROX
        </h1>
      </div>
    </section>
  );
};

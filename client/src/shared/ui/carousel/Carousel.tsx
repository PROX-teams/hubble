'use client';

import { Children, forwardRef, useImperativeHandle } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import * as s from './Carousel.css';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { useCarousel } from '../../model/hooks/useCarousel';

export interface CarouselRef {
  next: () => void;
  prev: () => void;
}

interface CarouselProps {
  children: ReactNode[];
  visibleCount?: number;
  interval?: number;
}

export const Carousel = forwardRef<CarouselRef, CarouselProps>(
  ({ children, visibleCount = 4, interval = 5000 }, ref) => {
    const items = Children.toArray(children);
    const { currentIndex, controls, isLoop, move } = useCarousel({
      total: items.length,
      visibleCount,
      interval,
    });

    const displayItems = isLoop
      ? [
          ...items.slice(-visibleCount).map((item, i) => ({
            node: item,
            key: `clone-prev-${(item as React.ReactElement)?.key ?? i}`,
          })),
          ...items.map((item, i) => ({
            node: item,
            key: `item-${(item as React.ReactElement)?.key ?? i}`,
          })),
          ...items.slice(0, visibleCount).map((item, i) => ({
            node: item,
            key: `clone-next-${(item as React.ReactElement)?.key ?? i}`,
          })),
        ]
      : items.map((item, i) => ({
          node: item,
          key: `item-${(item as React.ReactElement)?.key ?? i}`,
        }));

    useImperativeHandle(ref, () => ({
      next: () => move(1),
      prev: () => move(-1),
    }), [move]);

    return (
      <div
        className={s.carouselContainer}
        style={assignInlineVars({ [s.visibleCountVar]: String(visibleCount) })}
      >
        <motion.div
          className={s.carouselTrack}
          initial={{ x: `-${(currentIndex / visibleCount) * 100}%` }}
          animate={controls}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {displayItems.map(({ node, key }) => (
            <div key={key} className={s.carouselItem}>
              {node}
            </div>
          ))}
        </motion.div>
      </div>
    );
  }
);

Carousel.displayName = 'Carousel';

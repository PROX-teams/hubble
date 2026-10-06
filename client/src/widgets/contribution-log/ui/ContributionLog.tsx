"use client";

import React, { useMemo } from "react";
import clsx from "clsx";
import type { Note } from "@/entities/note/note.types";
import { calculateContributionData } from "../model/contribution.utils";
import * as S from "./ContributionLog.css";

interface ContributionLogProps {
  notes?: Note[];
  numWeeks?: number;
  className?: string;
}

const LEVEL_CLASS_MAP = {
  0: S.cellLevel0,
  1: S.cellLevel1,
  2: S.cellLevel2,
  3: S.cellLevel3,
  4: S.cellLevel4,
};

export const ContributionLog = ({
  notes = [],
  numWeeks = 20,
  className,
}: ContributionLogProps) => {
  const { weeks, monthLabels, totalContributions } = useMemo(
    () => calculateContributionData(notes, numWeeks),
    [notes, numWeeks]
  );

  return (
    <article className={clsx(S.card, className)} aria-label="기여도 로그">
      <header className={S.header}>
        <h3 className={S.title}>Contribution Log</h3>
      </header>
        <div className={S.graphWrapper}>
          {/* 상단 월 라벨 행 */}
          <div className={S.monthRow}>
            {monthLabels.map((m, idx) => (
              <span key={`${m.monthName}-${idx}`} className={S.monthLabel}>
                {m.monthName}
              </span>
            ))}
          </div>

          {/* 7행 × 주차별 사각형 잔디 그리드 */}
          <div className={S.grid}>
            {weeks.map((week, wIdx) =>
              week.days.map((day, dIdx) => (
                <div
                  key={`${wIdx}-${dIdx}-${day.date}`}
                  className={clsx(S.cell, LEVEL_CLASS_MAP[day.level])}
                  title={`${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}`}
                />
              ))
            )}
          </div>
        </div>

        {/* 하단 총 기여수 및 범례 */}
        <footer className={S.footer}>
          <div className={S.countText}>
            <strong>{totalContributions.toLocaleString()}</strong>
            <span className={S.countSub}>Contributions</span>
          </div>

          <div className={S.legend}>
            <span className={S.legendText}>Less</span>
            <span className={clsx(S.legendCell, S.cellLevel0)} />
            <span className={clsx(S.legendCell, S.cellLevel1)} />
            <span className={clsx(S.legendCell, S.cellLevel2)} />
            <span className={clsx(S.legendCell, S.cellLevel3)} />
            <span className={clsx(S.legendCell, S.cellLevel4)} />
            <span className={S.legendText}>More</span>
          </div>
        </footer>
    </article>
  );
};

export default ContributionLog;

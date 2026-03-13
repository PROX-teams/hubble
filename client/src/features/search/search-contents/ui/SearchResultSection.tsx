import React, { ReactNode } from "react";
import * as S from "./SearchContents.css";

interface SearchResultSectionProps {
  title: string;
  children: ReactNode;
  isEmpty: boolean;
  emptyMessage: string;
  isLoading?: boolean;
}

export function SearchResultSection({ 
  title, 
  children, 
  isEmpty, 
  emptyMessage, 
  isLoading 
}: SearchResultSectionProps) {
  return (
    <section className={S.section}>
      <h3 className={S.sectionTitle}>{title}</h3>
      <div className={S.sectionlist}>
        {isEmpty && !isLoading ? (
          <span>{emptyMessage}</span>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

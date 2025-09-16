import { ComponentProps } from 'react';
import { AccordionContent } from './AccordionContent';
import { AccordionHeader } from './AccordionHeader';
import { AccordionContextProvider } from '@/shared/model/contexts/AccordionContextProvider';
import { AccordionTrigger } from './AccordionTrigger';
import {AccordionWrapper} from './AccordionWrapper';
/**
 * Accordion 컴포넌트
 *
 * 아코디언 UI를 구현하기 위한 루트 컴포넌트입니다.
 * ContextProvider를 통해 열림/닫힘 상태를 관리하며,
 * Compound Pattern으로 `Accordion.Header`, `Accordion.Trigger`, `Accordion.Content`를 함께 제공합니다.
 *
 * @example 기본 사용법
 * <Accordion>
 *   <Accordion.Header>
 *     <Accordion.Trigger>섹션 1</Accordion.Trigger>
 *   </Accordion.Header>
 *   <Accordion.Content>
 *     아코디언 콘텐츠 내용
 *   </Accordion.Content>
 * </Accordion>
 *
 * @see Accordion.Header - 아코디언 섹션 헤더 (트리거를 감싸는 래퍼)
 * @see Accordion.Trigger - 아코디언 열림/닫힘을 토글하는 버튼
 * @see Accordion.Content - 아코디언 열림 시 표시되는 콘텐츠 영역
 */

export default function AccordionRoot({children, ...props}:ComponentProps<typeof AccordionWrapper>) {

  return(
    <AccordionContextProvider>
      <AccordionWrapper {...props}>{children}</AccordionWrapper>
    </AccordionContextProvider>
  )
}

AccordionRoot.displayName = 'Accordion';

export const Accordion = Object.assign(AccordionRoot, {
  Content: AccordionContent,
  Header:AccordionHeader,
  Trigger: AccordionTrigger
});
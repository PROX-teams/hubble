import { forwardRef, ComponentPropsWithoutRef } from 'react';
import { breadcrumbStyle } from './Breadcrumb.css';
import BreadcrumbItem from './BreadcrumbItem';
import BreadcrumbSeparator from './BreadcrumbSeparator';
import BreadcrumbList from './BreadcrumList';
import clsx from "clsx";

/**
 * Breadcrumb 컴포넌트
 *
 * 페이지 경로를 단계적으로 보여주는 내비게이션 컴포넌트.
 *
 * ### Compound 구조
 * - `Breadcrumb.Item` : 각 경로 단위를 감싸는 요소
 * - `Breadcrumb.Separator` : 아이템 사이의 구분자
 * - `Breadcrumb.List` : Item과 Separator를 포함하는 리스트 컨테이너
 *
 * @example 기본 사용법

 * <Breadcrumb>
 *   <Breadcrumb.List separator={separator}>
 *     <Breadcrumb.Item>
 *       <a href="/home">Home</a>
 *     </Breadcrumb.Item>
 *     <Breadcrumb.Item>
 *       <a href="/products">Example1</a>
 *     </Breadcrumb.Item>
 *     <Breadcrumb.Item>
 *       <span>Example2</span>
 *     </Breadcrumb.Item>
 *   </Breadcrumb.List>
 * </Breadcrumb>
 */


const BreadcrumbRoot = forwardRef<
  HTMLElement,
  ComponentPropsWithoutRef<"nav">
>(({className, ...props }, ref) => <nav ref={ref} className={clsx(breadcrumbStyle,className) } {...props} />
)

BreadcrumbRoot.displayName = "Breadcrumb"

export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  Item: BreadcrumbItem,
  Separator: BreadcrumbSeparator,
  List:BreadcrumbList
});
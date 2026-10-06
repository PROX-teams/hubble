
import clsx from 'clsx';
import { useSidebarStore } from '@/shared/model/stores/useSidebarStore';
import SidebarButtonIcon from '@/shared/assets/icons/common/sidebar-button.svg';
import * as s from './SidebarButton.css';

export interface SidebarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const SidebarButton = ({
  className,
  onClick,
  title = '사이드바 열기/닫기',
  ...props
}: SidebarButtonProps) => {
  const { toggleSidebar } = useSidebarStore();

  return (
    <button
      type="button"
      className={clsx(s.button, className)}
      onClick={onClick ?? toggleSidebar}
      title={title}
      aria-label={title}
      {...props}
    >
      <SidebarButtonIcon />
    </button>
  );
};


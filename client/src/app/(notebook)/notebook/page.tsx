import { redirect } from 'next/navigation';
import { PATHS } from '@/shared/constants/paths';

export default function NotebookPage() {
  redirect(PATHS.NOTEBOOK_NEW);
}

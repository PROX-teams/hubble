'use client';

import { usePathname } from "next/navigation";
import { SideBar } from "@/shared/ui/sidebar/SideBar";
import { NotebookMetaEditor } from "./notebook-meta-editor/NotebookMetaEditor";
import { useSidebarStore } from "@/shared/model/stores/useSidebarStore";
import * as s from './NotebookMetaSidebar.css';

export const NotebookMetaSidebar = () => {
    const pathname = usePathname();
    const { isSidebarOpen } = useSidebarStore();

    // 새 글 작성(/notebook/new) 또는 수정(/notebook/[id]/edit)인 경우에만 글 설정창 노출
    const isEditOrNew = pathname === '/notebook/new' || pathname.endsWith('/edit');

    return (
        <SideBar
            position="right"
            isSidebarOpen={isSidebarOpen}
            className={s.sidebarContainer} 
        >
            {isEditOrNew ? (
                <NotebookMetaEditor />
            ) : (
                <div className={s.commentPlaceholder}>
                    댓글 기능 구현 예정
                </div>
            )}
        </SideBar>
    );
};
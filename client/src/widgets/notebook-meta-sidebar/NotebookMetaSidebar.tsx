import { usePathname } from "next/navigation";
import { SideBar } from "@/shared/ui/sidebar/SideBar";
import { NotebookMetaEditor } from "../notebook-meta-editor/NotebookMetaEditor";
import { useSidebarStore } from "@/shared/model/stores/useSidebarStore";
import * as s from './NotebookMetaSidebar.css';

export const NotebookMetaSidebar = () => {
    const pathname = usePathname();
    const { isSidebarOpen} = useSidebarStore();
    const isDetailPage = /^\/notebook\/\d+$/.test(pathname);

    return(
        <SideBar
            position="right"
            isSidebarOpen={isSidebarOpen}
            className={s.sidebarContainer} 
        >
            {isDetailPage ? (
                <>
                    <div>
                        디테일 페이지 임시 사이드바 - 댓글 기능 구현 예정
                    </div>
                
                </>

            ):(
                <>
                    <NotebookMetaEditor/>    
                </>
            )}
        </SideBar>

        

    )
}
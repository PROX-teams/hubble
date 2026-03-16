
import { useSidebarStore } from '@/shared/model/stores/useSidebarStore';
import SidebarButtonIcon from '@/shared/assets/icons/common/sidebar-button.svg'

import * as s from './SidebarButton.css';

export const SidebarButton = () => {
    const { toggleSidebar } = useSidebarStore();

    return (
        <button 
            className={s.button}
            onClick={toggleSidebar}
        > 
            <SidebarButtonIcon/>
        </button>
    )
}


import React from 'react';
import { Tab } from '@/shared/ui/tab-menu/TabMenuRoot';
import MyNoteList from './MyNoteList';
import BookmarkList from './BookmarkList';
import * as S from './NotebookSidebar.css';
import { SideBar } from '@/shared/ui/sidebar/SideBar';

export const NotebookSidebar = () => {
  return (
    <SideBar isSidebarOpen={true} position="left">
      <div className={S.container}>
        <Tab>
          <Tab.List className={S.tabList}>
            <Tab.Item tabIndex={0} className={S.tabItem} activeStyle={S.activeTab}>My Note</Tab.Item>
            <Tab.Item tabIndex={1} className={S.tabItem} activeStyle={S.activeTab}>Bookmark</Tab.Item>
            <Tab.Item tabIndex={2} className={S.tabItem} activeStyle={S.activeTab}>Save</Tab.Item>
          </Tab.List>
          <Tab.Panels className={S.tabPanels}>
            <Tab.Panel tabIndex={0}>
              <MyNoteList />
            </Tab.Panel>
            <Tab.Panel tabIndex={1}>
              <BookmarkList />
            </Tab.Panel>
          </Tab.Panels>
        </Tab>
      </div>
    </SideBar>
  );
};

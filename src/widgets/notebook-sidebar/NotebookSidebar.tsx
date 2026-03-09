import React from 'react';
import { Tab } from '@/shared/ui/tab-menu/TabMenuRoot';
import MyNoteList from './MyNoteList';
import DraftNoteList from './DraftNoteList';
import BookmarkList from './BookmarkList';
import * as S from './NotebookSidebar.css';

export const NotebookSidebar = () => {
  return (
    <div className={S.container}>
      <Tab>
        <Tab.List className={S.tabList}>
          <Tab.Item tabIndex={0} className={S.tabItem} activeStyle={S.activeTab}>저장한 노트</Tab.Item>
          <Tab.Item tabIndex={1} className={S.tabItem} activeStyle={S.activeTab}>작성 중</Tab.Item>
          <Tab.Item tabIndex={2} className={S.tabItem} activeStyle={S.activeTab}>북마크</Tab.Item>
        </Tab.List>
        <Tab.Panels className={S.tabPanels}>
          <Tab.Panel tabIndex={0}>
            <MyNoteList />
          </Tab.Panel>
          <Tab.Panel tabIndex={1}>
            <DraftNoteList />
          </Tab.Panel>
          <Tab.Panel tabIndex={2}>
            <BookmarkList />
          </Tab.Panel>
        </Tab.Panels>
      </Tab>
    </div>
  );
};

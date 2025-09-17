"use client";

import clsx from "clsx";
import { Dropdown } from "@/shared/ui/dropdown/Dropdown";
import AlarmDropdownTrigger from "@/features/alarm/toggle-dropdown/ui/AlarmDropdownTrigger";
import * as S from "./AlarmDropdown.css";
import { Tab } from "@/shared/ui/tab-menu/TabMenuRoot";
import { ALARM_TABS } from "@/entities/alarm/alarm.constants";
import { Alarm } from "@/entities/alarm/alarm.types";
import AlarmCard from "@/entities/alarm/ui/AlarmCard";
import MarkAsDoneButton from "@/features/alarm/mark-as-done/ui/MarkAsDoneButton";

interface AlarmDropdownProps {
  data: Alarm[]; // 알림 데이터를 배열로 받습니다.
  independent?: boolean; // 메뉴를 Context와 무관하게 독립적으로 열지 여부를 설정합니다.
}

export default function AlarmDropdown({
  data,
  independent,
}: AlarmDropdownProps) {
  return (
    <Dropdown>
      {/* 알림 드롭다운 트리거 버튼 */}
      <AlarmDropdownTrigger />

      <Dropdown.Menu
        placement="right"
        size="3xl"
        className={S.dropdownMenu}
        independent={independent ?? undefined}
      >
        <Tab className={S.container}>
          <Tab.Menus className={S.header}>
            <Tab.Menu
              tabIndex={ALARM_TABS.INBOX}
              className={clsx(S.tabMenu)}
              activeStyle={S.activeTabMenu}
            >
              Inbox
            </Tab.Menu>
            <Tab.Menu
              tabIndex={ALARM_TABS.DONE}
              className={clsx(S.tabMenu)}
              activeStyle={S.activeTabMenu}
            >
              Done
            </Tab.Menu>
          </Tab.Menus>

          <Tab.Contents className={S.content}>
            {data.map((alarm, idx) => (
              <Tab.Content
                key={idx} // 실제 데이터 연동 시 고유 ID로 변경 필요
                tabIndex={alarm.isDone ? ALARM_TABS.DONE : ALARM_TABS.INBOX}
              >
                <AlarmCard {...alarm} actionSlot={<MarkAsDoneButton />} />
              </Tab.Content>
            ))}
          </Tab.Contents>
        </Tab>
      </Dropdown.Menu>
    </Dropdown>
  );
}

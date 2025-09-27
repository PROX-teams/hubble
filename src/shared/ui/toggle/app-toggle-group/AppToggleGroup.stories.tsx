import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { AppToggleGroup, ToggleGroupType } from "./AppToggleGroup";
import { ToggleGroupRootProps } from "../toggle-group/ToggleGroupRoot";

type AppToggleGroupStoryProps = ToggleGroupRootProps & {
  type?: ToggleGroupType;
  items?: string[]; // 렌더링할 아이템들의 값 목록에 대한 타입 추가 [스토리 전용 타입]
};

const meta: Meta<AppToggleGroupStoryProps> = {
  title: "Toggle/ToggleGroup",
  component: AppToggleGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Headless \`ToggleGroup\` 컴포넌트에 디자인 시스템을 적용한 컴포넌트입니다. <br/>
사용자 인터페이스에서 여러 옵션 중 하나를 선택할 때 유용합니다.

---

이 컴포넌트는 기존 탭 메뉴와 달리, 자체적으로 상태를 관리하지 않는 '제어 컴포넌트'입니다. <br/>
컴포넌트를 사용하는 부모 레벨에서 \`useState\` 와 같은 상태 관리 로직을 구현하고, props를 통해 상태를 주입해야 합니다.

- \`value\`: 현재 선택된 아이템의 값을 전달받는 prop입니다.
- \`onValueChange\`: 아이템 선택 시, 변경된 값을 부모에게 알리는 콜백 함수입니다.
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: "radio",
      options: ["page", "sidebar"],
      description: `컴포넌트의 시각적 스타일 variant을 선택합니다.
- page: 페이지 본문에 사용되는 기본 스타일
- sidebar: 사이드바 등 컴팩트한 공간에 사용되는 스타일
      `,
    },
    value: {
      control: "text",
      description: "현재 선택된 아이템의 고유 값",
    },
    onValueChange: {
      description: "아이템 선택 시 호출될 콜백 함수",
    },

    /* 스토리에서만 사용하는 prop으로, 실제 컴포넌트에는 없음 */
    items: {
      control: "object",
      description: "토글 그룹에 표시될 아이템 `string[]` 배열입니다.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// AppToggleGroup 템플릿 컴포넌트입니다.
const Template: Story["render"] = (args) => {
  const { items = [], ...restArgs } = args;
  const [currentValue, setCurrentValue] = useState<string>(items[0]);

  return (
    <AppToggleGroup
      {...restArgs}
      value={currentValue}
      onValueChange={setCurrentValue}
    >
      {items.map((item: string) => (
        <AppToggleGroup.Item key={item} value={item} />
      ))}
    </AppToggleGroup>
  );
};

/**
 * `type="page"`는 페이지 본문 등 넓은 영역에서 사용되는 기본 스타일입니다.
 * 이 스토리는 `Threads`, `Graph` 등 다양한 페이지의 카테고리 필터에서 사용될 수 있습니다.
 */
export const PageType: Story = {
  render: Template,
  args: {
    type: "page",
    items: ["기획", "디자인", "프로그래밍"],
  },
};

/**
 * `type="sidebar"`는 사이드바 등 좁은 영역에 사용되는 컴팩트한 스타일입니다.
 * `Notebook`, `Storybook` 등의 사이드바에서 이 variant를 사용합니다.
 */
export const SidebarType: Story = {
  render: Template,
  args: {
    type: "sidebar",
    items: ["My Note", "Bookmark", "Save"],
  },
};

/**
 * 아이템이 단 하나만 존재할 경우의 UI입니다.
 */
export const SingleItem: Story = {
  render: Template,
  args: {
    type: "sidebar",
    items: ["My Story"],
  },
};

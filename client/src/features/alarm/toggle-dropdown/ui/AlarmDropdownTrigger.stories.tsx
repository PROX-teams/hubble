import type { Meta, StoryObj, StoryFn, StoryContext } from "@storybook/nextjs";
import {
  DropdownContext,
  DropdownContextType,
} from "@/shared/model/contexts/DropdownContextProvider";
import AlarmDropdownTrigger from "./AlarmDropdownTrigger";

const meta = {
  title: "Button/Trigger/Alarm",
  component: AlarmDropdownTrigger,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "알림 드롭다운을 여닫는 트리거 버튼 컴포넌트입니다. 클릭 시 드롭다운 메뉴가 토글됩니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isBoxOpen: {
      control: "boolean",
      description: "드롭다운 메뉴의 열림/닫힘 상태",
      defaultValue: false,
    },
  },
  decorators: [
    (Story: StoryFn, context: StoryContext) => {
      const isBoxOpen = context.args.isBoxOpen as boolean;

      // mock Context value 생성
      const mockContextValue: DropdownContextType = {
        isBoxOpen,
        toggleBoxOpen: () => {},
        closeBox: () => {},
        selectedId: null,
        selectedOption: null,
        selectOption: () => {},
      };

      return (
        <DropdownContext.Provider value={mockContextValue}>
          {Story(context.args, context)}
        </DropdownContext.Provider>
      );
    },
  ],
} satisfies Meta<typeof AlarmDropdownTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "기본 상태의 알림 드롭다운 트리거 버튼입니다.",
      },
    },
  },
  args: {
    isBoxOpen: false,
  },
};

export const Active: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "드롭다운 메뉴가 열려있는 상태(or 호버)일 때 알림 드롭다운 트리거 버튼입니다.",
      },
    },
  },
  args: {
    isBoxOpen: true,
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs";
import AlarmCard from "./AlarmCard";
import MarkAsDoneButton from "@/features/alarm/mark-as-done/ui/MarkAsDoneButton";

const meta = {
  title: "Card/Alarm",
  component: AlarmCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "`Inbox` 탭에 표시되는 기본 알림 카드 컴포넌트입니다. <br> 확인되지 않은 알림은 체크 아이콘이 표시되며, 확인된 알림은 `Done` 탭에 표시됩니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    userId: { control: "number", description: "사용자 ID" },
    date: { control: "text", description: "알림 날짜" },
    message: { control: "text", description: "알림 내용" },
    isDone: {
      control: "boolean",
      description: "확인 여부",
      defaultValue: false,
    },
    userName: { control: "text", description: "크리에이터명" },
    imageUrl: { control: "text", description: "프로필 이미지 URL" },
    actionSlot: {
      description: "알림 체크 액션 버튼 슬롯",
      control: { type: undefined },
    },
  },
  args: {
    userId: 1,
    date: "2025.06.29",
    message: "좋은 정보 감사합니다!",
    isDone: false,
    userName: "PROX",
    imageUrl:
      "https://velog.velcdn.com/images/vlmbuyd/post/d85be7e6-5919-4fc3-aba7-f3a38cecb677/image.png",
    actionSlot: undefined,
  },
} satisfies Meta<typeof AlarmCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "`Inbox` 탭에 표시되는 기본 알림 카드입니다.",
      },
    },
  },
  render: (args) => <AlarmCard {...args} actionSlot={<MarkAsDoneButton />} />,
};

export const Done: Story = {
  args: {
    isDone: true,
  },
  parameters: {
    docs: {
      description: {
        story: "사용자가 확인하여 'Done' 처리된 상태의 알림 카드입니다.",
      },
    },
  },
};

export const WithLongText: Story = {
  args: {
    message:
      "안녕하세요! 정말 좋은 정보 감사합니다! 앞으로도 좋은 글 많이 부탁드려요!",
  },
  parameters: {
    docs: {
      description: {
        story: "사용자가 확인하여 'Done' 처리된 상태의 알림 카드입니다.",
      },
    },
  },
  render: (args) => <AlarmCard {...args} actionSlot={<MarkAsDoneButton />} />,
};

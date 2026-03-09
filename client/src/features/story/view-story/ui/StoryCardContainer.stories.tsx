import type { Meta, StoryObj } from "@storybook/react";
import StoryGridWithModal from "./StoryCardContainer";
import data from "@/shared/mock/story.json";

const meta: Meta<typeof StoryGridWithModal> = {
  title: "StoryGrid/StoryGridWithModal",
  component: StoryGridWithModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "그리드 컴포넌트와 모달을 조합하여 카드를 클릭하면 상세 모달을 노출하는 기능 컴포넌트입니다.",
      },
    },
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <div id="modalRoot"></div>
      </>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    stories: {
      control: "object",
      description: "스토리 리스트 (StoryEntity[])",
      table: {
        type: { summary: "StoryEntity[]" },
        defaultValue: { summary: "[]" },
      },
    },
  },
} satisfies Meta<typeof StoryGridWithModal>;

export default meta;

type Story = StoryObj<typeof meta>;

const list = Array.from({ length: 6 }).map((_, i) => ({
  ...data,
  id: i + 1,
  title: `${data.title} ${i + 1}`,
}));

export const Default: Story = {
  args: { stories: list },
  render: (args) => <StoryGridWithModal {...args} />,
};

import type { Meta, StoryObj } from "@storybook/react";
import StoryCard from "./StoryCard";
import data from "./mock.json";

const meta: Meta<typeof StoryCard> = {
  title: "Card/Story",
  component: StoryCard,
   parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "스토리의 아이콘, 제목, 설명, 연결된 아티클 수 등 핵심 정보를 요약하여 보여주는 카드 컴포넌트입니다." +`\n`+
          "props로 전달된 데이터(StoryEntity)를 기반으로 렌더링됩니다."
      },
    },
  },
  tags: ["autodocs"],
    argTypes: {
    data: {
      control: "object",
      description: "더미 데이터",
      table: {
        type: { summary: "Story" },
        defaultValue: { summary: "{}" },
      },
    },
    onClick: {  action: "clicked" },
  },
} satisfies Meta<typeof StoryCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {data},
  render: (args) => <div style={{ width: "402px" }}><StoryCard {...args} /></div>,
};

import type { Meta, StoryObj } from "@storybook/react";
import StoryCard from "./StoryCard";
import data from "@/shared/mock/story.json";

const meta: Meta<typeof StoryCard> = {
  title: "Card/Story",
  component: StoryCard,
   parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "스토리의 아이콘, 제목, 설명, 연결된 아티클 수 등 핵심 정보를 요약하여 보여주는 카드 컴포넌트입니다." +`\n`+
          "props로 전달된 data(StoryEntity)를 기반으로 렌더링되며, size를 통해 카드의 크기를 'small' 또는 'large'로 조절할 수 있습니다.",
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
    size: {
      control: { type: "radio" },
      options: ["small", "large"],
      description: "카드 크기",
      table: {
        type: { summary: "'small' | 'large'" },
        defaultValue: { summary: "'large'" },
      },
    },
    onClick: {  action: "clicked" },
  },
} satisfies Meta<typeof StoryCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Large: Story = {
  args: {data, size: "large"},
  render: (args) => <div style={{ width: "394px" }}><StoryCard {...args} /></div>,
};

export const Small: Story = {
  args: {data, size: "small"},
  render: (args) => <div style={{ width: "414px" }}><StoryCard {...args} /></div>,
};

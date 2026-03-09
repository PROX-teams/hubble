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
          "props로 전달된 data(Story)를 기반으로 렌더링되며, density를 통해 카드의 밀도를 'compact' 또는 'comfortable'로 조절할 수 있습니다.",
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
    density: {
      control: { type: "radio" },
      options: ["compact", "comfortable"],
      description: "카드 밀도",
      table: {
        type: { summary: "'compact' | 'comfortable'" },
        defaultValue: { summary: "'comfortable'" },
      },
    },
    onClick: {  action: "clicked" },
  },
} satisfies Meta<typeof StoryCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Comfortable: Story = {
  args: {data, density: "comfortable"},
  render: (args) => <div style={{ width: "394px" }}><StoryCard {...args} /></div>,
};

export const Compact: Story = {
  args: {data, density: "compact"},
  render: (args) => <div style={{ width: "414px" }}><StoryCard {...args} /></div>,
};

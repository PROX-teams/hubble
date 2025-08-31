import type { Meta, StoryObj } from "@storybook/nextjs";
import SaveDraftButton from "./SaveDraftButton";

const meta = {
  title: "Button/Action/Draft",
  component: SaveDraftButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: { control: "text", description: "버튼 내부에 표시할 콘텐츠" },
    variants: {
      control: "inline-radio",
      options: ["colored", "neutral", "danger"],
      description: "버튼 유형 및 스타일",
    },
    size: {
      control: "inline-radio",
      options: ["xs", "sm", "md", "lg"],
      description: "크기",
    },
  },
  args: {
    children: "임시 저장",
    variants: "neutral",
    size: "md",
  },
} satisfies Meta<typeof SaveDraftButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Save_Draft: Story = {};

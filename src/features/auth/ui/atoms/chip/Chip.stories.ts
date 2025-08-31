import type { Meta, StoryObj } from "@storybook/nextjs";
import Chip from "./Chip";

const meta = {
  title: "Button/Auth/Chip",
  component: Chip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isSelected: { control: "boolean", description: "선택 상태 여부" },
    children: { control: "text", description: "버튼 내부에 표시할 콘텐츠" },
  },
  args: {
    isSelected: false,
    children: "기획 및 운영",
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    isSelected: true,
    children: "기획 및 운영",
  },
};

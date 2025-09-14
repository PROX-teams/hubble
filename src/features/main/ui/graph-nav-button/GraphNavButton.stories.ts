import type { Meta, StoryObj } from "@storybook/nextjs";
import NodeGraphNavButton from "./GraphNavButton";

const meta = {
  title: "Button/Route/Graph Nav",
  component: NodeGraphNavButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: { control: "text", description: "버튼 내부에 표시할 콘텐츠" },
  },
  args: {
    children: "Node Graph 경험해 보기",
  },
} satisfies Meta<typeof NodeGraphNavButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

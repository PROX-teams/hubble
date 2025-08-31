import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import SwitchToggle from "./SwitchToggle";

const meta = {
  title: "Button/Toggle/Switch",
  component: SwitchToggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isActive: {
      control: "boolean",
      description: "스위치 토글 활성화 여부",
    },
    onToggle: {
      action: "clicked",
      description: "스위치 클릭 시 호출되는 함수",
    },
  },
  args: { isActive: false, onToggle: fn() },
} satisfies Meta<typeof SwitchToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    isActive: true,
  },
};

export const Inactive: Story = {
  args: {
    isActive: false,
  },
};

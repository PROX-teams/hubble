import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Textarea } from "./Textarea";

const meta = {
  title: "Input/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
    },
    isError: {
      control: "boolean",
      description: "에러 상태 여부",
    },
    errorMessage: {
      control: "text",
      description: "에러 상태일 때 표시할 메시지",
    },
    className: { control: false },
  },
  args: {
    placeholder: "내용을 입력해 주세요",
    size: "md",
    errorMessage: "에러메세지 입니다.",
  }
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;


export const Default: Story = {};

export const Label: Story = {
  args: {
    label: "계정",
  },
};

export const error: Story = {
  args: {
    isError:true
  },
};

export const Focused: Story = {
  args: {
    autoFocus: true,  
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <Textarea {...args} size="sm" label="Small" />
      <Textarea {...args} size="md" label="Medium" />
      <Textarea {...args} size="lg" label="Large" />
    </div>
  ),
};
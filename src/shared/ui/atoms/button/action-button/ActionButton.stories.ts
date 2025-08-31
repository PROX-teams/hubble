import type { Meta, StoryObj } from "@storybook/nextjs";
import ActionButton from "./ActionButton";

const meta = {
  title: "Button/Action",
  component: ActionButton,
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
    disabled: { control: "boolean", description: "비활성화 여부" },
    wideWidth: {
      control: "boolean",
      description: "기존 너비보다 확장된 너비 적용 여부",
    },
  },
  args: {
    children: "완료",
    variants: "colored",
    size: "md",
    disabled: false,
    wideWidth: false,
  },
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Complete: Story = {};

export const Save: Story = {
  args: {
    children: "저장",
  },
};

export const Cancel: Story = {
  args: {
    children: "취소",
    variants: "neutral",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Danger: Story = {
  args: {
    children: "삭제",
    variants: "danger",
  },
};

export const CancelWide: Story = {
  args: {
    children: "취소",
    variants: "neutral",
    wideWidth: true,
  },
};

export const DangerWide: Story = {
  args: {
    children: "삭제",
    variants: "danger",
    wideWidth: true,
  },
};

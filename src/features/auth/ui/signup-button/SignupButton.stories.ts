import type { Meta, StoryObj } from "@storybook/nextjs";
import SignupButton from "./SignupButton";

const meta = {
  title: "Button/Auth/Signup",
  component: SignupButton,
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
  },
  args: {
    children: "가입 완료",
    variants: "colored",
    size: "lg",
    disabled: false,
  },
} satisfies Meta<typeof SignupButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

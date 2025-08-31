import type { Meta, StoryObj } from "@storybook/nextjs";
import EmailCopyButton from "./EmailCopyButton";

const meta = {
  title: "Button/Action/Copy",
  component: EmailCopyButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
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
    children: { control: "text", description: "버튼 텍스트" },
    email: { control: "text", description: "복사할 이메일 주소" },
    onClick: {
      action: "clicked",
      description: "버튼 클릭 이벤트 핸들러",
    },
  },
} satisfies Meta<typeof EmailCopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Email_Copy: Story = {
  args: {
    size: "xs",
    variants: "neutral",
    email: "prox@email.com",
    children: "E-mail",
  },
};

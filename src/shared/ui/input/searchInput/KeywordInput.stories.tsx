import type { Meta, StoryObj } from "@storybook/react";
import KeywordInput from "./KeywordInput";

const meta = {
  title: "Input/KeywordInput",
  component: KeywordInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {control: "text"},
    onSearch: {
      action: "onSearch",
      description: "검색 실행 시 호출되는 이벤트 핸들러입니다. 보통 Enter 입력 또는 검색 버튼 클릭 시 발생합니다.",
    },
    onChange: {
    action: "onChange",
    description: "입력 값이 변경될 때 호출되는 이벤트 핸들러입니다.",
    },
  },
} satisfies Meta<typeof KeywordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "입력 후 엔터를 눌러 추가해 주세요.",
  },
};

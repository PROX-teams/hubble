import type { Meta, StoryObj } from "@storybook/nextjs";
import Avatar from "../Avatar";

const meta = {
  title: "Image/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "number", description: "아바타 크기" },
    src: { control: "text", description: "이미지 URL" },
    name: { control: "text", description: "사용자 이름" },
    userId: { control: "number", description: "유저 고유 ID" },
  },
  args: {
    size: 40,
    src: "https://velog.velcdn.com/images/vlmbuyd/post/d85be7e6-5919-4fc3-aba7-f3a38cecb677/image.png",
    name: "User",
    userId: 1,
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: {
    size: 48,
  },
};

export const WithoutImage: Story = {
  args: {
    src: "",
    userId: 22,
  },
};

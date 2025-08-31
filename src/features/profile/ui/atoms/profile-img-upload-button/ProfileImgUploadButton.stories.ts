import type { Meta, StoryObj } from "@storybook/nextjs";
import ProfileImgUploadButton from "./ProfileImgUploadButton";

const meta = {
  title: "Button/Action/Upload",
  component: ProfileImgUploadButton,
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
    children: "프로필 이미지 변경",
    variants: "neutral",
    size: "md",
  },
} satisfies Meta<typeof ProfileImgUploadButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Profile_Image_Upload: Story = {};

import type { Meta, StoryObj } from "@storybook/nextjs";
import CreatorCard from "./CreatorCard";

const meta = {
  title: "Card/Creator",
  component: CreatorCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    userId: {
      control: "number",
      description: "사용자 고유 ID",
    },
    imageUrl: {
      control: "text",
      description: "프로필 이미지 URL",
      defaultValue:
        "https://velog.velcdn.com/images/vlmbuyd/post/d85be7e6-5919-4fc3-aba7-f3a38cecb677/image.png",
    },
    name: {
      control: "text",
      description: "크리에이터명",
      defaultValue: "Creator Title",
    },
    introduction: {
      control: "text",
      description: "소개 글",
      defaultValue: "This is a description of the creator.",
    },
  },
} satisfies Meta<typeof CreatorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: {
    userId: 1,
    imageUrl:
      "https://velog.velcdn.com/images/vlmbuyd/post/d85be7e6-5919-4fc3-aba7-f3a38cecb677/image.png",
    name: "PROX 팀블로그",
    introduction:
      "React와 TypeScript 기반 프론트엔드 개발자로, 복잡한 문제 해결과 DX·UX 개선에 강점을 가지고 있습니다.",
  },
};

export const WithoutIntroduction: Story = {
  args: {
    userId: 1,
    imageUrl:
      "https://velog.velcdn.com/images/vlmbuyd/post/d85be7e6-5919-4fc3-aba7-f3a38cecb677/image.png",
    name: "PROX 팀블로그",
    introduction: "",
  },
};

export const WithoutImage: Story = {
  args: {
    userId: 1,
    imageUrl: "",
    name: "PROX 팀블로그",
    introduction:
      "React와 TypeScript 기반 프론트엔드 개발자로, 복잡한 문제 해결과 DX·UX 개선에 강점을 가지고 있습니다.",
  },
};

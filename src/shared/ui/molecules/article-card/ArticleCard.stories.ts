import type { Meta, StoryObj } from "@storybook/nextjs";
import ArticleCard from "./ArticleCard";
import data from "./mock.json";

const meta = {
  title: "Card/Article",
  component: ArticleCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    data: {
      control: "object",
      description: "더미 데이터",
      table: {
        type: { summary: "Article" },
        defaultValue: { summary: "{}" },
      },
    },
    variant: {
      control: "inline-radio",
      options: ["large", "small", "wide", "compact"],
      description: "카드의 형태 및 크기",
    },
    imageUrl: {
      control: "boolean",
      description: "커버 이미지 URL 포함 여부",
      mapping: {
        true: data.imageUrl,
        false: "",
      },
    },
  },
} satisfies Meta<typeof ArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Large: Story = {
  args: {
    data: data,
    variant: "large",
    imageUrl: (true
      ? "true"
      : "false") as keyof typeof meta.argTypes.imageUrl.mapping,
  },
};

export const Small: Story = {
  args: {
    data: data,
    variant: "small",
    imageUrl: (true
      ? "true"
      : "false") as keyof typeof meta.argTypes.imageUrl.mapping,
  },
};
export const Wide: Story = {
  args: {
    data: data,
    variant: "wide",
    imageUrl: (true
      ? "true"
      : "false") as keyof typeof meta.argTypes.imageUrl.mapping,
  },
};
export const Compact: Story = {
  args: {
    data: data,
    variant: "compact",
    imageUrl: (true
      ? "true"
      : "false") as keyof typeof meta.argTypes.imageUrl.mapping,
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import StoryCard from "./StoryCard";
import data from "./mock.json"

const meta: Meta<typeof StoryCard> = {
  title: "Card/Story",
  component: StoryCard,
   parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StoryCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args:{
    data: data
  }
};

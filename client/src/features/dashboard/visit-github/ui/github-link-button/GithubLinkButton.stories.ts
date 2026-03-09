import type { Meta, StoryObj } from "@storybook/nextjs";
import GithubLinkButton from "./GithubLinkButton";

const meta = {
  title: "Button/Route/Github",
  component: GithubLinkButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    href: { control: "text", description: "깃허브 주소" },
  },
  args: {
    href: "https://github.com/PROX-teams",
  },
} satisfies Meta<typeof GithubLinkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Github_Link: Story = {};

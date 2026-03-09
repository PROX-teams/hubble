import type { Meta, StoryObj } from "@storybook/react";
import TagIcon from "@/shared/assets/icons/common/tagIcon-test.svg"
import Tag from "./Tag";

const meta = {
  title: "Tag/Tag",
  component: Tag,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: " ", 
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onRemove: {
      description: "제거 버튼 클릭 시 호출되는 핸들러",
    },
    label: { control: "text" },
    count: { control: "number"},   
    className: { control: false },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    label: "React",
  },
};

export const Icon: Story = {
  args: {
    label: "React",
    icon: <TagIcon/>,
  },
};

export const Count: Story = {
  args: {
    label: "JavaScript",
    count: 42,
  },
};

export const Remove: Story = {
  args: {
    label: "Frontend",
  },
  render: (args) => <Tag {...args} onRemove={() => {}} />, 
};


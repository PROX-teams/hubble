import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";

type BreadcrumbStoryArgs = {
  items: string[];
  separator?: React.ReactNode
};

const BreadcrumbTemplate = ({ items, separator }: BreadcrumbStoryArgs) => {
  const lastIndex = items.length - 1;

  return (
    <Breadcrumb>
      <Breadcrumb.List separator={separator}>
        {items.map((label, idx) => (
          <Breadcrumb.Item key={idx} active={idx === lastIndex}>
            {label}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb.List>
    </Breadcrumb>
  );
};

const meta = {
  title: "Navigation/Breadcrumb",
  component: BreadcrumbTemplate,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "페이지 경로를 단계적으로 보여주는 내비게이션 컴포넌트." +
          "`Breadcrumb.List`의 `separator`로 구분자를 변경합니다."
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    items: {
      description: "페이지 경로를 순서대로 나타내는 라벨 배열",
      table: {
        type: { summary: "string[]" },
      },
    },
    separator: {
      description: "항목 사이에 표시되는 구분자",
      table: {
        type: { summary: "ReactNode" },
      },
    },
  }, 
} satisfies Meta<typeof BreadcrumbTemplate>
export default meta;

type Story = StoryObj<BreadcrumbStoryArgs>;

export const Default: Story = {
  args: {
    items: ["코테 준비 일지", "Kotlin 코테 준비 1일차", "문제 풀이"],
  },
  render: (args) => BreadcrumbTemplate(args),
  parameters: {
    docs: {
      description: {
        story: "가장 기본적인 형태.",
      },
    },
  },
};


export const CustomSeparator: Story = {
  args: {
    items: ["Home", "Library", "Data"],
    separator: "•",
  },
  render: (args) => BreadcrumbTemplate(args),
  parameters: {
    docs: {
      description: {
        story: "`separator` 커스텀 구분자를 적용.",
      },
    },
  },
};

export const SingleItem: Story = {
  args: {
    items: ["새노트"],
  },
  render: (args) => BreadcrumbTemplate(args),
  parameters: {
    docs: {
      description: { story: "아이템이 하나뿐일 때 (현재 페이지만 표시)." },
    },
  },
};
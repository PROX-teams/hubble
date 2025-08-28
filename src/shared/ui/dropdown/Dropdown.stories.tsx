import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown } from "./Dropdown";

type iconPlacement = "right" | "both" | "left" | "none";
type variant = "solid" | "ghost" | "none";
type Placement = "left" | "center" | "right";

type DropdownStoryProps = {
  iconPlacement: iconPlacement;
  variant: variant;
  placeholder: string;
  placement: Placement;
  independent:boolean;
  icon: "left" | "right" | "both"
};

const OPTIONS = [
  { id: 1, label: "Option 1" },
  { id: 2, label: "Option 2" },
  { id: 3, label: "Option 3" },
];

function DropdownTemplate(props: DropdownStoryProps) {
  return (
    <Dropdown>
      <Dropdown.Trigger
        iconPlacement={props.iconPlacement}
        variant={props.variant}
      >
        {(props.icon === "left" || props.icon === "both") && <Dropdown.Icon />}
        <Dropdown.Value>
          {({ selectedOption }) =>
            selectedOption ? selectedOption : props.placeholder
          }
        </Dropdown.Value>
        {(props.icon === "right" || props.icon === "both") && <Dropdown.Icon />}
      </Dropdown.Trigger>
      <Dropdown.Menu placement={props.placement} independent={props.independent}>
        {OPTIONS.map((item) => (
          <Dropdown.Option key={item.id} optionId={item.id}>
            {item.label}
          </Dropdown.Option>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

const meta = {
  title: "Dropdown/Dropdown",
  component: DropdownTemplate,
  subcomponents: {
    Trigger: (Dropdown).Trigger,
    Menu: (Dropdown).Menu,
    Option: (Dropdown).Option,
    Value: (Dropdown).Value,
    Icon: (Dropdown).Icon,
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "",
      },
    },
  },
  tags: ["autodocs"], 
  argTypes: {
    iconPlacement: {
      control: "radio",
      options: ["right", "both", "left", "none"],
      table: { category: "Trigger" }
    },
    variant: {
      control: "radio",
      options: ["solid", "ghost", "none"],
      table: { category: "Trigger" }
    },
    placeholder: { control: "text", table: { category: "Trigger" } },
    placement: {
      control: "radio",
      options: ["left", "center", "right"],
      table: { category: "Menu" }
    },
    independent: {
      control: "boolean",
      table: {category: "Menu"}
    }
  },
} satisfies Meta<typeof DropdownTemplate>;

export default meta;

type Story = StoryObj<typeof DropdownTemplate>;

export const Default: Story = {
  args: {
    icon: "right",
    placeholder: "카테고리 선택",
  },
};

export const Icon: Story = {
  args: {
    placeholder: "전체 공개",
  },
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem" }}>
      <DropdownTemplate {...args} iconPlacement="left" icon="left" />
      <DropdownTemplate {...args} iconPlacement="right" icon="right" />
      <DropdownTemplate {...args} iconPlacement="both" icon="both" />
    </div>
  ),
};

export const Placement: Story = {
  args: {
    icon: "right",
    placeholder: "전체 공개",
  },
  render: (args) => (
    <div style={{ display: "flex", gap: "10rem" }}>
      <DropdownTemplate {...args} placement="left"/>
      <DropdownTemplate {...args} placement="center"/>
      <DropdownTemplate {...args} placement="right"/>
    </div>
  ),
};

export const Variant: Story = {
  args: {
    variant: "ghost",
    iconPlacement: "none",
    placeholder: "For Week",
  },
};

export const OnlyMenu: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Menu independent>
        <Dropdown.Option optionId={1}>
          북마크 수정
        </Dropdown.Option>
        <Dropdown.Option optionId={2}>
          북마크 삭제
        </Dropdown.Option>
      </Dropdown.Menu>
    </Dropdown>
  ),
};


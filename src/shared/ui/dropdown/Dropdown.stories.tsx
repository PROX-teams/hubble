import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown } from "./Dropdown";

type Side = "right" | "left" ;
type Variant = "solid" | "ghost" | "none";
type Placement = "left" | "center" | "right";
type TriggerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "2xl-tall" | "4xl";
type MenuSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

type DropdownStoryProps = {
  side: Side;
  triggerSize: TriggerSize;
  menuSize: MenuSize;
  variant: Variant;
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
        size={props.triggerSize}
        variant={props.variant}
      >
        {(props.icon === "left" || props.icon === "both") && <Dropdown.Icon side={props.side} />}
        <Dropdown.Value>
          {({ selectedOption }) =>
            selectedOption ? selectedOption : props.placeholder
          }
        </Dropdown.Value>
        {(props.icon === "right" || props.icon === "both") && <Dropdown.Icon side={props.side} />}
      </Dropdown.Trigger>
      <Dropdown.Menu size={props.menuSize} placement={props.placement} independent={props.independent}>
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
    triggerSize:{
      control: "radio",
      options: ["sm" , "md" , "lg" , "xl" , "2xl" , "3xl" , "2xl-tall" , "4xl"],
      table: { category: "Trigger" }
    },
    variant: {
      control: "radio",
      options: ["solid", "ghost", "none"],
      table: { category: "Trigger" }
    },
    placeholder: { control: "text", table: { category: "Trigger" } },
    menuSize:{
      control: "radio",
      options: ["sm", "md", "lg", "xl", "2xl", "3xl"],
      table: { category: "Menu" }
    },
    side: {
      control: "radio",
      options: ["right", "left",],
      table: { category: "Icon" }
    },
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
      <DropdownTemplate {...args} side="left" icon="left" />
      <DropdownTemplate {...args} side="right" icon="right" />
      <DropdownTemplate {...args} icon="both" />
    </div>
  ),
};

export const Placement: Story = {
  args: {
    icon: "right",
    placeholder: "전체 공개",
    menuSize:"lg"
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
    icon: "right",
    variant: "ghost",
    placeholder: "For Week",
  },
};

export const OnlyMenu: Story = {
  args: {
    menuSize:"lg"
  },
  render: (args) => (
    <Dropdown>
      <Dropdown.Menu size={args.menuSize} placement={args.placement} independent>
        <Dropdown.Option optionId={1}>
          Option1
        </Dropdown.Option>
        <Dropdown.Option optionId={2}>
          Option2
        </Dropdown.Option>
      </Dropdown.Menu>
    </Dropdown>
  ),
};


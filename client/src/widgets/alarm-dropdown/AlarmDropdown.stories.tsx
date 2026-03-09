import type { Meta, StoryObj } from "@storybook/react";
import AlarmDropdown from "./AlarmDropdown";
import MOCK_ALARMS from "@/shared/mock/alarm.json";

const meta = {
  title: "Dropdown/AlarmDropdown",
  component: AlarmDropdown,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "AlarmDropdown 컴포넌트는 알림을 표시하는 드롭다운 메뉴입니다. <br> `data` prop으로 알림 데이터를 배열로 전달받아 표시합니다. <br> `independent` prop을 통해 메뉴가 Context와 무관하게 독립적으로 열릴지 여부를 설정할 수 있습니다.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div
        style={{
          width: "100vw",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          padding: "0 10%",
          height: "80vh",
        }}
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    data: {
      control: false,
      description: "표시할 알림 데이터를 배열로 전달합니다.",
    },
    independent: {
      control: "boolean",
      description:
        "`true`로 설정하면 드롭다운 메뉴가 Context와 무관하게 독립적으로 열립니다.",
    },
  },
} satisfies Meta<typeof AlarmDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: MOCK_ALARMS,
    independent: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: "기본 상태의 AlarmDropdown 컴포넌트입니다.",
      },
    },
  },
  render: (args) => <AlarmDropdown {...args} />,
};

export const Open: Story = {
  args: {
    data: MOCK_ALARMS,
    independent: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "`independent` prop을 `true`로 설정하여 처음부터 드롭다운 메뉴가 열려있는 상태를 보여줍니다.",
      },
    },
  },
  render: (args) => <AlarmDropdown {...args} />,
};

export const Empty: Story = {
  args: {
    data: [],
    independent: true,
  },
  parameters: {
    docs: {
      description: {
        story: "표시할 알림 데이터가 없을 때의 UI를 보여줍니다.",
      },
    },
  },

  render: (args) => <AlarmDropdown {...args} />,
};

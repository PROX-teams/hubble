import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./Accordion";
import Arrow from "@/shared/assets/icons/common/accordionArrow.svg";

type StoryArgs = {
  justify: "inline" | "spread";
  enabled: boolean;
};

const AccordionTemplate = ({ justify, enabled }: StoryArgs) => (
  <div style={{ width: 232 }}>
    <Accordion>
      <Accordion.Header justify={justify}>
        아코디언 헤더
        <Accordion.Trigger enabled={enabled}>
          <Arrow />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content>아코디언 내용</Accordion.Content>
    </Accordion>
  </div>
);

const meta = {
  title: "Accordion/Accordion",
  component: AccordionTemplate,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    justify: {
      control: "radio",
      options: ["inline", "spread"],
      description:
        "Header 배치 방식\n- inline: 왼쪽으로 이어 정렬\n- spread: 좌우로 퍼뜨림(space-between)",
      table: { type: { summary: "'inline' | 'spread'" }, defaultValue: { summary: "inline" } },
    },
    enabled: {
      control: "boolean",
      description: "Trigger 아이콘 회전 여부 (true면 open일 때 0→90° 회전)",
      table: { type: { summary: "boolean" }, defaultValue: { summary: "false" } },
    },
  },
} satisfies Meta<typeof AccordionTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Spread: Story = {
  args: { justify: "spread", enabled: false },
};

export const Rotate: Story = {
  args: { justify: "inline", enabled: true },
};

export const Stop: Story = {
  args: { justify: "inline", enabled: false },
};
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { GNBNav } from './GNBNav';

const meta = {
  title: 'GNB/GNBNav',
  component: GNBNav,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'GNB Navigation 컴포넌트 입니다. 마우스 오버 시 확장됩니다.', 
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GNBNav>;

export default meta;
type Story = StoryObj<typeof GNBNav>;

export const Default: Story = {
  render: () => (
    <div style={{ height: '100vh'}}>
      <GNBNav />
    </div>
  ),
};


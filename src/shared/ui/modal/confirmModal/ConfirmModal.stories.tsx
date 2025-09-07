import type { Meta, StoryObj } from "@storybook/react";
import ConfirmModal from "./ConfirmModal";
import {
  CONFIRM_MESSAGES,
  MessageType,
} from "@/shared/constants/confirmMessage";
import useModal from "@/shared/model/hooks/useModal";
import { AnimatePresence } from "framer-motion";
import ActionButton from "../../atoms/button/action-button/ActionButton";
import { useEffect, useState } from "react";

function ModalTrigger({ type }: { type: MessageType }) {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <ActionButton size="md" variants="neutral" onClick={openModal}>
        Trigger Button
      </ActionButton>

      <AnimatePresence>
        {isOpen && (
          <ConfirmModal
            hide={closeModal}
            onCancel={() => {}}
            onDelete={() => {}}
            type={type}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * VisibleByDefault 스토리를 렌더링하기 위한 래퍼 컴포넌트입니다.
 */
function VisibleByDefaultStory(args: Story["args"]) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? <ConfirmModal {...args} /> : null;
}

const meta = {
  title: "Modal/ConfirmModal",
  component: ConfirmModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `사용자에게 중요한 작업을 확인받기 위한 모달 컴포넌트입니다. <br/>"type" prop을 통해 다양한 상황에 맞는 제목과 설명 텍스트를 보여줄 수 있습니다. <br/> 삭제 또는 취소 버튼 클릭 시 실행할 콜백 함수를 전달받습니다.`,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <>
        <Story />
        <div id="modalRoot"></div>
      </>
    ),
  ],
  argTypes: {
    type: {
      control: "select",
      options: Object.keys(CONFIRM_MESSAGES),
      description: "모달에 표시될 메시지의 종류를 선택합니다.",
    },
    onDelete: {
      action: "deleted",
      description: "삭제 버튼 클릭 시 호출되는 콜백 함수입니다.",
    },
    onCancel: {
      action: "canceled",
      description: "취소 버튼 클릭 시 호출되는 콜백 함수입니다.",
    },
    hide: {
      action: "hidden",
      description: "모달을 닫을 때 호출되는 함수입니다.",
    },
  },
} satisfies Meta<typeof ConfirmModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const VisibleByDefault: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "트리거 버튼 없이 모달이 기본적으로 열려있는 상태를 보여주는 스토리입니다. 모달 자체의 UI를 확인할 때 유용합니다.",
      },
    },
  },
  args: {
    type: "DELETE_GENERAL",
    hide: () => {},
    onDelete: () => {},
    onCancel: () => {},
  },
  render: (args) => <VisibleByDefaultStory {...args} />,
};

export const DeleteGeneral: Story = {
  parameters: {
    docs: {
      description: {
        story: "가장 일반적인 삭제 상황에 사용되는 확인 모달입니다.",
      },
    },
  },
  args: {
    type: "DELETE_GENERAL",
    hide: () => {},
    onDelete: () => {},
  },
  render: (args) => <ModalTrigger {...args} />,
};

export const DeleteBookmark: Story = {
  parameters: {
    docs: {
      description: {
        story: "북마크 삭제 시 사용자에게 확인을 요청하는 모달입니다.",
      },
    },
  },
  args: {
    type: "DELETE_BOOKMARK",
    hide: () => {},
    onDelete: () => {},
  },
  render: (args) => <ModalTrigger {...args} />,
};

export const DeleteStory: Story = {
  parameters: {
    docs: {
      description: {
        story: "스토리 삭제 시 사용자에게 확인을 요청하는 모달입니다.",
      },
    },
  },
  args: {
    type: "DELETE_STORY",
    hide: () => {},
    onDelete: () => {},
  },
  render: (args) => <ModalTrigger {...args} />,
};

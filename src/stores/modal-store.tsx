import { VictoryModalBody } from "@/modules/level/victory-modal";
import { ComponentProps, ReactNode } from "react";
import { create } from "zustand";

type ModalProps = {
  body?: ReactNode;
  title?: string;
};

export const useModalStore = create<{
  isOpen: boolean;
  modalProps?: ModalProps;
  actions: {
    open: (modalProps: ModalProps) => void;
    openVictory: (props: ComponentProps<typeof VictoryModalBody>) => void;
    close: () => void;
  };
}>((set) => ({
  actions: {
    close: () => set({ isOpen: false }),
    open: (modalProps) => set({ isOpen: true, modalProps }),
    openVictory(props) {
      this.open({
        title: "You Won",
        body: <VictoryModalBody {...props} />,
      });
    },
  },
  isOpen: false,
}));

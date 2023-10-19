import { ReactNode } from "react";
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
    openVictory: (props: OpenVictoryProps) => void;
    close: () => void;
  };
}>((set) => ({
  actions: {
    close: () => set({ isOpen: false }),
    open: (modalProps) => set({ isOpen: true, modalProps }),
    openVictory(props) {
      this.open({
        title: "You Won",
        body: <VictoryBody {...props} />,
      });
    },
  },
  isOpen: false,
}));

type OpenVictoryProps = {
  goldEarned: number;
};

const VictoryBody = ({ goldEarned = 10 }: OpenVictoryProps) => {
  return (
    <div>
      <p>You earned {goldEarned} gold!</p>
    </div>
  );
};

export const useOpenModal = () => {
  const { close, open } = useModalStore((s) => s.actions);

  return { close, open };
};

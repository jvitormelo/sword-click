import { useModalStore } from "@/components/Modal/modal-store";

export const useModal = () => {
  const { close, open } = useModalStore((s) => s.actions);

  return { close, open };
};

import { useModalStore } from "@/stores/modal-store";

export const useModal = () => {
  const { close, open } = useModalStore((s) => s.actions);

  return { close, open };
};

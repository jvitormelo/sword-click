import { useModalStore } from "@/hooks/useOpenModal";

export const ModalProvider = () => {
  const { isOpen, modalProps, actions } = useModalStore();

  return (
    <>
      <div
        className={`fixed z-40 inset-0 bg-black bg-opacity-50`}
        hidden={!isOpen}
      />
      <dialog
        open={isOpen}
        className={`z-50  p-4 my-auto rounded-md min-w-[30lvw] max-h-[80lvh] max-w-[50vw] flex flex-col ${
          isOpen ? "inset-0" : ""
        }`}
      >
        <button
          onClick={actions.close}
          className="absolute p-1 text-white border-white top-0 right-0 m-4 hover:text-gray-900 hover:!fill-amber-800"
        >
          <svg
            className="w-2 h-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="pt-6"></div>

        <h1 className="text-xl text-white text-center">{modalProps?.title}</h1>

        <div className="pt-4">{modalProps?.body}</div>
      </dialog>
    </>
  );
};

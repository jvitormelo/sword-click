import { useModalStore } from "@/stores/modal-store";
import { AnimatePresence, motion } from "framer-motion";

export const ModalProvider = () => {
  const { isOpen, modalProps, actions } = useModalStore();

  return (
    <>
      <div
        hidden={!isOpen}
        className={`fixed z-40 inset-0 bg-black bg-opacity-50`}
      />
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.dialog
              key={"modal"}
              animate={{ scale: isOpen ? 1 : 0.5, inset: 0 }}
              exit={{ scale: [1, 0], translateY: ["0vh", "100vh"] }}
              open={isOpen}
              className={`z-50 p-8 min-w-[20vw] shadow-2xl my-auto rounded-md w-fit border-amber-800 border max-h-[80lvh] max-w-[50vw] flex flex-col`}
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

              <h1 className="text-xl text-white text-center">
                {modalProps?.title}
              </h1>

              <div className="pt-4 items-center justify-center flex">
                {modalProps?.body}
              </div>
            </motion.dialog>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

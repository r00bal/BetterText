// write a Modal Component in react using tailwinfCss for styles:

export const Modal = ({
  onCloseModal,
  children,
}: {
  children: React.ReactNode;
  onCloseModal: () => void;
}) => {
  return (
    <div className="absolute left-0 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
      <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
        <div className="p-4">
          <div className="group relative flex gap-x-6 rounded-lg p-4 ">
            <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-5"></div>
            <div>{children}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
          <button className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100">
            Insert
          </button>
          <button
            onClick={onCloseModal}
            className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

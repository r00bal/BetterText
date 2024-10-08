type CollapseProps = {
  title?: string;
  children: React.ReactNode;
  isOpen?: boolean;
};

export const Collapse = ({ title, children, isOpen }: CollapseProps) => {
  return (
    <div
      className={`collapse ${
        isOpen && "collapse-open"
      } bg-slate-50 text-gray-500 text-xs font-light mb-4 rounded-md collapse-arrow shadow-md`}
    >
      <input type="checkbox" className="min-h-4" />
      {title && (
        <div className="collapse-title text-black text-xs font-light p-2 min-h-4 leading-4">
          {title}
        </div>
      )}
      <div className="collapse-content">{children}</div>
    </div>
  );
};

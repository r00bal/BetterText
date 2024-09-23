import React from "react";
import { motion } from "framer-motion";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  className,
}) => {
  return (
    <motion.div
      className={`fixed flex flex-col top-0 right-0 w-1/3 min-w-[400]px h-full bg-white shadow-lg z-[10000] ${className}`}
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex flex-col p-6 overflow-y-auto h-full relative z-[10000] justify-start">
        <button
          onClick={onClose}
          className="ml-auto text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
        {children}
      </div>
    </motion.div>
  );
};

export default Drawer;

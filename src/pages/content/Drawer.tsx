import React from "react";
import { motion } from "framer-motion";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children }) => {
  return (
    <motion.div
      className="fixed top-0 right-0 w-1/3 min-w-[300]px h-full bg-white shadow-lg z-[1000]"
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <button
        onClick={onClose}
        className="absolute bottom-4 right-4 text-gray-500 hover:text-gray-700"
      >
        Close
      </button>
      <div className="p-6 overflow-y-auto h-full">{children}</div>
    </motion.div>
  );
};

export default Drawer;

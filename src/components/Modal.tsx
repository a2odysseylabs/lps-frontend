import React, { ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import ActionContainer from "./ActionContainer";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  useEffect(() => {
    // Close modal on pressing 'Escape'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-neutral-200/80 backdrop-blur-lg"
        onClick={onClose}
      />

      {/* Modal Content */}
      <ActionContainer
        onClose={onClose}
        className={classNames(
          className,
          "modal-content w-full sm:w-1/2 min-h-64"
        )}
      >
        {title && (
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        )}
        <div>{children}</div>
      </ActionContainer>
    </div>,
    document.body
  );
};

export default Modal;
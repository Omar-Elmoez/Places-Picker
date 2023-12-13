import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function Modal({ children, open, onClose }) {
  const dialog = useRef();

  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]);

  return createPortal(
    // onClose is a built-in function for dialog to listen if it closed via ESC key
    // if we don't handle it, the value of open will not change
    // and the UI will not be in sync with the state anymore.
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {children}
    </dialog>,
    document.getElementById("modal")
  );
}

export default Modal;

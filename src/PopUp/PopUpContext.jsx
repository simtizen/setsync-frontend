import { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";
import PopUp from "./PopUp";
import ConfirmModal from "./ConfirmModal";
import PromptModal from "./PromptModal";

const PopUpContext = createContext(null);

export const PopUpProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [promptModal, setPromptModal] = useState(null);
  const timerRef = useRef(null);

  const hidePopUp = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast(null);
  }, []);

  const showPopUp = useCallback((msg, type = "info") => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setToast({ msg, type });

    timerRef.current = setTimeout(() => {
      setToast(null);
      timerRef.current = null;
    }, 4000);
  }, []);

  const showConfirm = useCallback(
    ({
      title = "Confirm Action",
      message,
      confirmText = "Confirm",
      cancelText = "Cancel",
      isDanger = false,
    }) => {
      return new Promise((resolve) => {
        setConfirmModal({
          title,
          message,
          confirmText,
          cancelText,
          isDanger,
          resolve,
        });
      });
    },
    []
  );

  const handleConfirm = useCallback(() => {
    if (confirmModal?.resolve) {
      confirmModal.resolve(true);
    }
    setConfirmModal(null);
  }, [confirmModal]);

  const handleCancel = useCallback(() => {
    if (confirmModal?.resolve) {
      confirmModal.resolve(false);
    }
    setConfirmModal(null);
  }, [confirmModal]);

  const showPrompt = useCallback(
    ({
      title = "Input Required",
      message,
      placeholder = "",
      defaultValue = "",
      inputType = "text",
      confirmText = "Submit",
      cancelText = "Cancel",
    }) => {
      return new Promise((resolve) => {
        setPromptModal({
          title,
          message,
          placeholder,
          defaultValue,
          inputType,
          confirmText,
          cancelText,
          resolve,
        });
      });
    },
    []
  );

  const handlePromptSubmit = useCallback(
    (value) => {
      if (promptModal?.resolve) {
        promptModal.resolve(value);
      }
      setPromptModal(null);
    },
    [promptModal]
  );

  const handlePromptCancel = useCallback(() => {
    if (promptModal?.resolve) {
      promptModal.resolve(null);
    }
    setPromptModal(null);
  }, [promptModal]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <PopUpContext.Provider value={{ showPopUp, hidePopUp, showConfirm, showPrompt }}>
      {children}
      {toast && (
        <PopUp
          msg={toast.msg}
          type={toast.type}
          onClose={hidePopUp}
        />
      )}
      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.confirmText}
          cancelText={confirmModal.cancelText}
          isDanger={confirmModal.isDanger}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      {promptModal && (
        <PromptModal
          title={promptModal.title}
          message={promptModal.message}
          placeholder={promptModal.placeholder}
          defaultValue={promptModal.defaultValue}
          inputType={promptModal.inputType}
          confirmText={promptModal.confirmText}
          cancelText={promptModal.cancelText}
          onSubmit={handlePromptSubmit}
          onCancel={handlePromptCancel}
        />
      )}
    </PopUpContext.Provider>
  );
};

export const usePopUp = () => {
  const context = useContext(PopUpContext);
  if (!context) {
    throw new Error("usePopUp must be used within a PopUpProvider");
  }
  return context;
};

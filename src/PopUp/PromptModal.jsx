import { useState, useEffect, useRef } from "react";
import "./ConfirmModal.css";

const PromptModal = ({
  title = "Input Required",
  message,
  placeholder = "",
  defaultValue = "",
  inputType = "text",
  confirmText = "Submit",
  cancelText = "Cancel",
  onSubmit,
  onCancel,
}) => {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div
        className="confirm-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="prompt-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h3 id="prompt-modal-title" className="confirm-modal-title">
            {title}
          </h3>
        )}
        {message && <p className="confirm-modal-message">{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type={inputType}
            className="prompt-modal-input"
            value={value}
            placeholder={placeholder}
            onChange={(e) => setValue(e.target.value)}
          />

          <div className="confirm-modal-actions">
            <button
              type="button"
              className="confirm-btn confirm-btn-cancel"
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button
              type="submit"
              className="confirm-btn confirm-btn-primary"
            >
              {confirmText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromptModal;

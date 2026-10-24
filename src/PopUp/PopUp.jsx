import "./PopUp.css";

const PopUp = ({ msg, type = "info", onClose }) => {
  if (!msg) return null;

  return (
    <aside
      className={`popup-toast popup-${type}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="popup-body">
        <span className="popup-message">{msg}</span>
      </div>
      {onClose && (
        <button
          type="button"
          className="popup-close-btn"
          onClick={onClose}
          aria-label="Close notification"
        >
          &times;
        </button>
      )}
    </aside>
  );
};

export default PopUp;

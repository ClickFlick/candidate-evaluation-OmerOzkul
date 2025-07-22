import React, { useState } from "react";
import "./TransferConfirmationPopup.css";

export const TransferConfirmationModal = ({ open, onClose, onConfirm }) => {
  const [password, setPassword] = useState("");

  if (!open) return null;

  const handleConfirm = () => {
    onConfirm(password);
    setPassword("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Confirm Transfer</h2>
        <p>Please enter your password to authorize this transfer:</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <div className="modal-actions">
          <button className="btn confirm" onClick={handleConfirm}>
            Confirm
          </button>
          <button className="btn cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

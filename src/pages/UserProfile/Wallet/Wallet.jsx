import React, { useEffect, useState } from "react";
import "./Wallet.css";
import { useUserData } from "../../../contexts/UserDataProvider";
import { useToken } from "../../../contexts/TokenProvider";
import { TransferConfirmationModal } from "../../../components/Confirmation/TransferConfirmationPopup";
import { useAuth } from "../../../contexts/AuthProvider";

export const Wallet = () => {
  const { auth } = useAuth();
  const { userDataState } = useUserData();
  const {
    balance,
    loading,
    mintTokens,
    transferTokens,
    checkBalanceOf,
    checkedUserBalance,
    fetchBalance,
  } = useToken();

  useEffect(() => {
    fetchBalance();
  }, []);

  const [mintAmount, setMintAmount] = useState(0);
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingTransfer, setPendingTransfer] = useState(null);
  const [checkEmail, setCheckEmail] = useState("");
  const handleTransfer = () => {
    if (transferTo && transferAmount > 0) {
      setPendingTransfer({ to: transferTo, amount: Number(transferAmount) });
      setIsModalOpen(true);
    }
  };

  const confirmTransfer = async (password) => {
    await transferTokens(pendingTransfer.to, pendingTransfer.amount, password);
    setIsModalOpen(false);
    setPendingTransfer(null);
  };

  return (
    <div className="wallet-container">
      <h2>Your Wallet</h2>

      <div className="wallet-section">
        <strong>Balance:</strong> {balance} Tokens
      </div>

      <div className="wallet-section">
        <h3>Mint Tokens</h3>
        <input
          type="number"
          value={mintAmount}
          onChange={(e) => setMintAmount(e.target.value)}
          placeholder="Amount to mint"
        />
        <button
          disabled={loading}
          onClick={() => {
            if (mintAmount > 0) mintTokens(Number(mintAmount));
          }}
        >
          Mint
        </button>
      </div>

      <div className="wallet-section">
        <h3>Transfer Tokens</h3>
        <input
          type="email"
          value={transferTo}
          onChange={(e) => setTransferTo(e.target.value)}
          placeholder="Recipient email"
        />
        <input
          type="number"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          placeholder="Amount to transfer"
        />
        <button disabled={loading} onClick={handleTransfer}>
          Transfer
        </button>
      </div>

      <TransferConfirmationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmTransfer}
      />

      <div className="wallet-section">
        <h3>Check Another Balance</h3>
        <input
          type="email"
          value={checkEmail}
          onChange={(e) => setCheckEmail(e.target.value)}
          placeholder="User email"
        />
        <button
          disabled={loading}
          onClick={() => {
            if (checkEmail) checkBalanceOf(checkEmail);
          }}
        >
          Check
        </button>
        {checkedUserBalance && (
          <p>
            Balance of <strong>{checkedUserBalance.email}</strong>:{" "}
            {checkedUserBalance.balance} Tokens
          </p>
        )}
      </div>
    </div>
  );
};

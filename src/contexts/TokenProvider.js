import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getBalanceService } from "../services/token-services/getBalanceService";
import { mintService } from "../services/token-services/mintService";
import { transferService } from "../services/token-services/transferService";
import { checkBalanceService } from "../services/token-services/checkBalanceService";
import { useAuth } from "./AuthProvider";
import { getTokenLogsService } from "../services/log-services/logService";

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const { auth } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkedUserBalance, setCheckedUserBalance] = useState(null);

  const email = localStorage.getItem("email");

  const fetchBalance = async () => {
    try {
      const response = await getBalanceService(auth.email);
      setBalance(response.data.balance);
    } catch (error) {
      toast.error("Failed to fetch balance.");
    }
  };

  const mintTokens = async (amount) => {
    try {
      setLoading(true);
      await mintService(email, amount, auth.email);
      await fetchBalance();
      toast.success(`Minted ${amount} tokens`);
    } catch (error) {
      if (error?.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Minting failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const transferTokens = async (to, amount, password) => {
    try {
      setLoading(true);
      console.log("Transferring tokens...", { from: email, to, amount, password });
      await transferService(email, to, amount, password);
      await fetchBalance();
      toast.success(`Transferred ${amount} tokens to ${to}`);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Transfer failed.");
    } finally {
      setLoading(false);
    }
  };

  const checkBalanceOf = async (targetEmail) => {
    try {
      const response = await checkBalanceService(targetEmail);
      setCheckedUserBalance({
        email: targetEmail,
        balance: response.data.balance,
      });
    } catch (error) {
      setCheckedUserBalance(null);
      toast.error("User not found.");
    }
  };

  useEffect(() => {
    if (auth.email) fetchBalance();
  }, [auth.email]);

  return (
    <TokenContext.Provider
      value={{
        balance,
        loading,
        mintTokens,
        transferTokens,
        checkBalanceOf,
        checkedUserBalance,
        fetchBalance,
        getTokenLogsService
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => useContext(TokenContext);

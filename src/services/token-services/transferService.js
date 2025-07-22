import axios from "axios";

export const transferService = async (from, to, amount, password) => {
  return await axios.post("/api/token/transfer", { from, to, amount, password });
};

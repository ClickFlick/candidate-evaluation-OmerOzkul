import axios from "axios";

export const getBalanceService = async (email) => {
  return await axios.get(`/api/token/balance/${email}`);
};

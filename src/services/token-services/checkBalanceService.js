import axios from "axios";

export const checkBalanceService = async (email) => {
  return await axios.get(`/api/token/balance/${email}`);
};

import axios from "axios";

export const mintService = (to, amount, requester) =>
  axios.post("/api/token/mint", {
    to,
    amount,
    requester,
  });

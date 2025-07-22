import axios from "axios";

export const getTokenLogsService = async () => {
  return await axios.get("/api/token/logs");
};

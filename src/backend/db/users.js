import { v4 as uuid } from "uuid";
import { formatDate } from "../utils/authUtils.js";

export const users = [
  {
    _id: uuid(),
    firstName: "Aniket",
    lastName: "Saini",
    email: "aniketsaini65@gmail.com",
    password: "aniketSaini258",
    createdAt: formatDate(),
    updatedAt: formatDate(),
  },
  {
    _id: uuid(),
    firstName: "Omer",
    lastName: "Ozkul",
    email: "omerfarkozkul@gmail.com",
    password: "omerozkul123",
    createdAt: formatDate(),
    updatedAt: formatDate(),
  },
];

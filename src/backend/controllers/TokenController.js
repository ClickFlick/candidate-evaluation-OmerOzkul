import { Response } from "miragejs";
import { createTokenLog } from "./LogController";

/**
 * All the routes related to Token Ledger are present here.
 * These simulate minting, transferring, and checking balances.
 * These are Publicly accessible mock contract routes.
 */

/**
 * This handler handles minting tokens to a user.
 * send POST Request at /api/token/mint
 * body contains: { to, amount }
 */
export const mintTokenHandler = function (schema, request) {
  const { to, amount, requester } = JSON.parse(request.requestBody);

  try {
    const owner = schema.users.findBy({ email: requester });

    if (!owner || !owner.isOwner) {
      return new Response(403, {}, { error: "Unauthorized mint attempt" });
    }

    const user = schema.users.findBy({ email: to });

    if (!user) {
      return new Response(404, {}, { error: "User not found" });
    }

    user.update({ balance: user.balance + Number(amount) });
    createTokenLog(schema, {
      type: "MINT",
      from: "SYSTEM",
      to,
      amount,
    });
    return new Response(
      200,
      {},
      {
        message: "Mint successful",
        newBalance: user.balance,
      }
    );
  } catch (error) {
    return new Response(500, {}, { error });
  }
};

/**
 * This handler handles transferring tokens between users.
 * send POST Request at /api/token/transfer
 * body contains: { from, to, amount, password }
 */
export const transferTokenHandler = function (schema, request) {
  const { from, to, amount, password } = JSON.parse(request.requestBody);
  try {
    const sender = schema.users.findBy({ email: from });
    const receiver = schema.users.findBy({ email: to });

    if (!sender || !receiver) {
      return new Response(404, {}, { error: "Sender or receiver not found" });
    }

    if (sender.password !== password) {
      return new Response(401, {}, { error: "Invalid password" });
    }

    if (sender.balance < Number(amount)) {
      return new Response(400, {}, { error: "Insufficient balance" });
    }

    sender.update({ balance: sender.balance - Number(amount) });
    receiver.update({ balance: receiver.balance + Number(amount) });
    createTokenLog(schema, {
      type: "TRANSFER",
      from,
      to,
      amount,
    });
    return new Response(
      200,
      {},
      {
        message: "Transfer successful",
        fromBalance: sender.balance,
        toBalance: receiver.balance,
      }
    );
  } catch (error) {
    return new Response(500, {}, { error: "Internal server error" });
  }
};

/**
 * This handler handles checking a user's token balance.
 * send GET Request at /api/token/balance/:email
 */
export const getBalanceHandler = function (schema, request) {
  const email = request.params.email;
  try {
    const user = schema.users.findBy({ email });

    if (!user) {
      return new Response(404, {}, { error: "User not found" });
    }

    return new Response(
      200,
      {},
      {
        email,
        balance: user.balance,
      }
    );
  } catch (error) {
    return new Response(500, {}, { error });
  }
};

import { Server, Model, RestSerializer } from "miragejs";
import {
  loginHandler,
  signupHandler,
} from "./backend/controllers/AuthController.js";
import {
  addItemToCartHandler,
  getCartItemsHandler,
  removeItemFromCartHandler,
  updateCartItemHandler,
  clearCartHandler,
} from "./backend/controllers/CartController.js";
import {
  getAllCategoriesHandler,
  getCategoryHandler,
} from "./backend/controllers/CategoryController.js";
import {
  getAllProductsHandler,
  getProductHandler,
} from "./backend/controllers/ProductController.js";
import {
  addItemToWishlistHandler,
  getWishlistItemsHandler,
  removeItemFromWishlistHandler,
} from "./backend/controllers/WishlistController.js";

import {
  getAddressListHandler,
  addAddressHandler,
  removeAddressHandler,
  updateAddressHandler,
} from "./backend/controllers/AddressController.js";

import {
  getOrderItemsHandler,
  addItemToOrdersHandler,
} from "./backend/controllers/OrderController.js";
import {
  mintTokenHandler,
  transferTokenHandler,
  getBalanceHandler,
} from "./backend/controllers/TokenController.js";

import { categories } from "./backend/db/categories.js";
import { products } from "./backend/db/products.js";
import { users } from "./backend/db/users.js";
import { v4 as uuid } from "uuid";
import { getTokenLogsHandler } from "./backend/controllers/LogController.js";

export function makeServer({ environment = "development" } = {}) {
  return new Server({
    serializers: {
      application: RestSerializer,
    },
    environment,
    models: {
      product: Model,
      category: Model,
      user: Model,
      cart: Model,
      wishlist: Model,
      log: Model,
    },

    // Runs on the start of the server
    seeds(server) {
      // disabling console logs from Mirage
      server.logging = false;
      products.forEach((item) => {
        server.create("product", { ...item });
      });

      server.db.loadData({
        logs: [], // initialize empty logs array
      });

      users.forEach((item, index) =>
        server.create("user", {
          ...item,
          cart: [],
          balance: 100, // default balance for users can be anything
          wishlist: [],
          isOwner: index === 0, // First user is the contract owner for testing
          addressList: [
            {
              _id: uuid(),
              name: "Aniket Saini",
              street: "66/6B Civil Lines",
              city: "Roorkee",
              state: "Uttarakhand",
              country: "India",
              pincode: "247667",
              phone: "9639060737",
            },
          ],
        })
      );

      categories.forEach((item) => server.create("category", { ...item }));
    },

    routes() {
      this.namespace = "api";
      // auth routes (public)
      this.post("/auth/signup", signupHandler.bind(this));
      this.post("/auth/login", loginHandler.bind(this));

      // products routes (public)
      this.get("/products", getAllProductsHandler.bind(this));
      this.get("/products/:productId", getProductHandler.bind(this));

      // categories routes (public)
      this.get("/categories", getAllCategoriesHandler.bind(this));
      this.get("/categories/:categoryId", getCategoryHandler.bind(this));

      // cart routes (private)
      this.get("/user/cart", getCartItemsHandler.bind(this));
      this.post("/user/cart", addItemToCartHandler.bind(this));
      this.post("/user/cart/clearCart", clearCartHandler.bind(this));
      this.post("/user/cart/:productId", updateCartItemHandler.bind(this));
      this.delete(
        "/user/cart/:productId",
        removeItemFromCartHandler.bind(this)
      );

      // wishlist routes (private)
      this.get("/user/wishlist", getWishlistItemsHandler.bind(this));
      this.post("/user/wishlist", addItemToWishlistHandler.bind(this));
      this.delete(
        "/user/wishlist/:productId",
        removeItemFromWishlistHandler.bind(this)
      );

      //address routes (private)
      this.get("/user/address", getAddressListHandler.bind(this));
      this.post("/user/address", addAddressHandler.bind(this));
      this.post("/user/address/:addressId", updateAddressHandler.bind(this));
      this.delete("/user/address/:addressId", removeAddressHandler.bind(this));

      // order routes (private)
      this.get("/user/orders", getOrderItemsHandler.bind(this));
      this.post("/user/orders", addItemToOrdersHandler.bind(this));

      // token routes (private)
      this.post("/token/mint", mintTokenHandler.bind(this));
      this.post("/token/transfer", transferTokenHandler.bind(this));
      this.get("/token/balance/:email", getBalanceHandler.bind(this));

      // logs route (public)
      this.get("/token/logs", getTokenLogsHandler.bind(this));
    },
  });
}

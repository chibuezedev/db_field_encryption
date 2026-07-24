/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */
/* eslint-disable func-names */
/* eslint-disable default-case */
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import {
  encrypt,
  decrypt,
  validateRoutingNumber,
  validateEmail,
  validateWalletAddress,
} from "../../utils/encryption";

const payoutDestinationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["BANK_ACCOUNT", "PAYPAL", "CARD", "CRYPTO_WALLET"],
      required: true,
    },
    bankName: {
      type: String,
      set(value) {
        return value ? encrypt(value) : value;
      },
      get(value) {
        return value ? decrypt(value) : value;
      },
    },
    accountNumber: {
      type: String,
      set(value) {
        return value ? encrypt(value) : value;
      },
      get(value) {
        return value ? decrypt(value) : value;
      },
    },
    routingNumber: {
      type: String,
      validate: {
        validator(v) {
          return this.type !== "BANK_ACCOUNT" || validateRoutingNumber(v);
        },
        message: "Invalid routing number format",
      },
    },
    accountHolderName: {
      type: String,
      set(value) {
        return value ? encrypt(value) : value;
      },
      get(value) {
        return value ? decrypt(value) : value;
      },
    },
    swiftCode: { type: String },
    paypalEmail: {
      type: String,
      validate: {
        validator(v) {
          return this.type !== "PAYPAL" || validateEmail(v);
        },
        message: "Invalid PayPal email format",
      },
      set(value) {
        return value ? encrypt(value) : value;
      },
      get(value) {
        return value ? decrypt(value) : value;
      },
    },
    cardToken: {
      type: String,
      set(value) {
        return value ? encrypt(value) : value;
      },
      get(value) {
        return value ? decrypt(value) : value;
      },
    },
    last4: { type: String },
    walletAddress: {
      type: String,
      validate: {
        validator(v) {
          return (
            this.type !== "CRYPTO_WALLET" ||
            validateWalletAddress(v, this.cryptoType)
          );
        },
        message: "Invalid wallet address format",
      },
      set(value) {
        return value ? encrypt(value) : value;
      },
      get(value) {
        return value ? decrypt(value) : value;
      },
    },
    cryptoType: { type: String, enum: ["BITCOIN", "ETHEREUM", "USDC"] },

    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
      countryCode: String,
    },
  },
  { _id: false, toJSON: { getters: true }, toObject: { getters: true } }
);


//PS: just a fraction of the whole model schema where it was applied!

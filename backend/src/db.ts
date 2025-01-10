import mongoose, { Schema, model } from "mongoose";

// user collection

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "rooms",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

export const userModel = model("users", userSchema);

// room collection

const roomSchema = new Schema(
  {
    name: { type: String, required: true },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: [],
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "messages",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

export const roomModel = model("rooms", roomSchema);

// message collection

const messageSchema = new Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rooms",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const messageModel = model("messages", messageSchema);

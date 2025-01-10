import express, { json } from "express";
import WebSocket, { WebSocketServer } from "ws";
import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";
import { z } from "zod";
import { messageModel, roomModel, userModel } from "./db";
import { comparePassword, hashPassword } from "./bcrypt";
import { auth } from "./middleware";
import { generateToken } from "./jwt";
import cors from "cors";

dotenv.config();

(async function connectDb() {
  try {
    await connect(`${process.env.MONGO_URI}`);
    console.log("DB CONNECTED");
  } catch (err) {
    console.log("ERROR : ", err);
  }
})();

// ================================= HTTP server implementation ==============================================

const app = express();

app.use(cors());
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const signupSchema = z.object({
      name: z.string(),
      username: z.string(),
      password: z.string(),
    });

    const { name, username, password } = req.body;
    const isValid = signupSchema.safeParse({ name, username, password });

    if (!isValid.success) {
      res.json({ Error: isValid.error });
      return;
    }

    const hashedPassword = await hashPassword(password);
    console.log(hashedPassword);
    await userModel.create({ name, username, password: hashedPassword });
    res.json("user signup");
    return;
  } catch (err) {
    res.json(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const signupSchema = z.object({
      username: z.string(),
      password: z.string(),
    });

    const { username, password } = req.body;
    const isValid = signupSchema.safeParse({ username, password });

    if (!isValid.success) {
      res.json({ Error: isValid.error });
      return;
    }

    const user = await userModel.findOne({ username });
    console.log(user);
    if (!user) {
      res.json({ ERROR: "User not found" });
      return;
    }
    const passwordMatched = await comparePassword(password, user.password);
    if (!passwordMatched) {
      res.json("Bad Credentials");
      return;
    }

    const token = await generateToken(username);
    res.json({
      userId: user._id,
      username: user.username,
      name: user.name,
      token: "Bearer " + token,
    });
    return;
  } catch (err) {
    res.json(err);
  }
});

app.post("/create-room", auth, async (req, res) => {
  const { name } = req.body;
  const roomName = z.string().min(3).max(16);

  // @ts-ignore
  const { username } = req.user;

  const isValid = roomName.safeParse(name);

  if (!isValid.success) {
    res.json({ Error: isValid.error });
    return;
  }
  const room = await roomModel.create({ name });

  const user = await userModel.findOne({ username });
  console.log("user = ", user);
  console.log("room = ", room);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  try {
    await roomModel.updateOne(
      { _id: room._id },
      { $push: { users: user._id } }
    );

    await userModel.updateOne(
      { _id: user._id },
      { $push: { rooms: room._id } }
    );
    const newRoom = await roomModel
      .findOne({ _id: room._id })
      .populate("users", "-password");

    res.status(200).json({ success: "User joined the room", room: newRoom });
  } catch (error) {
    console.error("Error updating room or user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/join-room", auth, async (req, res) => {
  const { roomId } = req.body;

  // @ts-ignore
  const { username } = req.user;

  if (!roomId) {
    res.status(400).json({ error: "Room ID is invalid" });
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    res.status(400).json({ error: "Room ID is not a valid ObjectId" });
    return;
  }

  const user = await userModel.findOne({ username });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const room = await roomModel
    .findOne({ _id: roomId })
    .populate("users", "-password");

  if (!room) {
    res.status(404).json({ error: "No Room Found" });
    return;
  }

  const userAlreadyExists = room.users.some((u) => u._id.equals(user._id));

  if (userAlreadyExists) {
    res.status(400).json({ error: "User already in the room" });
    return;
  }

  try {
    await roomModel.updateOne({ _id: roomId }, { $push: { users: user._id } });

    await userModel.updateOne(
      { _id: user._id },
      { $push: { rooms: room._id } }
    );

    res.status(200).json({ success: "User joined the room", room });
  } catch (error) {
    console.error("Error updating room or user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(process.env.HTTP_PORT, () => {
  console.log("Server started at port : ", process.env.HTTP_PORT);
});

app.get("/all-rooms", auth, async (req, res) => {
  // @ts-ignore
  const { username } = req.user;
  const rooms = await userModel
    .findOne({ username })
    .select("-password")
    .populate("rooms");
  res.json(rooms);
});

app.get("/all-messages/:roomId", auth, async (req, res) => {
  // @ts-ignore
  const roomId = req.params.roomId;
  const data = await roomModel.findOne({ _id: roomId }).populate("messages");
  if (!data) {
    res.json({ Error: "no messages found" });
    return;
  }
  res.json(data.messages);
});

// =================================Web sockets implementation ==============================================

const groups = new Map<string, Set<{ socket: WebSocket; userId: string }>>();

const wss = new WebSocketServer({
  port: process.env.WSS_PORT ? parseInt(process.env.WSS_PORT, 10) : 5000,
});

wss.setMaxListeners(Infinity);

// Function to add user to a room
const addUserToRoom = (roomId: string, socket: WebSocket, userId: string) => {
  if (!groups.has(roomId)) {
    groups.set(roomId, new Set());
  }
  // ! is used to tell typescript that it is not null
  const roomUsers = groups.get(roomId)!;
  roomUsers.add({ socket, userId });
  const payload = {
    success: "user added to room",
  };
  socket.send(JSON.stringify(payload));
};

// Function to send message to a room
const sendMessageToRoom = async (
  roomId: string,
  socket: WebSocket,
  userId: string,
  message: string
) => {
  const room = groups.get(roomId);
  if (!room) {
    return;
  }
  const messageCollection = await messageModel.create({
    room: roomId,
    sender: userId,
    content: message,
  });
  const roomCollection = await roomModel.updateOne(
    { _id: roomId },
    {
      $push: {
        messages: messageCollection._id,
      },
    }
  );

  console.log("roomCollection = ", roomCollection);
  console.log("messageCollection = ", messageCollection);

  room.forEach((user) => {
    user.socket.send(JSON.stringify(messageCollection));
  });
};

wss.on("connection", (socket) => {
  const payload = {
    success: "connection established",
  };
  socket.send(JSON.stringify(payload));
  console.log("user connected");

  socket.on("message", async (data) => {
    const request = await JSON.parse(data.toString());
    if (request.type == "Join") {
      addUserToRoom(request.payload.roomId, socket, request.payload.userId);
    }

    if (request.type == "Chat") {
      sendMessageToRoom(
        request.payload.roomId,
        socket,
        request.payload.userId,
        request.payload.message
      );
    }
  });

  wss.on("error", (err: string, socket: WebSocket) => {
    console.log(err.toString());
    const payload = {
      ERROR: err,
    };
    socket.send(JSON.stringify(payload));
  });

  wss.on("close", (socket: WebSocket) => {
    const payload = {
      success: "Disconnected",
    };
    socket.send(JSON.stringify(payload));
  });
});

/*

  // for joining the room
  {
      "type" : "Join",
      "payload" : {
        "roomId" : "red",
        "userId" : "u23y498p3ihsajdr832";
      }
  }

  // for chatting in room
  {
      "type" : "Chat",
      "payload" : {
        "roomId" : "red",
        "userId" : "u23y498p3ihsajdr832";
        "message" : "hello"
      }
  }
      
  */

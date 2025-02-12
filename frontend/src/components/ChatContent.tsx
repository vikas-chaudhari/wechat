import { useEffect, useRef, useState } from "react";
import SendIcon from "../icons/SendIcon";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentRoomAtom } from "../recoil/atoms/CurrrentRoomAtom";
import { userAtom } from "../recoil/atoms/UserAtom";
import axios from "axios";
import { openChatAtom } from "../recoil/atoms/OpenChatAtom";
import { ChevronsLeft, Copy } from "lucide-react";
import { ToastContainer, Zoom, toast } from "react-toastify";

interface roomInterface {
  _id?: string;
  name?: string;
  users?: string[];
  createdAt?: string;
  updatedAt?: string;
}
interface userInterface {
  name?: string;
  token?: string;
  userId?: string;
  username?: string;
}

interface messageInterface {
  _id?: string;
  room?: string;
  sender?: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

const ChatContent = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<WebSocket>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<messageInterface[]>([]);
  const currentRoom = useRecoilValue<roomInterface>(currentRoomAtom);
  const user = useRecoilValue<userInterface>(userAtom);
  const [openChat, setOpenChat] = useRecoilState(openChatAtom);

  const http_url = import.meta.env.VITE_HTTP_URL;
  const ws_url = import.meta.env.VITE_WS_URL;
  const getPreviousmessages = async () => {
    const user = await JSON.parse(localStorage.getItem("user")!);
    if (!currentRoom._id) {
      return;
    }
    const { data } = await axios.get(
      `${http_url}/all-messages/${currentRoom._id}`,
      {
        headers: {
          Authorization: user.token,
        },
      }
    );
    setMessages(data);
  };

  useEffect(() => {
    getPreviousmessages();

    if (Object.keys(currentRoom).length > 0) {
      const socket = new WebSocket(`${ws_url}`);
      socketRef.current = socket;
      socket.onopen = () => {
        const message = {
          type: "Join",
          payload: {
            userId: user.userId,
            roomId: currentRoom._id,
          },
        };
        socket.send(JSON.stringify(message));
      };

      socket.onmessage = (ev) => {
        const data = JSON.parse(ev.data);
        if (data.sender) {
          setMessages((prev) => [...prev, data]);
        }
      };
      // clean up
      return function () {
        socket.close();
        setMessages([]);
      };
    }
  }, [currentRoom]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessageHandler = async () => {
    if (!inputRef?.current?.value) {
      return;
    }
    const message = {
      type: "Chat",
      payload: {
        userId: user.userId,
        roomId: currentRoom._id,
        message: inputRef.current.value,
      },
    };
    socketRef.current?.send(JSON.stringify(message));
  };

  const copyToClipboard = (roomId: string) => {
    window.navigator.clipboard.writeText(roomId);
    toast.success("Room Id copied");
  };

  return (
    <div
      className={`${openChat ? "flex flex-col" : "hidden"}
      h-[calc(100vh-64px)] bg-slate-950 relative w-full`}
    >
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Zoom}
      />
      {Object.keys(currentRoom).length > 0 ? (
        <>
          <div className="flex gap-2 flex-wrap items-center justify-between py-3 px-5 text-2xl font-semibold text-slate-300 bg-slate-950 border-b-[1px] border-b-slate-800">
            <div
              onClick={() => setOpenChat(false)}
              className="p-2 cursor-pointer bg-green-600 text-green-600 bg-opacity-20 rounded-lg "
            >
              <ChevronsLeft />
            </div>
            <h1>{currentRoom?.name}</h1>
            <div
              className="flex justify-center items-center gap-4 p-2 cursor-pointer bg-green-600 text-green-600 bg-opacity-20 rounded-lg"
              onClick={() => copyToClipboard(currentRoom._id!)}
            >
              <h1 className="break-all">{currentRoom?._id}</h1>
              <Copy />
            </div>
          </div>
          <div
            className="my-1 px-5 py-5 bg-slate-950 h-[calc(100%-140px)] overflow-y-auto"
            ref={scrollRef}
          >
            {!messages && (
              <h1 className="text-center text-2xl">No messages to show</h1>
            )}
            {messages.map((message, index) => (
              <div
                className={`flex flex-col my-4 ${
                  message.sender === user.userId ? "items-end" : "items-start"
                }`}
                key={index}
              >
                {message.sender === user.userId ? (
                  <h1 className="bg-slate-800 max-w-[calc(50%+50px)] break-all text-slate-300 px-4 py-2 text-xl rounded-md text-right">
                    {message.content}
                  </h1>
                ) : (
                  <h1 className="bg-slate-300 max-w-[calc(50%+50px)] break-all text-slate-800 px-4 py-2 text-xl rounded-md text-left">
                    {message.content}
                  </h1>
                )}
              </div>
            ))}
          </div>
          <div className="flex px-5 py-2 gap-2 items-center absolute w-full bottom-0 bg-slate-950 border-t-[1px] border-t-slate-800">
            <input
              className="w-full py-2 px-4 sm:py-4 sm:px-8 rounded-full bg-slate-800 text-slate-300 outline-none text-2xl"
              type="text"
              placeholder="Type Here"
              ref={inputRef}
            />
            <div
              onClick={sendMessageHandler}
              className="flex gap-2 cursor-pointer items-center bg-green-600 hover:bg-green-700  duration-150 select-none py-2 px-4 sm:py-4 sm:px-8 rounded-full text-2xl"
            >
              <button>Send</button>
              <SendIcon />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="h-full flex justify-center items-center">
            <h1 className="text-4xl text-slate-600">
              Click on rooms in sidebar to get Started
            </h1>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatContent;

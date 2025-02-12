import { useEffect } from "react";
import ChatIcon from "../icons/ChatIcon";
import axios from "axios";
import { useRecoilState, useSetRecoilState } from "recoil";
import { roomsAtom } from "../recoil/atoms/RoomsAtom";
import { currentRoomAtom } from "../recoil/atoms/CurrrentRoomAtom";
import { openChatAtom } from "../recoil/atoms/OpenChatAtom";
import { Users } from "lucide-react";
interface roomInterface {
  _id: string;
  name: string;
  users: string[];
  createdAt: string;
  updatedAt: string;
}

const SideBar = () => {
  const [rooms, setrooms] = useRecoilState(roomsAtom);
  const setCurrentRoom = useSetRecoilState(currentRoomAtom);
  const [openChat, setOpenChat] = useRecoilState(openChatAtom);

  const http_url = import.meta.env.VITE_HTTP_URL;
  const ws_url = import.meta.env.VITE_WS_URL;

  useEffect(() => {
    const getRooms = async () => {
      const user = await JSON.parse(localStorage.getItem("user")!);
      const { data } = await axios.get(`${http_url}/all-rooms`, {
        headers: {
          Authorization: user.token,
        },
      });
      setrooms(data.rooms);
    };
    getRooms();
  }, []);

  const goToCurrentRoomHandler = (currRoom: roomInterface) => {
    setCurrentRoom(currRoom);
    setOpenChat(true);
  };
  return (
    <div
      className={`${
        openChat ? "hidden" : "flex"
      } w-screen relative sm:w-64 h-[calc(100vh-64px)] pt-2 px-3 flex-col bg-slate-950 border-r-2 shadow-lg shadow-slate-900 border-r-slate-900`}
    >
      <div className="mt-2 w-full text-2xl flex justify-between items-center font-semibold text-slate-300">
        <h1>All Rooms</h1>
        <ChatIcon />
      </div>
      <div className="overflow-y-auto py-5 flex flex-col gap-2 ">
        {rooms.map((room: roomInterface) => (
          <div
            className="flex gap-4 cursor-pointer py-2 rounded-md bg-slate-900 px-2  hover:bg-slate-800 duration-150 select-none"
            key={room._id}
            onClick={() => goToCurrentRoomHandler(room)}
          >
            <Users className="text-slate-600" />
            <h1 className="text-xl">{room.name}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;

import { useSetRecoilState } from "recoil";
import CrossIcon from "../icons/CrossIcon";
import GroupIcon from "../icons/GroupIcon";
import { joinRoomAtom } from "../recoil/atoms/joinRoomAtom";
import { useRef } from "react";
import axios from "axios";
import { loaderAtom } from "../recoil/atoms/LoaderAtom";
import { roomsAtom } from "../recoil/atoms/RoomsAtom";
import { toast, ToastContainer, Zoom } from "react-toastify";

const JoinRoomModal = () => {
  const setJoinRoomModal = useSetRecoilState(joinRoomAtom);
  const roomIdRef = useRef<HTMLInputElement>(null);
  const setLoader = useSetRecoilState(loaderAtom);
  const setRooms = useSetRecoilState(roomsAtom);

  const joinRoomHandler = async () => {
    setLoader(true);
    const roomId = roomIdRef?.current?.value;
    const user = await JSON.parse(localStorage.getItem("user")!);
    await axios.post(
      "http://localhost:3000/join-room",
      {
        roomId,
      },
      {
        headers: {
          Authorization: user.token,
        },
      }
    );
    setJoinRoomModal(false);
    setLoader(false);
    toast.success("Room Joined");

    const getRooms = async () => {
      const user = await JSON.parse(localStorage.getItem("user")!);
      const { data } = await axios.get("http://localhost:3000/all-rooms", {
        headers: {
          Authorization: user.token,
        },
      });
      setRooms(data.rooms);
    };
    getRooms();
  };

  return (
    <div className="flex absolute z-50 top-[64px] h-[calc(100vh-64px)] backdrop-blur-sm bg-slate-900 bg-opacity-70 w-full justify-center items-center">
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
      <div className="relative flex w-[350px] gap-4 flex-col px-4 py-6 items-center rounded-md bg-slate-950">
        <div
          onClick={() => setJoinRoomModal(false)}
          className="absolute cursor-pointer right-2 top-2 bg-red-600 hover:bg-red-700 duration-150 rounded-md p-1"
        >
          <CrossIcon />
        </div>
        <h1 className="px-2 text-4xl my-4">Join Room</h1>
        <input
          className="w-full px-4 py-2 rounded-md bg-gray-700 text-slate-300 outline-none"
          type="text"
          placeholder="Enter Room Id"
          ref={roomIdRef}
        />
        <div
          onClick={joinRoomHandler}
          className="flex w-full gap-2 cursor-pointer justify-center items-center bg-green-600 hover:bg-green-700 duration-150 select-none px-4 py-2 rounded-md font-semibold"
        >
          <GroupIcon />
          <button>Join</button>
        </div>
      </div>
    </div>
  );
};

export default JoinRoomModal;

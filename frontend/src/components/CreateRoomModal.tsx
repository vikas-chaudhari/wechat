import { useSetRecoilState } from "recoil";
import CrossIcon from "../icons/CrossIcon";
import PlusIcon from "../icons/PlusIcon";
import { createRoomAtom } from "../recoil/atoms/CreateRoomAtom";
import { useRef } from "react";
import axios from "axios";
import { loaderAtom } from "../recoil/atoms/LoaderAtom";
import { roomsAtom } from "../recoil/atoms/RoomsAtom";
import toast, { Toaster } from "react-hot-toast";

const CreateRoomModal = () => {
  const setCreateRoomModal = useSetRecoilState(createRoomAtom);
  const roomNameRef = useRef<HTMLInputElement>(null);
  const setLoader = useSetRecoilState(loaderAtom);
  const setRooms = useSetRecoilState(roomsAtom);
  const createRoomHandler = async () => {
    setLoader(true);
    const name = roomNameRef?.current?.value;
    const user = await JSON.parse(localStorage.getItem("user")!);
    await axios.post(
      "http://localhost:3000/create-room",
      {
        name,
      },
      {
        headers: {
          Authorization: user.token,
        },
      }
    );
    setCreateRoomModal(false);
    setLoader(false);
    toast.success("Room Created!");

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
      <Toaster position="top-center" reverseOrder={false} />
      <div className="relative flex w-[350px] gap-4 flex-col px-4 py-6 items-center rounded-md bg-slate-950">
        <div
          onClick={() => setCreateRoomModal(false)}
          className="absolute cursor-pointer right-2 top-2 bg-red-600 hover:bg-red-700 duration-150 rounded-md p-1"
        >
          <CrossIcon />
        </div>
        <h1 className="px-2 text-4xl my-4">Create Room</h1>
        <input
          className="w-full px-4 py-2 rounded-md bg-gray-700 text-slate-300 outline-none"
          type="text"
          placeholder="Enter Room Name"
          ref={roomNameRef}
        />
        <div
          onClick={createRoomHandler}
          className="flex cursor-pointer w-full gap-2 justify-center items-center bg-green-600 hover:bg-green-700 duration-150 select-none px-4 py-2 rounded-md font-semibold"
        >
          <PlusIcon />
          <button>Create</button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomModal;

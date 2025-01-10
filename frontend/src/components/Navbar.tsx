import { Link, useNavigate } from "react-router-dom";
import WeChatIcon from "../icons/WeChatIcon";
import PlusIcon from "../icons/PlusIcon";
import LogoutIcon from "../icons/LogoutIcon";
import { userAtom } from "../recoil/atoms/UserAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useEffect } from "react";
import GroupIcon from "../icons/GroupIcon";
import { createRoomAtom } from "../recoil/atoms/CreateRoomAtom";
import { joinRoomAtom } from "../recoil/atoms/joinRoomAtom";
import toast, { Toaster } from "react-hot-toast";

const Navbar = () => {
  const setCreateRoomModal = useSetRecoilState(createRoomAtom);
  const setJoinRoomModal = useSetRecoilState(joinRoomAtom);
  const [user, setUser] = useRecoilState(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const getuser = async () => {
      console.log(user);
      const data = await JSON.parse(localStorage.getItem("user")!);
      if (!data) {
        return;
      }
      setUser(data);
    };
    getuser();
  }, []);
  const createRoomModalHandler = () => {
    setCreateRoomModal(true);
    setJoinRoomModal(false);
  };
  const joinRoomModalHandler = () => {
    setCreateRoomModal(false);
    setJoinRoomModal(true);
  };

  const logoutHandler = async () => {
    setCreateRoomModal(false);
    setJoinRoomModal(false);

    localStorage.clear();
    setUser({});
    navigate("/login");
    toast.success("Lougout toasted!");
  };

  return (
    <div className="px-5 z-0 h-16 flex  justify-between items-center bg-slate-950 border-b-[1px] border-b-slate-800">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="text-4xl cursor-pointer gap-2 flex justify-center items-center font-bold text-green-600 select-none">
        <WeChatIcon />
        <h1>WeChat</h1>
      </div>
      {Object.keys(user).length === 0 ? (
        <div className="flex gap-1 justify-center items-center">
          <Link to={"/login"}>
            <button className="bg-green-600 hover:bg-green-700 duration-150 select-none px-4 py-2 rounded-md font-semibold">
              Login
            </button>
          </Link>

          <Link to={"/signup"}>
            <button className="bg-green-600 hover:bg-green-700 duration-150 select-none px-4 py-2 rounded-md font-semibold">
              Signup
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex gap-1 justify-center items-center">
          <div
            onClick={joinRoomModalHandler}
            className="flex cursor-pointer gap-2 justify-center items-center bg-green-600 hover:bg-green-700 duration-150 select-none px-4 py-2 rounded-md font-semibold"
          >
            <GroupIcon />
            <button>Join Room</button>
          </div>

          <div
            onClick={createRoomModalHandler}
            className="flex cursor-pointer gap-2 justify-center items-center bg-green-600 hover:bg-green-700 duration-150 select-none px-4 py-2 rounded-md font-semibold"
          >
            <PlusIcon />
            <button>Create Room</button>
          </div>

          <div
            onClick={logoutHandler}
            className="flex cursor-pointer gap-1 justify-center items-center bg-red-600 hover:bg-red-700 duration-150 select-none px-4 py-2 rounded-md font-semibold"
          >
            <LogoutIcon />
            <button>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;

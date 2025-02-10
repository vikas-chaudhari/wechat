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
import { ToastContainer, Zoom, toast } from "react-toastify";
import MenuIcon from "../icons/MenuIcon";
import { responsiveMenuModalAtom } from "../recoil/atoms/responsiveMenuModalAtom";

const Navbar = () => {
  const setCreateRoomModal = useSetRecoilState(createRoomAtom);
  const setJoinRoomModal = useSetRecoilState(joinRoomAtom);
  const setResponsiveMenuModal = useSetRecoilState(responsiveMenuModalAtom);

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
    setJoinRoomModal(false);
    setResponsiveMenuModal(false);
    setCreateRoomModal(true);
  };
  const joinRoomModalHandler = () => {
    setCreateRoomModal(false);
    setResponsiveMenuModal(false);
    setJoinRoomModal(true);
  };

  const responsiveMenuModalHandler = () => {
    setCreateRoomModal(false);
    setJoinRoomModal(false);

    setResponsiveMenuModal((prev) => {
      console.log(prev);
      return !prev;
    });
  };

  const logoutHandler = async () => {
    setCreateRoomModal(false);
    setJoinRoomModal(false);
    setResponsiveMenuModal(false);

    localStorage.clear();
    setUser({});
    navigate("/login");
    toast.success("Logged out");
  };

  return (
    <>
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
      <div className="sm:px-5 px-2 z-0 h-16 flex  justify-between items-center bg-slate-950 text-white border-b-2 shadow-2xl shadow-slate-900 border-b-slate-900">
        <div className="text-4xl cursor-pointer gap-2 flex justify-center items-center font-bold text-green-600 select-none">
          <WeChatIcon />
          <h1>WeChat</h1>
        </div>
        <div
          onClick={responsiveMenuModalHandler}
          className="flex sm:hidden justify-center items-center p-2 cursor-pointer"
        >
          <MenuIcon />
        </div>
        <div className="hidden sm:flex">
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
      </div>
    </>
  );
};

export default Navbar;

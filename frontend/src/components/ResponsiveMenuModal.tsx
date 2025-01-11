import toast, { Toaster } from "react-hot-toast";
import { useRecoilState, useSetRecoilState } from "recoil";
import CrossIcon from "../icons/CrossIcon";
import { responsiveMenuModalAtom } from "../recoil/atoms/responsiveMenuModalAtom";
import { joinRoomAtom } from "../recoil/atoms/joinRoomAtom";
import { createRoomAtom } from "../recoil/atoms/CreateRoomAtom";
import { userAtom } from "../recoil/atoms/UserAtom";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import GroupIcon from "../icons/GroupIcon";
import PlusIcon from "../icons/PlusIcon";
import LogoutIcon from "../icons/LogoutIcon";

function ResponsiveMenuModal() {
  const setResponsiveMenuModal = useSetRecoilState(responsiveMenuModalAtom);
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
    setJoinRoomModal(false);
    setResponsiveMenuModal(false);
    setCreateRoomModal(true);
  };
  const joinRoomModalHandler = () => {
    setCreateRoomModal(false);
    setResponsiveMenuModal(false);
    setJoinRoomModal(true);
  };

  // const responsiveMenuModalHandler = () => {
  //   setCreateRoomModal(false);
  //   setJoinRoomModal(false);

  //   setResponsiveMenuModal((prev) => {
  //     console.log(prev);
  //     return !prev;
  //   });
  // };

  const logoutHandler = async () => {
    setCreateRoomModal(false);
    setJoinRoomModal(false);
    setResponsiveMenuModal(false);

    localStorage.clear();
    setUser({});
    navigate("/login");
    toast.success("Lougout toasted!");
  };

  return (
    <div className="sm:hidden flex absolute z-50 top-[64px] backdrop-blur-sm bg-slate-900 bg-opacity-70 w-full justify-center items-center">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="absolute top-0 right-0 flex w-[350px] gap-4 flex-col px-4 py-6 items-center rounded-md bg-slate-900">
        <div
          onClick={() => setResponsiveMenuModal(false)}
          className="absolute cursor-pointer right-2 top-2 bg-red-600 hover:bg-red-700 duration-150 rounded-md p-1"
        >
          <CrossIcon />
        </div>
        <h1 className="px-2 text-4xl my-4">Menu</h1>
        <div className="w-full flex flex-col justify-center items-center sm:hidden">
          {Object.keys(user).length === 0 ? (
            <div className="w-full flex gap-1 justify-center items-center">
              <div className="w-full flex">
                <Link to={"/login"}>
                  <button className="bg-green-600 hover:bg-green-700 duration-150 select-none px-4 py-2 rounded-md font-semibold">
                    Login
                  </button>
                </Link>
              </div>
              <div className="w-full flex">
                <Link to={"/signup"}>
                  <button className="bg-green-600 hover:bg-green-700 duration-150 select-none px-4 py-2 rounded-md font-semibold">
                    Signup
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-3 justify-center items-center">
              <div
                onClick={joinRoomModalHandler}
                className="w-full flex cursor-pointer gap-2 justify-center items-center bg-green-600 hover:bg-green-700 duration-150 select-none px-4 py-2 rounded-md font-semibold"
              >
                <GroupIcon />
                <button>Join Room</button>
              </div>

              <div
                onClick={createRoomModalHandler}
                className="w-full flex cursor-pointer gap-2 justify-center items-center bg-green-600 hover:bg-green-700 duration-150 select-none px-4 py-2 rounded-md font-semibold"
              >
                <PlusIcon />
                <button>Create Room</button>
              </div>

              <div
                onClick={logoutHandler}
                className="w-full flex cursor-pointer gap-1 justify-center items-center bg-red-600 hover:bg-red-700 duration-150 select-none px-4 py-2 rounded-md font-semibold"
              >
                <LogoutIcon />
                <button>Logout</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResponsiveMenuModal;

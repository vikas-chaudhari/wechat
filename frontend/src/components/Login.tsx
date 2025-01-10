import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../recoil/atoms/UserAtom";
import { loaderAtom } from "../recoil/atoms/LoaderAtom";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const setLoader = useSetRecoilState(loaderAtom);
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();

  const loginHandler = async () => {
    setLoader(true);
    const { data } = await axios.post("http://localhost:3000/login", {
      username: usernameRef?.current?.value,
      password: passwordRef?.current?.value,
    });
    if (data.ERROR || data.errno) {
      setLoader(false);
      return;
    }
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    setLoader(false);
    navigate("/");
    toast.success("Login successful!");
  };
  return (
    <div className="flex pt-20 justify-center">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex w-[350px] flex-col px-2 items-center rounded-md bg-slate-950">
        <h1 className="px-2 text-4xl py-4">Login</h1>
        <div className="w-full flex flex-col px-2 gap-4 py-5">
          <input
            className="px-4 py-2 rounded-md bg-gray-700 text-slate-300 outline-none"
            type="text"
            placeholder="Username"
            ref={usernameRef}
          />
          <input
            className="px-4 py-2 rounded-md bg-gray-700 text-slate-300 outline-none"
            type="text"
            placeholder="password"
            ref={passwordRef}
          />
          <button
            onClick={loginHandler}
            className="bg-green-600 hover:bg-green-700 duration-150 select-none px-4 py-2 rounded-md font-semibold"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

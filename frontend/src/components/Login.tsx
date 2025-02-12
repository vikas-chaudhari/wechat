import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../recoil/atoms/UserAtom";
import { loaderAtom } from "../recoil/atoms/LoaderAtom";
import { ToastContainer, Zoom, toast } from "react-toastify";

const Login = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const setLoader = useSetRecoilState(loaderAtom);
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();

  const http_url = import.meta.env.VITE_HTTP_URL;

  const loginHandler = async () => {
    setLoader(true);
    const { data } = await axios.post(`${http_url}/login`, {
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
    toast.success("Logged In");
    navigate("/");
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
      <div className="flex justify-center items-center h-[calc(100vh-64px)] bg-slate-950 text-white">
        <div className="flex w-[350px] flex-col px-2 items-center rounded-xl bg-slate-950 border-2 border-slate-900 shadow-2xl shadow-slate-900">
          <h1 className="px-2 text-4xl py-4">Login</h1>
          <div className="w-full flex flex-col px-2 gap-4 py-5">
            <input
              className="px-4 py-2 rounded-md bg-slate-900 text-slate-300 outline-none"
              type="text"
              placeholder="Username"
              ref={usernameRef}
            />
            <input
              className="px-4 py-2 rounded-md bg-slate-900 text-slate-300 outline-none"
              type="text"
              placeholder="password"
              ref={passwordRef}
            />
            <button
              onClick={loginHandler}
              className="bg-green-600 hover:bg-green-700 shadow-md duration-150 select-none px-4 py-2 rounded-md font-semibold"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

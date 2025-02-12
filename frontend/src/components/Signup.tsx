import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Zoom } from "react-toastify";

const Signup = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const http_url = import.meta.env.VITE_HTTP_URL;

  const signupHandler = async () => {
    await axios.post(`${http_url}/signup`, {
      name: nameRef?.current?.value,
      username: usernameRef?.current?.value,
      password: passwordRef?.current?.value,
    });
    toast.success("Signed Up");
    navigate("/login");
  };
  return (
    <div className="flex justify-center items-center h-[calc(100vh-64px)] bg-slate-950 text-white">
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
      <div className="flex w-[350px] flex-col px-2 items-center rounded-xl bg-slate-950 border-2 border-slate-900 shadow-2xl shadow-slate-900">
        <h1 className="px-2 text-4xl py-4">Signup</h1>
        <div className="w-full flex flex-col px-2 gap-4 py-5">
          <input
            className="px-4 py-2 rounded-md bg-slate-900 text-slate-300 outline-none"
            type="text"
            placeholder="Name"
            ref={nameRef}
          />
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
            onClick={signupHandler}
            className="bg-green-600 hover:bg-green-700 duration-150 select-none px-4 py-2 rounded-md font-semibold"
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;

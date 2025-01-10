import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const signupHandler = async () => {
    await axios.post("http://localhost:3000/signup", {
      name: nameRef?.current?.value,
      username: usernameRef?.current?.value,
      password: passwordRef?.current?.value,
    });
    navigate("/login");
  };
  return (
    <div className="flex pt-20 justify-center">
      <div className="flex w-[350px] flex-col px-2 items-center rounded-md bg-slate-950">
        <h1 className="px-2 text-4xl py-4">Signup</h1>
        <div className="w-full flex flex-col px-2 gap-4 py-5">
          <input
            className="px-4 py-2 rounded-md bg-gray-700 text-slate-300 outline-none"
            type="text"
            placeholder="Name"
            ref={nameRef}
          />
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

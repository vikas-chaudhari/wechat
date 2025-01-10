import { FallingLines } from "react-loader-spinner";

function Loader() {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-slate-950">
      <div className="flex flex-col justify-center items-center backdrop-blur-md">
        <FallingLines color="#43A047" width="100" visible={true} />
        <h1 className="text-xl">Loading...</h1>
      </div>
    </div>
  );
}

export default Loader;

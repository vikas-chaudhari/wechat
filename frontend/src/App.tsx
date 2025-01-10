import { Route, Routes } from "react-router-dom";
import "./App.css";
import ChatContent from "./components/ChatContent";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import Signup from "./components/Signup";
import { createRoomAtom } from "./recoil/atoms/CreateRoomAtom";
import { joinRoomAtom } from "./recoil/atoms/joinRoomAtom";
import { useRecoilValue } from "recoil";
import ProtectedRoutes from "./components/ProtectedRoutes";
import CreateRoomModal from "./components/CreateRoomModal";
import JoinRoomModal from "./components/JoinRoomModal";
import Loader from "./components/Loader";
import { loaderAtom } from "./recoil/atoms/LoaderAtom";

function App() {
  const createRoomModal = useRecoilValue(createRoomAtom);
  const joinRoomModal = useRecoilValue(joinRoomAtom);
  const loader = useRecoilValue(loaderAtom);

  return (
    <div className="flex flex-col text-white">
      {loader && <Loader />}
      <Navbar />
      {createRoomModal && <CreateRoomModal />}
      {joinRoomModal && <JoinRoomModal />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <SideBar />
              <ChatContent />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

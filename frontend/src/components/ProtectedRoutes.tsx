import { ReactNode, useEffect } from "react";
import { userAtom } from "../recoil/atoms/UserAtom";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

interface ProtectedRoutesProps {
  children: ReactNode;
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ children }) => {
  const [user, setUser] = useRecoilState(userAtom);

  const navigate = useNavigate();
  useEffect(() => {
    const getUser = async () => {
      const userData = await JSON.parse(localStorage.getItem("user")!);
      if (!userData) {
        navigate("/login");
        return;
      }
      setUser(userData);
    };
    getUser();
  }, []);
  return user && <div className={`flex`}>{children}</div>;
};

export default ProtectedRoutes;

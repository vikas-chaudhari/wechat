import { atom } from "recoil";
interface userInterface {
  name?: string;
  token?: string;
  userId?: string;
  username?: string;
}
export const userAtom = atom<userInterface>({
  key: "userAtom",
  default: {},
});

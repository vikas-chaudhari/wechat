import { atom } from "recoil";

interface roomInterface {
  _id?: string;
  name?: string;
  users?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const currentRoomAtom = atom<roomInterface>({
  key: "currentRoomAtom",
  default: {},
});

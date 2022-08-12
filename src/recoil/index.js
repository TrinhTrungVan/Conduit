import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue } from "recoil";

const getUserInfoFromLocal = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;

export const userInfo = atom({
    key: "userInfo",
    default: getUserInfoFromLocal,
});

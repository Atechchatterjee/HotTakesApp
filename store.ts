import { create } from "zustand";
import { UserSchema } from "types/dbSchemas";

export type storeSchema = {
  user: UserSchema;
  setUser: (_: Partial<UserSchema>) => void;
};

export const useStore = create<storeSchema>((set) => ({
  user: {
    userId: "",
    avatarImgSrc: "",
    name: "",
    isAuthor: false,
  },
  setUser: ({ userId, avatarImgSrc, name, isAuthor }) =>
    set((state) => ({
      user: {
        userId: userId || state.user.userId,
        avatarImgSrc: avatarImgSrc || state.user.avatarImgSrc,
        name: name || state.user.name,
        isAuthor: isAuthor || state.user.isAuthor,
      },
    })),
}));

import { create } from "zustand";

export type User = {
  userId: string;
  avatarImgSrc: string;
  name: string;
  isAuthor: boolean;
};

export type storeSchema = {
  user: User;
  setUser: (_: Partial<User>) => void;
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

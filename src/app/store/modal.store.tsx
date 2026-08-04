import { create } from "zustand";

type ModalType = "login" | "otp" | "profile" | null;

interface ModalState {
  modal: ModalType;
  phone?: string;
  isNewUser: boolean;
  open: (modal: ModalType, phone?: string, isNewUser?: boolean) => void;
  close: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modal: null,
  phone: undefined,
  isNewUser: false,

  open: (modal, phone, isNewUser = false) =>
    set({ modal, phone, isNewUser }),

  close: () =>
    set({ modal: null, phone: undefined, isNewUser: false }),
}));

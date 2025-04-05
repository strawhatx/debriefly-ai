import { create } from 'zustand';

type DateStore = {
  date: Date;
  setDate: (date: Date) => void;
};

export const useDateStore = create<DateStore>((set) => ({
  date: new Date(),
  setDate: (date) => set({ date }),
}));
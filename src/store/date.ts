import { create } from 'zustand';

type DateStore = {
  date: Date; 
  setDate: (date: Date) => void;

  days:number;
  setDays: (days: number) => void;
};

export const useDateStore = create<DateStore>((set) => ({
  date: new Date(),
  setDate: (date) => set({ date }),

  days: 7,
  setDays: (days) => set({ days }),
}));
import { create } from 'zustand';

type EventStore = {
    event: string;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setEvent: (evt: string) => void;
  };            
  
  export const useEventStore = create<EventStore>((set) => ({
    event: "",
    loading: false,
    setLoading: (loading: boolean) => set({ loading }),
    setEvent: (evt) => set({ event: evt }),
  }));
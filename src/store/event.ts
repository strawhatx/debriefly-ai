import { create } from 'zustand';

type EventBusStore = {
  subscribers: Record<string, Function[]>;
  subscribe: (event: string, handler: Function) => () => void;
  publish: (event: string, data: any) => void;
};

export const useEventBus = create<EventBusStore>((set, get) => ({
  subscribers: {},
  subscribe: (event, handler) => {
    set((state) => ({
      subscribers: {
        ...state.subscribers,
        [event]: [...(state.subscribers[event] || []), handler],
      },
    }));
    return () => {
      set((state) => ({
        subscribers: {
          ...state.subscribers,
          [event]: state.subscribers[event].filter((sub) => sub !== handler),
        },
      }));
    };
  },
  publish: (event, data) => {
    const eventSubscribers = get().subscribers[event] || [];
    eventSubscribers.forEach((handler) => handler(data));
  },
}));

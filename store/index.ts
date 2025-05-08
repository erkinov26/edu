import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface useStore {
  user: any;
  setUser: (value: any) => void;
  loadUser: () => void;
  logout: () => void;
}

const useStore = create<useStore>((set) => ({
  user: null,

  setUser: async (value) => {
    set({ user: value });
    await AsyncStorage.setItem('user', JSON.stringify(value));
  },

  loadUser: async () => {
    const data = await AsyncStorage.getItem('user');
    if (data) {
      set({ user: JSON.parse(data) });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('user'); // local storage tozalanadi
    set({ user: null }); // store'dagi user null qilinadi
  },
}));

export default useStore;

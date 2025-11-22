
import { UserState } from '../types';

const STORAGE_KEY = 'CHRONOS_FLOW_STATE_V1';

export const storage = {
  saveState: async (state: UserState): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Failed to save state', e);
    }
  },

  loadState: async (): Promise<UserState | null> => {
    try {
      const jsonValue = localStorage.getItem(STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Failed to load state', e);
      return null;
    }
  },

  clear: async (): Promise<void> => {
      localStorage.removeItem(STORAGE_KEY);
  }
};

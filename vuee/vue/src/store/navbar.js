import { defineStore } from 'pinia'

export const useMyStore = defineStore({
    id: 'user',
    state: () => ({
      loginState: false,
      refreshAdmin: false,
    }),
    actions: {
      setUserInfo() {
        this.loginState = true;
      },

      refreshAdmin()
      {
        this.refreshAdmin = true;
      },
    }
  });

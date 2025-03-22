import { defineStore } from "pinia";

export const useWalletStore = defineStore("wallet", {
  state: () => ({
    balance: 250,
  }),

  getters: {
    formattedBalance: (state) => `${state.balance} ₺`,
  },

  actions: {
    addBalance(amount: number) {
      this.balance += amount;
      this.saveBalance();
    },

    reduceBalance(amount: number) {
      this.balance -= amount;
      this.saveBalance();
    },

    saveBalance() {
      localStorage.setItem("balance", this.balance.toString());
    },

    loadBalance() {
      const saved = localStorage.getItem("balance");
      if (saved) {
        this.balance = parseInt(saved);
      }
    }
  }
});

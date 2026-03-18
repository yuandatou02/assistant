import { defineStore } from "pinia";

const useMatchStore = defineStore("useMatchStore", {
  state: () => {
    return {
      summonerId: -1,
      localSummonerId: -1,
    };
  },
});

export default useMatchStore;

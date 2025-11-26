import { defineStore } from "pinia";

const useRuneStore = defineStore("useRuneStore", {
  state: () => {
    return {
      currentChamp: 0,
      currentChampImgUrl: "",
      currentChampAlias: "",
      currentChampTitle: "",
      runeDataList: [],
      blockDataList: [],
      skillsList: [],
    };
  },
});

export default useRuneStore;

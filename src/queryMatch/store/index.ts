import BaseMatch from "@/lcu/baseMatch";
import type { SummonerInfo } from "@/lcu/types/SummonerTypes";
import { defineStore } from "pinia";

const baseMatch = new BaseMatch();

const useMatchStore = defineStore("useMatchStore", {
  state: () => ({
    summonerId: -1,
    localSummonerId: -1,
    matchLoading: true,
    summonerInfo: null as { info: SummonerInfo; rank: string[] } | null,
  }),
  actions: {
    async init(summonerId?: number, localSummonerId?: number) {
      const result = await baseMatch.getSummonerInfo(summonerId);
      if (result === null) {
        return;
      }
      if (summonerId === undefined && localSummonerId === undefined) {
        this.localSummonerId = result.summonerInfo.currentId;
      } else if (localSummonerId !== undefined) {
        this.localSummonerId = localSummonerId;
      }
      this.summonerId = result.summonerInfo.currentId;
      this.summonerInfo = { info: result.summonerInfo, rank: result.rankList };
    },
  },
});

export default useMatchStore;

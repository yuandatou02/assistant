import BaseMatch from "@/lcu/baseMatch";
import type {
  ParticipantsInfo,
  SimpleMatchDetailsTypes,
} from "@/lcu/types/MatchLcuTypes";
import type { SummonerInfo } from "@/lcu/types/SummonerTypes";
import type { RencentDataAnalysisTypes } from "@/lcu/types/TeammateTypes";
import { findTopChamp } from "@/lcu/utils";
import { defineStore } from "pinia";

const baseMatch = new BaseMatch();

const useMatchStore = defineStore("useMatchStore", {
  state: () => ({
    summonerId: -1,
    localSummonerId: -1,
    matchLoading: true,
    summonerInfo: null as { info: SummonerInfo; rank: string[] } | null,
    analysisData: null as RencentDataAnalysisTypes | null,
    recentMatchList: [] as SimpleMatchDetailsTypes[] | null,
    participantsInfo: null as null | ParticipantsInfo,
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
      // 获取最近对局数据分析
      this.fetchAndProcessMatches(this.summonerInfo.info.puuid).then(() => {
        if (this.matchLoading) {
          setTimeout(() => {
            this.matchLoading = false;
          }, 500);
        }
      });
    },
    async fetchAndProcessMatches(puuid: string) {
      const matchResults = await baseMatch.dealMatchHistory(puuid, 0, 49);
      // if (matchResults !== null) {
      //   for (let i = 0; i < matchResults.length; i++) {
      //     const matchItem = matchResults[i];
      //     if (matchItem !== null) {
      //       if (i === 0) {
      //         this.getMatchDetail(matchItem.gameId);
      //       }
      //       this.recentMatchList?.push(matchItem);
      //     }
      //   }
      // }
      this.recentMatchList = matchResults;
      this.analysisData = findTopChamp(this.recentMatchList);
    },
    // async getMatchDetail(gameId: number) {
    //   this.participantsInfo = await matchDetials.queryGameDetail(
    //     gameId,
    //     this.summonerId
    //   );
    // },
  },
});

export default useMatchStore;

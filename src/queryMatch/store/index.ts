import BaseMatch from "@/lcu/baseMatch";
import MatchDetails from "@/lcu/matchDetails";
import type {
  ParticipantsInfo,
  SimpleMatchDetailsTypes,
} from "@/lcu/types/MatchLcuTypes";
import type { SummonerInfo } from "@/lcu/types/SummonerTypes";
import type { RencentDataAnalysisTypes } from "@/lcu/types/TeammateTypes";
import { findTopChamp } from "@/lcu/utils";
import { defineStore } from "pinia";

const baseMatch = new BaseMatch();
const matchDetials = new MatchDetails();

const useMatchStore = defineStore("useMatchStore", {
  state: () => ({
    summonerId: -1,
    localSummonerId: -1,
    matchLoading: true,
    summonerInfo: null as { info: SummonerInfo; rank: string[] } | null,
    analysisData: null as RencentDataAnalysisTypes | null,
    recentMatchList: [] as SimpleMatchDetailsTypes[] | null,
    matchList: [] as SimpleMatchDetailsTypes[] | null,
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
      const matchResults = await baseMatch.dealMatchHistory(puuid, 0, 89);
      this.getMatchDetail(matchResults[0].gameId);
      this.recentMatchList = matchResults;
      this.matchList = this.recentMatchList.slice(0, 9);
      this.analysisData = findTopChamp(this.recentMatchList);
    },
    async getMatchDetail(gameId: number) {
      this.participantsInfo = await matchDetials.queryGameDetail(
        gameId,
        this.summonerId
      );
    },
  },
});

export default useMatchStore;

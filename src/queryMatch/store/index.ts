import BaseMatch from "@/lcu/baseMatch";
import MatchDetails from "@/lcu/matchDetails";
import type {
  Game,
  ParticipantsInfo,
  SimpleMatchDetailsTypes,
} from "@/lcu/types/MatchLcuTypes";
import type {
  SummonerInfo,
  SummonerInfoTypes,
} from "@/lcu/types/SummonerTypes";
import type { RencentDataAnalysisTypes } from "@/lcu/types/TeammateTypes";
import { findTopChamp } from "@/lcu/utils";
import { TencentRsoPlatformId } from "@/resources/areaList";
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
      await this.writeSummonerInfo(this.summonerInfo.info, matchResults[0]);
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
    async writeSummonerInfo(
      summonerInfo: SummonerInfo,
      match: SimpleMatchDetailsTypes
    ) {
      const platformId = TencentRsoPlatformId[match.platformId];
      // 召唤师信息
      const info: SummonerInfoTypes = {
        name: summonerInfo.name,
        summonerId: summonerInfo.currentId,
        puuid: summonerInfo.puuid,
        platformId: platformId,
      };
      localStorage.setItem("sumInfo", JSON.stringify(info));
    },
  },
});

export default useMatchStore;

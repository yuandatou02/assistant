import { queryRankPoint, querySummonerInfo } from "./aboutSummoner";

export default class BaseMatch {
  public getSummonerInfo = async (summonerId?: number) => {
    const summonerInfo = await querySummonerInfo(summonerId);
    if (summonerInfo !== null) {
      const rankList = await queryRankPoint(summonerInfo.puuid);
      return { summonerInfo, rankList };
    }
    return null;
  };
}

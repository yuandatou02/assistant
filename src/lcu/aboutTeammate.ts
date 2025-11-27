import { invokeLcu } from ".";
import { queryRankPoint, querySummonerInfo } from "./aboutSummoner";
import type { SummonerInfo } from "./types/SummonerTypes";
import type {
    ChampSelectSession,
    MyTeamObject,
    SummonerInfoList,
} from "./types/TeammateTypes";

// 获取选择英雄时 获取所以友方召唤师ID /lol-champ-select/v1/session 的值
export const queryAllSummonerId = async (isListenSession: boolean) => {
    await new Promise((resolve) => setTimeout(resolve, 666));
    const matchSession = await invokeLcu<ChampSelectSession>(
        "get",
        "/lol-champ-select/v1/session",
    );
    if (matchSession === null) return null;
    const getChampId =
        isListenSession === false
            ? await invokeLcu<number>(
                  "get",
                  "/lol-champ-select/v1/current-champion",
              )
            : 0;
    console.log(getChampId);
    const myTeam: MyTeamObject[] = matchSession.myTeam;
    if (myTeam) {
        const summonerIdList = [
            ...new Set(myTeam.map((summoner) => summoner.summonerId)),
        ].filter((id) => id !== 0);
        return {
            summonerIdList: summonerIdList,
            champId: getChampId === null ? 0 : getChampId,
        };
    }
    return null;
};

const fetchSummonerInfoWithRetry = async (
    summonerId: number,
    maxAttempts = 3,
): Promise<SummonerInfo | null> => {
    for (let attempts = 0; attempts < maxAttempts; attempts++) {
        const info = await querySummonerInfo(summonerId);
        if (info) return info;
        await new Promise((resolve) => setTimeout(resolve, 300));
    }
    return null;
};

// 获取我方召唤师ID和昵称
export const queryFriendInfo = async (
    isListenSession: boolean,
): Promise<{ list: SummonerInfoList[]; champId: number }> => {
    const summonerInfoList: SummonerInfoList[] = [];
    const summonerInfos = await queryAllSummonerId(isListenSession);
    if (summonerInfos === null) {
        return { list: [], champId: 0 };
    }
    for (const summonerId of summonerInfos.summonerIdList) {
        const currentSummonerInfo: SummonerInfo =
            await fetchSummonerInfoWithRetry(summonerId);
        if (currentSummonerInfo === null) {
            continue;
        }

        const rankHandler = await queryRankPoint(currentSummonerInfo.puuid);
        summonerInfoList.push({
            name: currentSummonerInfo.name,
            summonerId: `${summonerId}`,
            puuid: currentSummonerInfo.puuid,
            imgUrl: currentSummonerInfo.imgUrl,
            rank: `${rankHandler[0]} • ${rankHandler[1]}`,
        });
    }
    return { list: summonerInfoList, champId: summonerInfos.champId };
};

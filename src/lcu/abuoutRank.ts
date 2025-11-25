import type { ConfigRank } from "@/background/types";
import type { ChampInfo } from "./types/RankTypes";
import { requestFetch } from "@/main/utils/request";
import { champDict } from "@/resources/champList";
import { getPostion, toPercent } from "@/main/utils/rankUtils";

// 获取国服英雄数据排行
export const queryCNServe = async (
  configRank: ConfigRank,
  tier: number,
  lane: string,
  time: number,
  recursionCount: number
): Promise<null | [] | ChampInfo[] | undefined> => {
  if (recursionCount > 10) {
    return null;
  }
  configRank.tier = tier;
  localStorage.setItem("configRank", JSON.stringify(configRank));

  let championdetails = "";
  let champSliceList: any[] = [];
  const partUrl =
    "https://x1-6833.native.qq.com/x1/6833/1061021&3af49f?championid=666";
  const url =
    partUrl +
    `&lane=${lane}&ijob=all&dtstatdate=${time}&gamequeueconfigid=420&tier=${tier}`;

  const res = await requestFetch<any>(url, "GET");

  if (res === null) {
    return [];
  } else {
    if (res.data.result === "") {
      recursionCount += 1;
      return queryCNServe(configRank, tier, lane, time - 1, recursionCount);
    }
  }

  try {
    championdetails = JSON.parse(res.data.result).championdetails;
  } catch (e) {
    console.error("错误:", e);
    return champSliceList;
  }

  let chapmDetailList = championdetails.split("#");
  for (const [index, chapmDetailListElement] of chapmDetailList.entries()) {
    let sliceIndex = chapmDetailListElement.indexOf("_[");
    let dataStr =
      index < 9
        ? chapmDetailListElement.slice(2, sliceIndex)
        : chapmDetailListElement.slice(3, sliceIndex);
    let dataList = dataStr.split("_");

    champSliceList.push({
      sortId: index,
      imgUrl: `https://game.gtimg.cn/images/lol/act/img/champion/${
        champDict[dataList[0]]["alias"]
      }.png`,
      name:
        champDict[dataList[0]]["label"] + "•" + champDict[dataList[0]]["title"],
      tLevel: dataList[1],
      win: toPercent(parseFloat(dataList[2])),
      ban: toPercent(parseFloat(dataList[3])),
      appearance: toPercent(parseFloat(dataList[4])),
      champId: Number(dataList[0]),
    });
  }
  return champSliceList;
};

// 查询韩服数据
export const queryKRServe = async (
  configRank: ConfigRank,
  tier: number,
  lane: string,
  version: string
) => {
  configRank.tier = tier;
  localStorage.setItem("configRank", JSON.stringify(configRank));
  try {
    debugger;
    const url = `https://lol.ps/api/statistics/tierlist.json?region=0&version=${version}&tier=${tier}&lane=${lane}`;
    const res = await requestFetch<any>(url, "GET", undefined, 5000);

    const champList: ChampInfo[] = res.data.reduce(
      (res: any, item: any, index: number) => {
        const currentChamp: ChampInfo = {
          appearance: Number(item.pickRate).toFixed(1) + "%",
          ban: Number(item.banRate).toFixed(1) + "%",
          champId: item.championId,
          imgUrl: `https://game.gtimg.cn/images/lol/act/img/champion/${
            champDict[String(item.championId)].alias
          }.png`,
          name:
            champDict[item.championId]["label"] +
            "•" +
            champDict[item.championId]["title"],
          tLevel: item.isOp === true ? "0" : item.opTier,
          win: Number(item.winRate).toFixed(1) + "%",
          sortId: index,
        };
        return res.concat(currentChamp);
      },
      []
    );
    return champList;
  } catch (e) {
    return null;
  }
};

// 获取英雄反制数据
export const getRestRaintData = async (
  champId: number,
  lane: string,
  tier: number,
  is101: boolean,
  version: string
) => {
  let tierRes = 2;
  const position = getPostion(lane);
  if (!is101) {
    tierRes = tier;
  }
  const url = `https://lol.ps/api/champ/${champId}/versus.json?region=0&version=${version}&tier=${tierRes}&lane=${position}`;
  try {
    const result = await requestFetch<any>(url, "GET", undefined, 5000);
    const baseUrl = "https://game.gtimg.cn/images/lol/act/img/champion/";
    const resList: [string, string, number, number, number][] = [];

    const { counterChampionIdList, counterWinrateList, counterCountList } =
      result.data;

    for (let i = 0; i < counterChampionIdList.length; i++) {
      const champId: number = counterChampionIdList[i];
      const champInfo = champDict[champId];
      if (!champInfo) continue; // 跳过无效的 Champion ID

      const label = `${champInfo.label}•${champInfo.title}`;
      const imgUrl = `${baseUrl}${champInfo.alias}.png`;
      const winRate: number = counterWinrateList[i];
      const countMatch: number = counterCountList[i];

      resList.push([label, imgUrl, winRate, champId, countMatch]);
    }

    return resList;
  } catch (e) {
    return null;
  }
};

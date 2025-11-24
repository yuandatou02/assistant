import type { ConfigRank } from "@/background/types";
import type { ChampInfo } from "./types/RankTypes";
import { requestFetch } from "@/main/utils/request";
import { champDict } from "@/resources/champList";
import { toPercent } from "@/main/utils/rankUtils";

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

    champSliceList.push(<ChampInfo>{
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

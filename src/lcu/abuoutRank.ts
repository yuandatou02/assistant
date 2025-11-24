import type { ConfigRank } from "@/background/types";
import type { ChampInfo } from "./types/RankTypes";
import { requestFetch } from "@/main/utils/request";

// 获取国服英雄数据排行
export const queryCNserve = async (
  configRank: ConfigRank,
  tier: number,
  lane: string,
  time: number,
  recursionCount: number
): Promise<null | [] | ChampInfo[] | undefined> => {
  if (recursionCount > 10) return null;

  configRank.tier = tier;
  localStorage.setItem("configRank", JSON.stringify(configRank));
  let championdetails = "";
  let champList = [];
  const partUrl =
    "https://x1-6833.native.qq.com/x1/6833/1061021&3af49f?championid=666";
  const url =
    partUrl +
    `&lane=${lane}&ijob=all&dtstatdate=${time}&gamequeueconfigid=420&tier=${tier}`;
  const res = await requestFetch<any>(url, "GET");
  console.log("res:", res);
  console.log("url:", url);
};

// 查询本地召唤师信息
import type { SummonerInfo } from "@/lcu/types/SummonerTypes";
import { invoke } from "@tauri-apps/api/core";

/**
 * 查询召唤师信息
 *
 * 根据提供的召唤师 ID 查询对应的召唤师详细信息，如果未提供 ID 则查询当前登录的召唤师信息
 *
 * @param summonerId - 可选的召唤师 ID，支持数字或字符串类型。不传该参数时查询当前登录召唤师
 * @returns Promise<SummonerInfo> - 返回包含召唤师详细信息的 Promise 对象
 */
export const querySummonerInfo = async (summonerId?: number | string): Promise<SummonerInfo> => {
  const endpoint = summonerId ? `/lol-summoner/v1/summoners/${summonerId}` : "/lol-summoner/v1/current-summoner";
  return await invoke<SummonerInfo>("get_summoner_info", { endpoint });
};

// // 返回首页最终需要的数据
// export const getCurrentSummonerAllInfo = async () => {
//   const summonerInfo = await querySummonerInfo();
// };

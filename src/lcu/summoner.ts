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
export const querySummonerInfo = async (summonerId?: number | string): Promise<SummonerInfo | null> => {
  const endpoint = summonerId ? `/lol-summoner/v1/summoners/${summonerId}` : "/lol-summoner/v1/current-summoner";
  return await invoke<SummonerInfo | null>("get_summoner_info", { endpoint });
};

/**
 * 查询排位赛积分信息
 *
 * 根据提供的玩家唯一标识符 (puuid) 查询排位赛统计数据，包括单双排、灵活组排和云顶之弈的段位信息。
 * 如果未提供 puuid，则查询当前登录玩家的排位赛信息。
 *
 * @param puuid - 玩家唯一标识符，用于查询指定玩家的排位赛数据
 *                如果为 undefined 或未提供，则查询当前登录玩家的数据
 *
 * @returns Promise<string[]> - 返回包含三个段位信息的字符串数组：
 *                            - 索引 0: 单双排 (RANKED_SOLO_5x5) 段位信息
 *                            - 索引 1: 灵活组排 (RANKED_FLEX_SR) 段位信息
 *                            - 索引 2: 云顶之弈 (RANKED_TFT) 段位信息
 *                            每个字符串包含段位名称、胜点和胜率等信息，如果未定级则返回"未定级"
 *
 * @throws 当后端命令执行失败时抛出错误
 */
export const queryRankPoint = async (puuid?: string): Promise<string[]> => {
  // 根据是否提供 puuid 构建不同的 API 端点路径
  const endpoint = puuid ? `/lol-ranked/v1/ranked-stats/${puuid}` : "/lol-ranked/v1/current-ranked-stats";

  // 调用后端 Rust 命令获取排位赛积分信息
  return await invoke<string[]>("get_rank_point", { endpoint });
};

// 查看本地召唤师荣誉等级
export const querySummonerHonorLevel = async (): Promise<string> => {
  return await invoke<string>("get_summoner_honor_level");
};

// 查询召唤师绝活英雄数据
export const queryMasteryChampList = async (summonerPuuid?: string) => {
  const endpoint = summonerPuuid
    ? `/lol-champion-mastery/v1/${summonerPuuid}/champion-mastery`
    : "/lol-champion-mastery/v1/local-player/champion-mastery";
  return await invoke<string[][]>("get_mastery_champ_list", { endpoint });
};

// 返回首页最终需要的数据
export const getCurrentSummonerAllInfo = async () => {
  const [summonerInfo, rankList, honorData, champLevel] = await Promise.all([
    querySummonerInfo(),
    queryRankPoint(),
    querySummonerHonorLevel(),
    queryMasteryChampList(),
  ]);
  rankList.push(honorData);
  return { summonerInfo, rankList, champLevel };
};

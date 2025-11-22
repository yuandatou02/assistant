import { invokeLcu } from ".";
import type {
  HonorInfo,
  LcuSummonerInfo,
  RankedStats,
  SummonerInfo,
} from "./types/SummonerTypes";
import { dealDivsion, englishToChinese } from "./utils";

/**
 * 查询召唤师信息
 * @param summonerId - 可选的召唤师ID，如果不提供则查询当前召唤师信息
 * @returns 返回一个Promise，解析为SummonerInfo对象或null
 */
export const querySummonerInfo = async (
  summonerId?: number // 可选的召唤师ID参数
): Promise<SummonerInfo | null> => {
  // 返回类型为SummonerInfo或null的Promise
  // 根据是否提供summonerId来决定API端点
  const endpoint = summonerId
    ? `/lol-summoner/v1/summoners/${summonerId}` // 提供summonerId时的端点
    : "/lol-summoner/v1/current-summoner"; // 查询当前召唤师时的端点

  // 调用LCU接口获取召唤师信息
  const summonerInfo = await invokeLcu<LcuSummonerInfo>("get", endpoint);

  // 如果获取信息失败，返回null
  if (summonerInfo === null) {
    return null;
  }
  // 处理并返回格式化后的召唤师信息
  return {
    privacy: summonerInfo.privacy, // 隐私设置
    puuid: summonerInfo.puuid, // 玩家唯一标识符
    tagLine: summonerInfo.tagLine, // 标签行
    name: summonerInfo.gameName || summonerInfo.displayName, // 游戏名称或显示名称
    currentId: summonerInfo.summonerId, // 召唤师ID
    lv: "LV " + summonerInfo.summonerLevel, // 等级信息
    // 计算并格式化经验值百分比
    xp: parseInt(
      String(
        (summonerInfo.xpSinceLastLevel / summonerInfo.xpUntilNextLevel) * 100
      )
    ),
    // 构建头像图片URL
    imgUrl: `https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/${summonerInfo.profileIconId}.png`,
  };
};

export const queryRankPoint = async (puuid?: string): Promise<string[]> => {
  try {
    const endpoint = puuid
      ? `/lol-ranked/v1/ranked-stats/${puuid}`
      : "/lol-ranked/v1/current-ranked-stats";
    const point = await invokeLcu<RankedStats>("get", endpoint);
    const rankPoint = point?.queues;
    // 如果 rankPoint 无效，返回默认值
    if (!Array.isArray(rankPoint) || rankPoint.length === 0) {
      return ["未定级", "未定级", "未定级"];
    }
    // 查找不同模式的排名数据
    const rankSolo = rankPoint.find(
      (i: any) => i.queueType === "RANKED_SOLO_5x5"
    );
    const rankFlex = rankPoint.find(
      (i: any) => i.queueType === "RANKED_FLEX_SR"
    );
    const rankTft = rankPoint.find((i: any) => i.queueType === "RANKED_TFT");

    // 生成排名字符串的辅助函数
    const generateRankString = (rank: any): string => {
      if (!rank || rank.tier === "") return "未定级";
      return `${englishToChinese(rank.tier)}${dealDivsion(rank.division)} ${
        rank.leaguePoints
      }`;
    };
    // 获取各模式的排名信息
    const RANKED_SOLO = generateRankString(rankSolo);
    const RANKED_FLEX_SR = generateRankString(rankFlex);
    const RANKED_TFT = generateRankString(rankTft);

    return [RANKED_SOLO, RANKED_FLEX_SR, RANKED_TFT];
  } catch (error) {
    return ["未定级", "未定级", "未定级"];
  }
};

export const querySummonerHonorLevel = async (): Promise<string> => {
  const summonerHonor = await invokeLcu<HonorInfo>(
    "get",
    "/lol-honor-v2/v1/profile"
  );
  if (summonerHonor?.honorLevel === undefined) return "未知";
  return (
    "荣誉等级" + summonerHonor?.honorLevel + " 里程" + summonerHonor?.checkpoint
  );
};

export const getCurrentSummonerAllInfo = async () => {
  const summonerInfo = await querySummonerInfo();

  if (summonerInfo === null) return null;

  const [rankList, honorLevel] = await Promise.all([
    queryRankPoint(),
    querySummonerHonorLevel(),
  ]);
  rankList.push(honorLevel);
  return { summonerInfo, rankList };
};

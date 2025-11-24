import { champDict } from "@/resources/champList";
import { invokeLcu } from ".";
import type {
  ChampionMastery,
  HonorInfo,
  LcuSummonerInfo,
  RankedStats,
  SummonerInfo,
} from "./types/SummonerTypes";
import { dealDivsion, englishToChinese } from "./utils";
import { queryMatchHistory } from "./aboutMatch";
import { TencentRsoPlatformId } from "@/resources/areaList";

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

/**
 * 查询玩家排名点数的异步函数
 * @param puuid - 玩家的唯一标识符，可选参数
 * @returns 返回一个Promise，解析为包含三个排名信息的字符串数组
 */
export const queryRankPoint = async (puuid?: string): Promise<string[]> => {
  try {
    // 根据是否有puuid参数决定不同的API端点
    const endpoint = puuid
      ? `/lol-ranked/v1/ranked-stats/${puuid}`
      : "/lol-ranked/v1/current-ranked-stats";
    // 调用API获取排名统计数据
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
    // 发生错误时返回默认值
    return ["未定级", "未定级", "未定级"];
  }
};

/**
 * 查询召唤师荣誉等级的异步函数
 * @returns {Promise<string>} 返回包含荣誉等级和里程的字符串，如果无法获取则返回"未知"
 */
export const querySummonerHonorLevel = async (): Promise<string> => {
  // 调用LCU接口获取召唤师荣誉信息
  const summonerHonor = await invokeLcu<HonorInfo>(
    "get", // HTTP GET请求方法
    "/lol-honor-v2/v1/profile" // LCU API端点路径
  );
  // 检查荣誉等级是否存在，如果不存在则返回"未知"
  if (summonerHonor?.honorLevel === undefined) return "未知";
  // 返回格式化后的荣誉等级和里程信息
  return (
    "荣誉等级" + summonerHonor?.honorLevel + " 里程" + summonerHonor?.checkpoint
  );
};

// 查询召唤师绝活英雄数据信息
export const queryMasteryChampList = async (summonerPuuid?: string) => {
  if (summonerPuuid === "") return [];

  const endpoint = summonerPuuid
    ? `/lol-champion-mastery/v1/${summonerPuuid}/champion-mastery`
    : "/lol-champion-mastery/v1/local-player/champion-mastery";
  const summonerSuperChampData = await invokeLcu<ChampionMastery[]>(
    "get",
    endpoint
  );

  if (summonerSuperChampData === null) {
    return [];
  }
  return summonerSuperChampData
    .slice(0, 20)
    .reduce((res: string[][], item: ChampionMastery) => {
      return res.concat([
        [
          `https://game.gtimg.cn/images/lol/act/img/champion/${
            champDict[String(item.championId)]?.alias
          }.png`,
          `${champDict[String(item.championId)]?.label}•${
            champDict[String(item.championId)]?.title
          }`,
          `英雄等级 ${item.championLevel} / 熟练度 ${item.championPoints}`,
        ],
      ]);
    }, []);
};

export const getCurrentSummonerAllInfo = async () => {
  const summonerInfo = await querySummonerInfo();

  if (summonerInfo === null) return null;

  const [rankList, honorLevel, champLevel] = await Promise.all([
    queryRankPoint(),
    querySummonerHonorLevel(),
    queryMasteryChampList(),
  ]);
  rankList.push(honorLevel);
  return { summonerInfo, rankList, champLevel };
};

// 查询所在服务器ID
export const queryPlatformId = async (puuid: string): Promise<string> => {
  const matchList = await queryMatchHistory(puuid, 0, 0);
  if (matchList === null) {
    return "";
  } else {
    return (
      TencentRsoPlatformId[matchList[0].platformId] || matchList[0].platformId
    );
  }
};

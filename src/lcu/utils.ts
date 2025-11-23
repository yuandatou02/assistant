import { champDict } from "@/resources/champList";
import type { SimpleMatchDetailsTypes } from "./types/MatchLcuTypes";
import type {
  RencentDataAnalysisTypes,
  RoleCountMapTypes,
} from "./types/TeammateTypes";

// 英文段位昵称转中文
export const englishToChinese = (tier: string) => {
  switch (tier) {
    case "CHALLENGER":
      return "王者";
    case "GRANDMASTER":
      return "宗师";
    case "MASTER":
      return "大师";
    case "DIAMOND":
      return "钻石";
    case "EMERALD":
      return "翡翠";
    case "PLATINUM":
      return "铂金";
    case "GOLD":
      return "黄金";
    case "SILVER":
      return "白银";
    case "BRONZE":
      return "青铜";
    case "IRON":
      return "黑铁";
    default:
      return "未定级";
  }
};
// 处理段位数据
export const dealDivsion = (divsion: string) => {
  return divsion === "NA" ? "" : divsion;
};

// 根据游戏模式ID判断 游戏模式
export const queryGameType = (queueId: number) => {
  switch (queueId) {
    case 420:
      return "单双排位";
    case 430:
      return "匹配模式";
    case 440:
      return "灵活排位";
    case 450:
      return "极地乱斗";
    case 1700:
      return "斗魂竞技";
    case 1900:
      return "无限火力";
    case 1820:
      return "无尽狂潮";
    case 1810:
      return "无尽狂潮";
    case 1830:
      return "无尽狂潮";
    case 1840:
      return "无尽狂潮";
  }
  return "其它模式";
};

export const findTopChamp = (
  match: SimpleMatchDetailsTypes[]
): RencentDataAnalysisTypes => {
  const oneGameId = match[0].gameId;
  // 使用 Map 统计每个 champId 出现的次数
  const champIdCountMap = new Map<number, number>();
  const roleCountMap: RoleCountMapTypes = {
    assassin: 0,
    fighter: 0,
    mage: 0,
    marksman: 0,
    support: 0,
    tank: 0,
  };
  // 初始化 champIdCountMap 并统计 roleCountMap
  for (const champion of match) {
    const { champId } = champion;
    const role = champDict[champId].roles[0];
    // @ts-ignore
    roleCountMap[role] = roleCountMap[role] + 1;
    champIdCountMap.set(champId, (champIdCountMap.get(champId) || 0) + 1);
  }
  // 计算总数
  const totalChampions = match.length;

  // 将 Map 转换为数组，并按出现次数和原数组顺序排序
  const sortedChampIdCount = Array.from(champIdCountMap.entries()).sort(
    (a, b) => {
      // 如果出现次数相同，按照原数组顺序排序
      if (a[1] === b[1]) {
        const indexA = match.findIndex((c) => c.champId === a[0]);
        const indexB = match.findIndex((c) => c.champId === b[0]);
        return indexA - indexB;
      }

      // 按出现次数降序排序
      return b[1] - a[1];
    }
  );

  // 计算百分比并添加到结果中
  const top3Champions = sortedChampIdCount.slice(0, 3).map((entry) => {
    const [champId, count] = entry;
    return {
      champId,
      count,
    };
  });
  return { top3Champions, totalChampions, roleCountMap, oneGameId };
};

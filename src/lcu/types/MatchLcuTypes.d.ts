/**
 * 整个响应的根类型
 */
export interface MatchHistoryResp {
  /** 当前查询的账号ID */
  accountId: number;
  /** 对局列表的包装对象 */
  games: GamesWrapper;
  /** 平台标识，如 "CN", "KR", "NA1" 等 */
  platformId: string;
}

/**
 * games 字段的包装对象
 */
export interface GamesWrapper {
  /** 首次对局时间（ISO 字符串） */
  gameBeginDate: string;
  /** 本次返回的对局数量 */
  gameCount: number;
  /** 末次对局时间（ISO 字符串） */
  gameEndDate: string;
  /** 起始索引（分页用） */
  gameIndexBegin: number;
  /** 结束索引（分页用） */
  gameIndexEnd: number;
  /** 对局详情数组 */
  games: Game[];
}

/**
 * 单局比赛详情
 */
export interface Game {
  /** 游戏结果，如 "Fail", "Win" */
  endOfGameResult: string;
  /** 对局创建时间（Unix 毫秒） */
  gameCreation: number;
  /** 对局创建时间（ISO 字符串） */
  gameCreationDate: string;
  /** 对局持续时长（秒） */
  gameDuration: number;
  /** 对局唯一ID */
  gameId: number;
  /** 游戏模式，如 "CLASSIC", "ARAM" */
  gameMode: string;
  /** 当前模式下的变异因子（如无限火力 buff） */
  gameModeMutators: string[];
  /** 游戏类型，如 "MATCHED_GAME", "CUSTOM_GAME" */
  gameType: string;
  /** 游戏版本，如 "14.23.123.456" */
  gameVersion: string;
  /** 地图ID，如 11=召唤师峡谷，12=嚎哭深渊 */
  mapId: number;
  /** 参与者身份列表（账号维度） */
  participantIdentities: ParticipantIdentity[];
  /** 参与者详情列表（对局维度） */
  participants: Participant[];
  /** 平台标识 */
  platformId: string;
  /** 队列ID，如 420=排位单双，430=匹配自选 */
  queueId: number;
  /** 赛季ID，如 13=S13 */
  seasonId: number;
  /** 两队统计信息 */
  teams: Team[];
}

/**
 * 参与者身份（账号维度）
 */
export interface ParticipantIdentity {
  /** 对局内 participantId（1-10） */
  participantId: number;
  /** 玩家账号信息 */
  player: Player;
}

/**
 * 玩家账号信息
 */
export interface Player {
  /** 原始账号ID */
  accountId: number;
  /** 当前账号ID（可能转移过） */
  currentAccountId: number;
  /** 当前平台 */
  currentPlatformId: string;
  /** 游戏昵称 */
  gameName: string;
  /** 比赛历史 URI（相对路径） */
  matchHistoryUri: string;
  /** 原始平台 */
  platformId: string;
  /** 头像ID */
  profileIcon: number;
  /** 全局唯一PUUID */
  puuid: string;
  /** 召唤师ID（加密） */
  summonerId: number;
  /** 召唤师昵称 */
  summonerName: string;
  /** 标签线（#后内容） */
  tagLine: string;
}

/**
 * 单参与者对局详情
 */
export interface Participant {
  /** 所用英雄ID */
  championId: number;
  /** 最高段位，如 "DIAMOND", "UNRANKED" */
  highestAchievedSeasonTier: string;
  /** 对局内 participantId（1-10） */
  participantId: number;
  /** 召唤师技能1 */
  spell1Id: number;
  /** 召唤师技能2 */
  spell2Id: number;
  /** 赛后统计信息 */
  stats: ParticipantStats;
  /** 所属队伍ID，100=蓝方，200=红方 */
  teamId: number;
  /** 时间线数据（分时段） */
  timeline: ParticipantTimeline;
}

/**
 * 参与者赛后统计
 */
export interface ParticipantStats {
  assists: number;
  causedEarlySurrender: boolean;
  champLevel: number;
  combatPlayerScore: number;
  damageDealtToObjectives: number;
  damageDealtToTurrets: number;
  damageSelfMitigated: number;
  deaths: number;
  doubleKills: number;
  earlySurrenderAccomplice: boolean;
  firstBloodAssist: boolean;
  firstBloodKill: boolean;
  firstInhibitorAssist: boolean;
  firstInhibitorKill: boolean;
  firstTowerAssist: boolean;
  firstTowerKill: boolean;
  gameEndedInEarlySurrender: boolean;
  gameEndedInSurrender: boolean;
  goldEarned: number;
  goldSpent: number;
  inhibitorKills: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  killingSprees: number;
  kills: number;
  largestCriticalStrike: number;
  largestKillingSpree: number;
  largestMultiKill: number;
  longestTimeSpentLiving: number;
  magicDamageDealt: number;
  magicDamageDealtToChampions: number;
  magicalDamageTaken: number;
  neutralMinionsKilled: number;
  neutralMinionsKilledEnemyJungle: number;
  neutralMinionsKilledTeamJungle: number;
  objectivePlayerScore: number;
  participantId: number;
  pentaKills: number;
  perk0: number;
  perk0Var1: number;
  perk0Var2: number;
  perk0Var3: number;
  perk1: number;
  perk1Var1: number;
  perk1Var2: number;
  perk1Var3: number;
  perk2: number;
  perk2Var1: number;
  perk2Var2: number;
  perk2Var3: number;
  perk3: number;
  perk3Var1: number;
  perk3Var2: number;
  perk3Var3: number;
  perk4: number;
  perk4Var1: number;
  perk4Var2: number;
  perk4Var3: number;
  perk5: number;
  perk5Var1: number;
  perk5Var2: number;
  perk5Var3: number;
  perkPrimaryStyle: number;
  perkSubStyle: number;
  physicalDamageDealt: number;
  physicalDamageDealtToChampions: number;
  physicalDamageTaken: number;
  playerAugment1: number;
  playerAugment2: number;
  playerAugment3: number;
  playerAugment4: number;
  playerAugment5: number;
  playerAugment6: number;
  playerScore0: number;
  playerScore1: number;
  playerScore2: number;
  playerScore3: number;
  playerScore4: number;
  playerScore5: number;
  playerScore6: number;
  playerScore7: number;
  playerScore8: number;
  playerScore9: number;
  playerSubteamId: number;
  quadraKills: number;
  sightWardsBoughtInGame: number;
  subteamPlacement: number;
  teamEarlySurrendered: boolean;
  timeCCingOthers: number;
  totalDamageDealt: number;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  totalHeal: number;
  totalMinionsKilled: number;
  totalPlayerScore: number;
  totalScoreRank: number;
  totalTimeCrowdControlDealt: number;
  totalUnitsHealed: number;
  tripleKills: number;
  trueDamageDealt: number;
  trueDamageDealtToChampions: number;
  trueDamageTaken: number;
  turretKills: number;
  unrealKills: number;
  visionScore: number;
  visionWardsBoughtInGame: number;
  wardsKilled: number;
  wardsPlaced: number;
  /** 是否获胜 */
  win: boolean;
}

/**
 * 参与者时间线（分时段数据）
 */
export interface ParticipantTimeline {
  creepsPerMinDeltas: Record<string, number>;
  csDiffPerMinDeltas: Record<string, number>;
  damageTakenDiffPerMinDeltas: Record<string, number>;
  damageTakenPerMinDeltas: Record<string, number>;
  goldPerMinDeltas: Record<string, number>;
  /** 分路，如 "TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY" */
  lane: string;
  participantId: number;
  /** 角色，如 "SOLO", "DUO", "NONE" */
  role: string;
  xpDiffPerMinDeltas: Record<string, number>;
  xpPerMinDeltas: Record<string, number>;
}

/**
 * 队伍维度统计
 */
export interface Team {
  bans: Ban[];
  baronKills: number;
  dominionVictoryScore: number;
  dragonKills: number;
  firstBaron: boolean;
  firstBlood: boolean;
  /** 接口原文拼写错误，实际含义为 firstDragon */
  firstDargon: boolean;
  firstInhibitor: boolean;
  firstTower: boolean;
  hordeKills: number;
  inhibitorKills: number;
  riftHeraldKills: number;
  /** 100=蓝方，200=红方 */
  teamId: number;
  towerKills: number;
  vilemawKills: number;
  /** "Win" | "Fail" */
  win: string;
}

/**
 * 禁选信息
 */
export interface Ban {
  championId: number;
  pickTurn: number;
}

/**
 * 用于列表/卡片等场景的对局精简信息
 */
export interface SimpleMatchDetailsTypes {
  /** 对局唯一 ID，可用于跳转详情页 */
  gameId: number;
  /** 所用英雄头像 URL（通常为 CDN 图标） */
  champImgUrl: string;
  /** 本局是否获胜 */
  isWin: boolean;
  /** 击杀数 */
  kills: number;
  /** 死亡数 */
  deaths: number;
  /** 助攻数 */
  assists: number;
  /** 计算后的 KDA 值（保留 2 位小数） */
  kda: number;
  /** 对局持续时长，已格式化为可读字符串，如 "25:38" */
  matchTime: string;
  /** 对局开始时间，已格式化为可读字符串，如 "06-18 20:15" */
  startTime: string;
  /** 游戏模式描述，如 "经典模式" | "ARAM" 等 */
  gameModel: string;
  /** 队列 ID，对应排位、匹配、大乱斗等类型 */
  queueId: number;
  /** 所用英雄 ID */
  champId: number;
  /**
   * 服务器id
   */
  platformId: string;
}

/**
 * 单名召唤师在一局比赛中的完整详细数据
 */
export interface SummonerDetailInfo {
  /** 召唤师昵称 */
  name: string;
  /** 账号 ID */
  accountId: number;
  /** 全局唯一 PUUID */
  puuid: string;
  /** 是否为当前登录用户本人 */
  isCurSum: boolean;
  /** 所属队伍：100=蓝方，200=红方 */
  teamType: number;
  /** 本局英雄等级 */
  champLevel: number;
  /** 英雄头像 CDN 地址 */
  champImgUrl: string;
  /** 召唤师技能 1 ID */
  spell1Id: number;
  /** 召唤师技能 2 ID */
  spell2Id: number;
  /** 六格装备 ID 数组（顺序对应物品栏） */
  items: number[];
  /** 击杀数 */
  kills: number;
  /** 死亡数 */
  deaths: number;
  /** 助攻数 */
  assists: number;
  /** 对英雄造成的物理伤害 */
  physicalDamageDealtToChampions: number;
  /** 对英雄造成的魔法伤害 */
  magicDamageDealtToChampions: number;
  /** 对英雄造成的真实伤害 */
  trueDamageDealtToChampions: number;
  /** 对英雄造成的总伤害 */
  totalDamageDealtToChampions: number;
  /** 承受的总伤害 */
  totalDamageTaken: number;
  /** 野怪击杀数（仅中立生物） */
  neutralMinionsKilled: number;
  /** 小兵击杀数（已弃用，保留兼容） */
  totalMinionsKill: number;
  /** 获得金币 */
  goldEarned: number;
  /** 花费金币 */
  goldSpent: number;
  /** 视野得分 */
  visionScore: number;
  /** 放置守卫数 */
  wardsPlaced: number;
  /** 主系/副系符文 ID 列表，长度通常为 6 */
  runesList: number[];
  /** 小兵 & 野怪补刀总数（推荐优先使用） */
  totalMinionsKilled: number;
  /** 装备、符文等图标 CDN 地址列表，用于前端一次性预加载 */
  iconList: string[];
  /** 后台计算的综合评分，如 "9.2" */
  score: string;
  /** 本局是否获胜 */
  isWin: boolean;
  /** 是否被评为当局 MVP */
  isMvp: boolean;
  /** 前端展示用的键值映射（如伤害条、经济条比例等） */
  showDataDict: ShowDataTypes;
}

/**
 * 一局比赛中所有参与者的聚合数据
 */
export interface ParticipantsInfo {
  /** 蓝方队员列表 */
  teamOne: SummonerDetailInfo[];
  /** 红方队员列表 */
  teamTwo: SummonerDetailInfo[];
  /** 表头信息（前端表格用列头文案） */
  headerInfo: string[];
  /** 队列 ID，如 420=排位单双 */
  queueId: number;
  /** 对局唯一 ID */
  gameId: number;
}

/**
 * 用于在“对局详情”或“战绩对比”等场景中进行横向比较的关键指标集合。
 * 所有字段均为单局数值，可直接用于计算差值、百分比或绘制条形图。
 */
export interface PropertiesToCompareTypes {
  /** 击杀数 */
  kills: number;
  /** 助攻数 */
  assists: number;
  /** 本局摧毁的防御塔数量（含召唤水晶） */
  turretKills: number;
  /** 对英雄造成的总伤害 */
  totalDamageDealtToChampions: number;
  /** 小兵 + 野怪总补刀数 */
  totalMinionsKilled: number;
  /** 本局获得的金币总数 */
  goldEarned: number;
  /** 承受的总伤害（含真实/物理/魔法） */
  totalDamageTaken: number;
  /** 视野得分（插眼、排眼、眼存活时间等综合计算） */
  visionScore: number;
}

/**
 * 召唤师在单个平台下的唯一标识信息
 */
export interface SumPlatInfo {
  /** 全局唯一PUUID，跨平台不变 */
  puuid: string;
  /** 召唤师昵称（当前平台） */
  name: string;
  /** 平台内部加密召唤师ID，用于查询战绩等接口 */
  summonerId: number;
}

/**
 * 对局详情页“可视化条形图”所需的数据项。
 * 所有字段均为单局实际数值，前端按最大值归一化后渲染进度条。
 */
export interface ShowDataTypes {
  /** 对英雄造成的总伤害 */
  totalDamageDealtToChampions: number;
  /** 承受的总伤害 */
  totalDamageTaken: number;
  /** 本局获得的金币总数 */
  goldEarned: number;
  /** 视野得分 */
  visionScore: number;
  /** 小兵 + 野怪总补刀数 */
  totalMinionsKilled: number;
}

/**
 * 对局结束后“战绩汇总”卡片里展示的一条玩家数据
 */
export interface SumDetail {
  /** 玩家游戏内名字 */
  name: string;

  /** 英雄头像 url */
  champImgUrl: string;

  /** 本局英雄等级（1-18） */
  champLevel: number;

  /** K/D/A 字符串，格式如 "12/3/8" */
  kda: string;

  /** 召唤师技能 1 的 id（对应 ddragon 或本地图标） */
  spell1Id: number;

  /** 召唤师技能 2 的 id */
  spell2Id: number;

  /** 本局携带的符文 id 列表（主系+副系，长度通常为 6） */
  runesList: number[];

  /**
   * 出装路线二维数组
   * 外层每件装备，内层 [itemId, count] 或 [itemId, count, isTrinket] 等自定义结构
   */
  listItemData: any[][];

  /** 段位信息文本数组，例如 ["峡谷之巅", "大师 300 LP"] */
  rankData: string[];

  /** 玩家唯一标识，用于后续查询详细战绩或跳转 */
  summonerId: number;
}

/**
 * LCU召唤师信息接口
 * 用于存储召唤师的相关详细信息
 */
export interface LcuSummonerInfo {
  accountId: number; // 账户ID
  displayName: string; // 显示名称
  gameName: string; // 游戏内名称
  internalName: string; // 内部名称
  nameChangeFlag: boolean; // 名称变更标志
  percentCompleteForNextLevel: number; // 下一等级完成百分比
  privacy: string; // 隐私设置
  profileIconId: number; // 档头图标ID
  puuid: string; // 玩家唯一标识符
  rerollPoints: IRerollPoint; // 重积分信息
  summonerId: number; // 召唤师ID
  summonerLevel: number; // 召唤师等级
  unnamed: boolean; // 是否未命名
  xpSinceLastLevel: number; // 自上一等级以来的经验值
  xpUntilNextLevel: number; // 下一等级所需经验值
  tagLine: string; // 标语
}

/**
 * 重积分信息接口
 * 用于存储召唤师的重积分相关数据
 */
interface IRerollPoint {
  currentPoints: number; // 当前积分
  maxRolls: number; // 最大重抽次数
  numberOfRolls: number; // 已使用重抽次数
  pointsCostToRoll: number; // 重抽所需积分成本
  pointsToReroll: number; // 可重抽积分
}

/**
 * 召唤师信息接口
 * 定义了召唤师相关数据的结构
 */
export interface SummonerInfo {
  name: string; // 召唤师名称
  privacy: string; // 隐私设置
  imgUrl: string; // 头像图片URL
  lv: string | number; // 召唤师等级，可以是字符串或数字类型
  xp: number; // 经验值
  puuid: string; // 玩家唯一标识符
  currentId: number;
  tagLine: string | undefined; // 标语，可选的字符串类型
}

/**
 * 召唤师数据接口
 * 用于存储召唤师相关的各类数据信息
 */
export interface SummonerData {
  summonerInfo: SummonerInfo | null; // 召唤师基本信息，可能为null
  rankList: string[] | null; // 排行榜列表，存储字符串数组，可能为null
  champLevel: any[][] | null; // 英雄等级信息，存储二维数组，元素类型为any，可能为null
}



/**
 * 整个段位数据结构的根接口
 */
export interface RankedStats {
  /** 当前赛季已获得的 Split 积分（用于赛段奖励） */
  currentSeasonSplitPoints: number;
  /** 已领取的“段位奖励”皮肤/炫彩 ID 列表 */
  earnedRegaliaRewardIds: string[];
  /** 当前赛季在单双排（SR）中达到过的最高段位（tier）字符串，如 "DIAMOND" */
  highestCurrentSeasonReachedTierSR: string;
  /** 上赛季结算时最高段位的小段，如 "I"、"II" */
  highestPreviousSeasonEndDivision: string;
  /** 上赛季结算时最高段位的大段，如 "GOLD"、"PLATINUM" */
  highestPreviousSeasonEndTier: string;
  /** 所有队列中综合最高的段位信息（可能是灵活或单双排） */
  highestRankedEntry: RankedEntry;
  /** 单双排（Summoner's Rift）队列中最高段位信息 */
  highestRankedEntrySR: RankedEntry;
  /** 上赛季已获得的 Split 积分 */
  previousSeasonSplitPoints: number;
  /** 按队列类型（RANKED_SOLO_5x5、RANKED_FLEX_SR 等）拆分的详细段位数据 */
  queueMap: Record<string, RankedEntry>;
  /** 与 queueMap 相同数据，但以数组形式返回，方便遍历 */
  queues: RankedEntry[];
  /** 段位“徽章”等级，用于客户端展示段位徽章特效 */
  rankedRegaliaLevel: number;
  /** 各个赛季的开启/结束时间戳（键为赛季 ID） */
  seasons: Record<string, Season>;
  /** 各 Split 的完成进度（键为 split ID，值为进度值） */
  splitsProgress: Record<string, number>;
}

/**
 * 单个队列的段位详情
 */
export interface RankedEntry {
  /** 当前赛季已获得的胜场数（用于赛季奖励） */
  currentSeasonWinsForRewards: number;
  /** 当前小段，如 "I"、"II"、"III"、"IV" */
  division: string;
  /** 本赛季曾达到过的最高小段 */
  highestDivision: string;
  /** 本赛季曾达到过的最高大段，如 "MASTER"、"DIAMOND" */
  highestTier: string;
  /** 是否仍处于定位赛阶段（ provisional = true 表示定位赛未完成） */
  isProvisional: boolean;
  /** 当前联盟点数（LP） */
  leaguePoints: number;
  /** 当前赛季负场 */
  losses: number;
  /** 晋级赛进度，如 "WWW" 表示三连胜，"LWL" 表示一负两胜等；非晋级赛为 "" */
  miniSeriesProgress: string;
  /** 上赛季结算小段 */
  previousSeasonEndDivision: string;
  /** 上赛季结算大段 */
  previousSeasonEndTier: string;
  /** 上赛季曾达到过的最高小段 */
  previousSeasonHighestDivision: string;
  /** 上赛季曾达到过的最高大段 */
  previousSeasonHighestTier: string;
  /** 上赛季已获得的胜场数（用于上赛季奖励） */
  previousSeasonWinsForRewards: number;
  /** 定位赛总需场次（通常为 10） */
  provisionalGameThreshold: number;
  /** 剩余定位赛场次 */
  provisionalGamesRemaining: number;
  /** 队列类型标识，如 "RANKED_SOLO_5x5"、"RANKED_FLEX_SR" */
  queueType: string;
  /** 用于“评级”模式（如 Tactics）下的具体评分值；经典模式为 0 */
  ratedRating: number;
  /** 评级模式下的段位等级，如 "HYPER"、"MASTER"；经典模式为 "NONE" */
  ratedTier: string;
  /** 当前大段，如 "IRON"、"BRONZE"、"SILVER"、"GOLD"、"PLATINUM"、"DIAMOND"、"MASTER"、"GRANDMASTER"、"CHALLENGER" */
  tier: string;
  /** 段位衰减/不活跃相关警告信息 */
  warnings: Warnings;
  /** 当前赛季胜场 */
  wins: number;
}

/**
 * 段位衰减与降级警告
 */
export interface Warnings {
  /** 距离段位衰减还剩多少天（高段位 inactive 时会衰减） */
  daysUntilDecay: number;
  /** 降级警告等级：0 无警告，1 轻度，2 严重 */
  demotionWarning: number;
  /** 客户端是否显示衰减警告图标 */
  displayDecayWarning: boolean;
  /** 距离不活跃状态变化还剩的秒数（用于休眠/衰减倒计时） */
  timeUntilInactivityStatusChanges: number;
}

/**
 * 赛季时间轴
 */
export interface Season {
  /** 当前赛季结束时间戳（Unix 毫秒） */
  currentSeasonEnd: number;
  /** 当前赛季 ID */
  currentSeasonId: number;
  /** 下一赛季开始时间戳（Unix 毫秒） */
  nextSeasonStart: number;
}


/**
 * 荣誉系统（Honor）完整信息
 */
export interface HonorInfo {
  /** 当前荣誉检查点（0~3），每升一级需通过 3 个检查点 */
  checkpoint: number;

  /** 当前荣誉等级（0~5） */
  honorLevel: number;

  /** 荣誉奖励兑换进度列表（如钥匙碎片、法球等） */
  redemptions: HonorRedemption[];

  /** true 表示荣誉被锁定，无法获得奖励/升级（因惩罚导致） */
  rewardsLocked: boolean;
}

/**
 * 单个荣誉奖励的兑换进度
 */
export interface HonorRedemption {
  /** 奖励事件类型，如"HONOR_REWARD_KEYS"、"HONOR_ORB_3_1"等 */
  eventType: string;

  /** 距离下次可领取还需的荣誉进度值 */
  remaining: number;

  /** 领取该奖励所需的总荣誉进度值 */
  required: number;
}
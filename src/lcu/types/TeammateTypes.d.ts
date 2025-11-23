/**
 * 各定位（角色）出现次数的映射类型
 */
export interface RoleCountMapTypes {
  /** 刺客型英雄出场次数 */
  assassin: number;
  /** 战士型英雄出场次数 */
  fighter: number;
  /** 法师型英雄出场次数 */
  mage: number;
  /** 射手型英雄出场次数 */
  marksman: number;
  /** 辅助型英雄出场次数 */
  support: number;
  /** 坦克型英雄出场次数 */
  tank: number;
}

/**
 * 近期对局数据分析类型
 */
export interface RencentDataAnalysisTypes {
  /** 使用场次最多的前 3 位英雄及其对应次数 */
  top3Champions: {
    /** 英雄 ID */
    champId: number;
    /** 使用次数 */
    count: number;
  }[];
  /** 期间内使用过的英雄总去重数量 */
  totalChampions: number;
  /** 各定位的出场次数统计 */
  roleCountMap: RoleCountMapTypes;
  /** 用于回溯的其中一局游戏 ID（可用于跳转详情等） */
  oneGameId: number;
}
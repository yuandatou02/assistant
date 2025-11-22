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
  summonerInfo: summonerInfo | null; // 召唤师基本信息，可能为null
  rankList: string[] | null; // 排行榜列表，存储字符串数组，可能为null
  champLevel: any[][] | null; // 英雄等级信息，存储二维数组，元素类型为any，可能为null
}

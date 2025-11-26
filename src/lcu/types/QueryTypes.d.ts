/**
 * 游戏客户端状态
 */
export interface GameClient {
  /** 观战服务器 IP */
  observerServerIp: string;
  /** 观战服务器端口 */
  observerServerPort: number;
  /** 客户端是否正在运行 */
  running: boolean;
  /** 游戏服务器 IP */
  serverIp: string;
  /** 游戏服务器端口 */
  serverPort: number;
  /** 客户端是否可见（是否在前台） */
  visible: boolean;
}

/**
 * 单个玩家的英雄选择信息（结构由后端动态决定，此处用任意对象）
 */
export interface PlayerChampionSelection {
  [key: string]: any;
}

/**
 * 队列（匹配模式）配置
 */
export interface Queue {
  /** 允许预组队人数列表，如 [1,2,5] */
  allowablePremadeSizes: number[];
  /** 是否允许使用周免英雄 */
  areFreeChampionsAllowed: boolean;
  /** 资源修饰符（皮肤、活动等特殊资源） */
  assetMutator: string;
  /** 队列分类，如 "None" */
  category: string;
  /** 参与游戏所需的最少英雄数 */
  championsRequiredToPlay: number;
  /** 简短描述 */
  description: string;
  /** 详细描述 */
  detailedDescription: string;
  /** 游戏模式，如 "CLASSIC" */
  gameMode: string;
  /** 该队列对应的选角/对局规则配置 */
  gameTypeConfig: GameTypeConfig;
  /** 队列 ID，如 430（匹配模式） */
  id: number;
  /** 是否允许人机奖励 */
  isBotHonoringAllowed: boolean;
  /** 是否为自定义 */
  isCustom: boolean;
  /** 是否为排位 */
  isRanked: boolean;
  /** 是否由“组队系统”管理（如战队 Builder） */
  isTeamBuilderManaged: boolean;
  /** 最近一次关闭时间（Unix 毫秒） */
  lastToggledOffTime: number;
  /** 最近一次开启时间（Unix 毫秒） */
  lastToggledOnTime: number;
  /** 地图 ID，如 11 为召唤师峡谷 */
  mapId: number;
  /** 房间最大人数 */
  maximumParticipantListSize: number;
  /** 最低召唤师等级限制 */
  minLevel: number;
  /** 房间最少人数 */
  minimumParticipantListSize: number;
  /** 队列名称，如 "盲选" */
  name: string;
  /** 每队玩家人数，通常为 5 */
  numPlayersPerTeam: number;
  /** 队列可用状态，如 "Available" */
  queueAvailability: string;
  /** 对局奖励配置 */
  queueRewards: QueueRewards;
  /** 是否允许踢出玩家 */
  removalFromGameAllowed: boolean;
  /** 踢出玩家延迟（分钟） */
  removalFromGameDelayMinutes: number;
  /** 短名称，如 "NORMAL" */
  shortName: string;
  /** 是否显示位置选择（位置匹配） */
  showPositionSelector: boolean;
  /** 是否允许观战 */
  spectatorEnabled: boolean;
  /** 队列类型，如 "NORMAL" */
  type: string;
}

/**
 * 选角/对局规则配置
 */
export interface GameTypeConfig {
  /** 是否启用高级学习任务 */
  advancedLearningQuests: boolean;
  /** 是否允许交换英雄 */
  allowTrades: boolean;
  /** 禁用模式，如 "StandardBanStrategy" */
  banMode: string;
  /** 禁用阶段倒计时（秒） */
  banTimerDuration: number;
  /** 是否允许战斗加成（战利品加成） */
  battleBoost: boolean;
  /** 是否共享英雄池（如 ARAM） */
  crossTeamChampionPool: boolean;
  /** 是否为死斗模式 */
  deathMatch: boolean;
  /** 是否不可移除该配置 */
  doNotRemove: boolean;
  /** 是否允许重复英雄（如无限火力） */
  duplicatePick: boolean;
  /** 是否独占英雄（如排位） */
  exclusivePick: boolean;
  /** 规则配置 ID */
  id: number;
  /** 是否启用学习任务 */
  learningQuests: boolean;
  /** 主选角倒计时（秒） */
  mainPickTimerDuration: number;
  /** 最大禁用数 */
  maxAllowableBans: number;
  /** 规则名称 */
  name: string;
  /** 是否为新手合作模式 */
  onboardCoopBeginner: boolean;
  /** 选角模式，如 "StandardPickStrategy" */
  pickMode: string;
  /** 选角结束后的缓冲倒计时（秒） */
  postPickTimerDuration: number;
  /** 是否允许重摇（如 ARAM） */
  reroll: boolean;
  /** 是否启用团队英雄池（如战队 Builder） */
  teamChampionPool: boolean;
}

/**
 * 对局奖励配置
 */
export interface QueueRewards {
  /** 是否启用英雄熟练度点数 */
  isChampionPointsEnabled: boolean;
  /** 是否奖励 IP（蓝色精萃） */
  isIpEnabled: boolean;
  /** 是否奖励经验 */
  isXpEnabled: boolean;
  /** 组队人数对应的 IP 奖励系数列表 */
  partySizeIpRewards: number[];
}

/**
 * 游戏对局数据
 */
export interface GameData {
  /** 对局唯一 ID */
  gameId: number;
  /** 房间名称（自定义房） */
  gameName: string;
  /** 是否为自定义游戏 */
  isCustomGame: boolean;
  /** 房间密码（自定义房） */
  password: string;
  /** 每位玩家的英雄选择信息 */
  playerChampionSelections: PlayerChampionSelection[];
  /** 队列信息 */
  queue: Queue;
  /** 是否允许观战 */
  spectatorsAllowed: boolean;
  /** 队伍 1 玩家列表 */
  teamOne: PlayerChampionSelection[];
  /** 队伍 2 玩家列表 */
  teamTwo: PlayerChampionSelection[];
}

/**
 * 逃跑/ dodge 信息
 */
export interface GameDodge {
  /** 发起 dodge 的玩家 ID 列表 */
  dodgeIds: number[];
  /** 当前 dodge 阶段，如 "None" */
  phase: string;
  /** dodge 状态，如 "Invalid" */
  state: string;
}

/**
 * 地图信息
 */
export interface Map {
  /** 地图资源包（图标、贴图等） */
  assets: Record<string, any>;
  /** 按分类打包的内容（活动、事件等） */
  categorizedContentBundles: Record<string, any>;
  /** 地图描述 */
  description: string;
  /** 游戏模式，如 "CLASSIC" */
  gameMode: string;
  /** 游戏模式完整名称 */
  gameModeName: string;
  /** 游戏模式短名称 */
  gameModeShortName: string;
  /** 游戏变种（活动玩法） */
  gameMutator: string;
  /** 地图 ID，如 11 */
  id: number;
  /** 是否为限时模式地图 */
  isRGM: boolean;
  /** 地图字符串 ID，如 "SR" */
  mapStringId: string;
  /** 地图名称，如 "召唤师峡谷" */
  name: string;
  /** 按位置禁用的召唤师技能列表 */
  perPositionDisallowedSummonerSpells: Record<string, { spells: number[] }>;
  /** 按位置强制的召唤师技能列表 */
  perPositionRequiredSummonerSpells: Record<string, { spells: number[] }>;
  /** 平台 ID */
  platformId: string;
  /** 平台名称 */
  platformName: string;
  /** 地图属性（草丛、野区等） */
  properties: Record<string, any>;
}

/**
 * 整个 LCU 游戏流程数据根接口
 */
export interface GameFlowData {
  /** 游戏客户端状态 */
  gameClient: GameClient;
  /** 对局数据 */
  gameData: GameData;
  /** 逃跑信息 */
  gameDodge: GameDodge;
  /** 地图信息 */
  map: Map;
  /** 当前阶段，如 "None" */
  phase: string;
}

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

/**
 * 召唤师信息列表单项
 * 用于在“房间/结算/战绩”等界面展示一名玩家的核心数据
 */
export interface SummonerInfoList {
    /** 游戏内昵称 */
    name: string;
    /** 召唤师唯一数字 ID（区服维度） */
    summonerId: string;
    /** 全局唯一 ID（跨区服） */
    puuid: string;
    /** 头像图标 URL */
    imgUrl: string;
    /** 当前段位，如“黄金 II” */
    rank: string;
    /** 本局/平均 KDA，格式 “12/3/8” */
    kda?: string;
    /** 是否被标记为“讨厌的人”（拉黑/屏蔽） */
    hater?: boolean;
    /** 讨厌指数 0-100，越高越不想遇到 */
    haterIndex?: number;
}

/**
 * 英雄选择（ChampSelect）会话的完整快照
 * 由 LCU /gameflow 或 /lol-champ-select/v1/session 返回
 */
export interface ChampSelectSession {
    /** 当前阶段可执行的操作列表，通常为空数组，由客户端填充 */
    actions: Array<{
        [key: string]: unknown;
    }>;

    /** 是否允许使用“战斗加成”（Battle Boost，+1 熟练度） */
    allowBattleBoost: boolean;

    /** 是否允许重复选择相同英雄（ARAM / 自定义等） */
    allowDuplicatePicks: boolean;

    /** 是否允许在“限时活动”锁定英雄 */
    allowLockedEvents: boolean;

    /** 是否允许重摇（Reroll）英雄 */
    allowRerolling: boolean;

    /** 是否允许在选用前切换皮肤 */
    allowSkinSelection: boolean;

    /** 是否允许在部分模式下只选择子集英雄（如新手模式） */
    allowSubsetChampionPicks: boolean;

    /** 禁用相关数据 */
    bans: {
        /** 我方禁用列表（ championId 数组，0 表示空位） */
        myTeamBans: number[];
        /** 总禁用数量（通常为 5 或 6） */
        numBans: number;
        /** 敌方禁用列表 */
        theirTeamBans: number[];
    };

    /** 候补席英雄（ARAM / 极限闪击等） */
    benchChampions: Array<{
        /** 英雄 ID */
        championId: number;
        /** 是否为优先推荐（高亮） */
        isPriority: boolean;
    }>;

    /** 是否启用候补席功能 */
    benchEnabled: boolean;

    /** 可加成皮肤的剩余数量（战斗加成） */
    boostableSkinCount: number;

    /** 聊天房间连接信息 */
    chatDetails: {
        /** JWT 相关字段，用于加入 XMPP 聊天室 */
        mucJwtDto: {
            channelClaim: string;
            domain: string;
            jwt: string;
            targetRegion: string;
        };
        /** 聊天室 ID */
        multiUserChatId: string;
        /** 聊天室密码 */
        multiUserChatPassword: string;
    };

    /** 当前轮次计数（内部调试） */
    counter: number;

    /** 对局唯一 ID（0 表示尚未分配） */
    gameId: number;

    /** 是否同时禁用（true=双方同时禁，false=轮流禁） */
    hasSimultaneousBans: boolean;

    /** 是否同时选用（true=双方同时选，false=轮流选） */
    hasSimultaneousPicks: boolean;

    /** 本次选用会话 ID（UUID 字符串） */
    id: string;

    /** 是否为自定义对局 */
    isCustomGame: boolean;

    /** 是否使用旧版选用模式（已废弃） */
    isLegacyChampSelect: true;

    /** 当前玩家是否处于观战视角 */
    isSpectating: boolean;

    /** 本地玩家在房间中的格子索引（0~9） */
    localPlayerCellId: number;

    /** 限时活动锁定索引（活动模式用） */
    lockedEventIndex: number;

    /** 我方队伍 5 人详细信息 */
    myTeam: ChampSelectPlayer[];

    /** 交换选用顺序的申请列表 */
    pickOrderSwaps: SwapRequest[];

    /** 交换位置的申请列表 */
    positionSwaps: SwapRequest[];

    /** 队列 ID（如 430=匹配，440=灵活，450=ARAM） */
    queueId: number;

    /** 剩余重摇次数 */
    rerollsRemaining: number;

    /** 是否显示“退出”按钮（观战/自定义） */
    showQuitButton: boolean;

    /** 是否跳过选用阶段（如斗魂竞技场） */
    skipChampionSelect: boolean;

    /** 敌方队伍 5 人详细信息（观战或回放时填充） */
    theirTeam: ChampSelectPlayer[];

    /** 阶段倒计时 */
    timer: {
        /** 当前阶段剩余时间（毫秒） */
        adjustedTimeLeftInPhase: number;
        /** 服务器当前 Epoch（毫秒） */
        internalNowInEpochMs: number;
        /** 是否无限时间（-1） */
        isInfinite: boolean;
        /** 当前阶段字符串，如 "BAN_PICK" | "FINALIZATION" */
        phase: string;
        /** 当前阶段总时长（毫秒） */
        totalTimeInPhase: number;
    };

    /** 英雄交换申请列表 */
    trades: SwapRequest[];
}

/* ========================= 子类型 ========================= */

/** 单个玩家在选用房间的数据 */
interface ChampSelectPlayer {
    /** 分配位置（TOP/JUNGLE/MIDDLE/BOTTOM/UTILITY/UNSELECTED） */
    assignedPosition: string;
    /** 格子索引（0~4 为我方，5~9 为敌方） */
    cellId: number;
    /** 已选英雄 ID（0 表示未选） */
    championId: number;
    /** 预选/亮英雄 ID */
    championPickIntent: number;
    /** 游戏内昵称（# 前部分） */
    gameName: string;
    /** 内部账号名（通常与 gameName 相同） */
    internalName: string;
    /** 是否人形英雄（皮肤系统用） */
    isHumanoid: boolean;
    /** 名称可见性（HIDDEN / VISIBLE） */
    nameVisibilityType: string;
    /** 混淆后的 puuid（对外展示） */
    obfuscatedPuuid: string;
    /** 混淆后的 summonerId */
    obfuscatedSummonerId: number;
    /** 选用模式（0=正常，1=随机，2=替补） */
    pickMode: number;
    /** 选用轮次（1~10） */
    pickTurn: number;
    /** 玩家备注别名（可为空） */
    playerAlias: string;
    /** 玩家类型（HUMAN / BOT） */
    playerType: string;
    /** 真实 puuid（仅自己可见） */
    puuid: string;
    /** 已选皮肤 ID */
    selectedSkinId: number;
    /** 召唤师技能 1 */
    spell1Id: number;
    /** 召唤师技能 2 */
    spell2Id: number;
    /** 召唤师 ID */
    summonerId: number;
    /** 后缀标签（# 后部分） */
    tagLine: string;
    /** 队伍 ID（0=蓝，1=红） */
    team: number;
    /** 眼皮肤 ID */
    wardSkinId: number;
}

/** 交换申请（顺序/位置/英雄）通用结构 */
interface SwapRequest {
    /** 申请 ID */
    id: number;
    /** 发起玩家的 cellId */
    cellId: number;
    /** 申请状态 */
    state:
        | "AVAILABLE"
        | "BUSY"
        | "CANCELLED"
        | "ACCEPTED"
        | "DECLINED"
        | "INVALID";
}

/**
 * 大厅“我方队伍”格子对象
 * 仅保留进入房间后就能确定的字段，比完整选用阶段对象更轻量
 */
export interface MyTeamObject {
    /** 系统分配的位置，如 TOP / JUNGLE / MIDDLE / BOTTOM / UTILITY / UNSELECTED */
    assignedPosition: string;

    /** 房间格子索引（0~4 为我方，5~9 为敌方） */
    cellId: number;

    /** 已锁定英雄 ID，0 表示尚未选择 */
    championId: number;

    /** 预选/亮英雄 ID，0 表示无预选 */
    championPickIntent: number;

    /** 昵称可见性规则 HIDDEN / VISIBLE */
    nameVisibilityType: string;

    /** 对外混淆的 puuid（观众或第三方只能拿到这个） */
    obfuscatedPuuid: string;

    /** 对外混淆的 summonerId */
    obfuscatedSummonerId: number;

    /** 真实 puuid（仅自己可见） */
    puuid: string;

    /** 已选皮肤 ID，0 表示默认原皮 */
    selectedSkinId: number;

    /** 召唤师技能 1 ID（D 键） */
    spell1Id: number;

    /** 召唤师技能 2 ID（F 键） */
    spell2Id: number;

    /** 召唤师账号唯一 ID */
    summonerId: number;

    /** 队伍编号 0=蓝方，1=红方 */
    team: number;

    /** 眼皮肤 ID，0 表示默认眼 */
    wardSkinId: number;
}

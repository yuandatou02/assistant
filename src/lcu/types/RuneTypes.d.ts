/**
 * 一件装备及其购买数量
 */
export interface Item {
    /** 装备唯一 ID（与游戏内 itemId 对应） */
    id: string;
    /** 购买数量，默认 1 */
    count: number;
}

/**
 * 一个出装“块”，例如“起手装备”、“鞋子”、“后期神装”等
 */
export interface Block {
    /** 块名称，如 "Start"、"Core"、"Boots" */
    type: string;
    /** 本块包含的装备列表 */
    items: Item[];
}

/**
 * 一整套装备方案（对应游戏内“装备构建”）
 */
export interface ItemBuild {
    /** 方案标题，如“AP 爆发流” */
    title: string;
    /** 适用地图 ID 列表，空数组表示全地图通用 */
    associatedMaps: number[];
    /** 适用英雄 ID 列表，空数组表示全英雄通用 */
    associatedChampions: number[];
    /** 装备分组列表 */
    blocks: Block[];
    /** 地图简称，如 "SR"、"HA" */
    map: string;
    /** 模式，如 "CLASSIC"、"ARAM" */
    mode: string;
    /** 推荐物品槽位索引（预留字段，暂未使用） */
    preferredItemSlots: any[];
    /** 排序权重，越大越靠前 */
    sortrank: number;
    /** 起手来源，如 "common"、"pro"、"custom" */
    startedFrom: string;
    /** 构建类型，如 "featured"、"custom" */
    type: string;
}

/**
 * 一套符文（主系+副系+碎片）配置
 */
export interface Rune {
    /** 符文路径别名，如 "electrocute" */
    alias: string;
    /** 符文路径中文名，如 “电刑” */
    name: string;
    /** 位置，如 "Middle"、"Jungle" */
    position: string;
    /** 选用次数统计 */
    pickCount: number;
    /** 胜率百分比字符串，如 "52.3%" */
    winRate?: string;
    /** 主系风格 ID（对应 API 的 styleId） */
    primaryStyleId: number;
    /** 副系风格 ID */
    subStyleId: number;
    /** 已选符文 ID 列表（含碎片） */
    selectedPerkIds: number[];
    /** 综合评分（0-100，可选） */
    score?: number;
    /** 类型标记，如 "featured"、"pro"、"ai"（可选） */
    type?: string;
}

/**
 * 在线数据源返回的一套完整配置（符文+出装+技能）
 */
export interface OnlineRunes {
    /** 列表序号，用于排序 */
    index: number;
    /** 配置唯一 ID（由数据源提供） */
    id: string;
    /** 数据源版本号 */
    version: string;
    /** 官方版本号（与游戏大版本对齐） */
    officialVersion: string;
    /** 选用次数 */
    pickCount: number;
    /** 胜率百分比字符串 */
    winRate: string;
    /** 数据生成时间戳（毫秒） */
    timestamp: number;
    /** 符文路径别名 */
    alias: string;
    /** 方案名称 */
    name: string;
    /** 位置，如 "Top"、"Jungle" */
    position: string;
    /** 推荐技能加点顺序，如 ["Q","E","W","Q","Q","R"] */
    skills: string[];
    /** 召唤师技能（预留，结构与 spells 相同，可选） */
    spells?: any;
    /** 推荐出装列表（多套） */
    itemBuilds: ItemBuild[];
    /** 符文列表（多套，通常 1 套为主） */
    runes: Rune[];
    /** 技能图标 URL 列表，与 skills 顺序对应 */
    skillsImg: string[];
}

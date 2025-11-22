/**
 * 配置设置类型接口
 * 定义了应用程序的各种配置选项
 */
export interface ConfigSettingTypes {
  // 自动选择英雄设置
  autoPickChampion: { championId: string; isAuto: boolean };
  // 自动禁用英雄设置
  autoBanChampion: { championId: string; isAuto: boolean };
  // 是否启用自动一（可能是自动选择第一个英雄）
  autoIsOne: boolean;
  // 自动接受匹配的时间（毫秒）
  autoAccept: number;
  // 主题设置
  theme: string;
  // 游戏是否在窗口中运行
  isGameInWindow: boolean;
  // 游戏是否显示提示
  isGameInTips: boolean;
  // 是否自动屏蔽文字
  autoWriteBlock: boolean;
  // 窗口不透明度（0-1之间）
  inWinOpacity: number;
  // 温馨提示设置
  warmTips: {
    // 自动符文提示
    autoRune: boolean;
    // 排位赛提示
    rankTips: boolean;
    // 团队提示
    teamTips: boolean;
  };
}

/**
 * 定义了一个名为ConfigRank的接口，用于表示排名配置信息
 */
export interface ConfigRank {
  tier: number; // 排名等级，使用数字表示
  lane: string; // 赛道或位置信息，使用字符串表示
  is101: boolean; // 是否为101模式，使用布尔值表示
}

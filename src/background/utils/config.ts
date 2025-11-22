import type { ConfigRank, ConfigSettingTypes } from "../types";

const configSetting: ConfigSettingTypes = {
  autoPickChampion: {
    championId: "157",
    isAuto: false,
  },
  autoBanChampion: {
    championId: "101",
    isAuto: false,
  },
  autoIsOne: true,
  autoAccept: 50,
  theme: "light",
  isGameInWindow: true,
  isGameInTips: false,
  autoWriteBlock: true,
  inWinOpacity: 100,
  warmTips: {
    autoRune: false,
    rankTips: false,
    teamTips: false,
  },
};

const configRank: ConfigRank = {
  tier: 200,
  lane: "mid",
  is101: true,
};

const addConfig = (configName: string, configObj: any) => {
  const localS = JSON.parse(localStorage.getItem(configName) as string);
  if (Object.keys(localS).length === Object.keys(configObj).length) {
    return;
  }

  for (const configKey of Object.keys(configObj)) {
    if (!localS.hasOwnProperty(configKey)) {
      localS[configKey] = configObj[configKey];
      localStorage.setItem(configName, JSON.stringify(localS));
    }
  }
};



/**
 * 初始化配置函数
 * 检查本地存储中是否存在配置设置，如果不存在则创建，如果存在则更新
 */
export const configInit = () => {
  // 检查本地存储中是否已有"configSetting"项
  if (localStorage.getItem("configSetting") === null) {
    // 如果不存在，则将默认配置设置和配置等级保存到本地存储
    localStorage.setItem("configSetting", JSON.stringify(configSetting));
    localStorage.setItem("configRank", JSON.stringify(configRank));
  } else {
    // 如果已存在，则更新配置设置和配置等级
    addConfig("configSetting", configSetting);
    addConfig("configRank", configRank);
  }
};

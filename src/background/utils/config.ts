import { invokeLcu } from "@/lcu";
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

/**
 * 获取客户端路径并更新本地存储
 * @returns {Promise<boolean>} 返回一个布尔值，表示操作是否成功
 */
export const getClientPath = async () => {
  /**
   * 通过LCU API获取客户端安装路径
   * @type {string}
   */
  const clientPath = await invokeLcu<string>(
    "get",
    "/data-store/v1/install-dir"
  );
  
  /**
   * 检查获取的路径是否为空
   * @returns {boolean} 如果路径为null则返回false
   */
  if (clientPath === null) return false;
  
  /**
   * 从本地存储获取已存储的路径
   * @type {string | null}
   */
  const storedPath = localStorage.getItem("clientPath");
  
  /**
   * 将获取的路径转换为TCLS客户端路径
   * @type {string}
   */
  const updatedPath = clientPath.replace("LeagueClient", "TCLS\\client.exe");

  /**
   * 只在存储的路径与新路径不一致时更新本地存储
   * 使用toLowerCase()进行不区分大小写的比较
   */
  if (storedPath?.toLowerCase() !== updatedPath.toLowerCase()) {
    localStorage.setItem("clientPath", updatedPath);
  }
  
  /**
   * 返回操作成功状态
   * @returns {boolean} 始终返回true表示操作成功
   */
  return true;
};

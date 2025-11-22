import { configInit } from "./utils/config";
import { createMainWindow } from "./utils/createWindows";

class Background {
  constructor() {
    // 创建主窗口
    createMainWindow();
    // 初始化配置文件
    configInit();
  }
}

new Background();

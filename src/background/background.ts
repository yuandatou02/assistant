import { invoke } from "@tauri-apps/api/core";
import { configInit } from "./utils/config";
import { createMainWindow } from "./utils/createWindows";
import { listen } from "@tauri-apps/api/event";

class Background {
  constructor() {
    // 创建主窗口
    createMainWindow();
    // 初始化配置文件
    configInit();
    this.initializeListeners();
  }
  // 初始化监听消息
  private initializeListeners() {
    invoke("listen_for_client_start").then(() => {
      listen<string>("client_start", (event) => {
        console.log(event.payload);
      });
    });
  }
}

new Background();

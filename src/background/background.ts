import { invoke } from "@tauri-apps/api/core";
import { configInit, getClientPath } from "./utils/config";
import { createMainWindow } from "./utils/createWindows";
import { listen } from "@tauri-apps/api/event";
import { GameFlow } from "./gameFlow";

class Background {
  private gameFlow: GameFlow;

  constructor() {
    // 创建主窗口
    createMainWindow();
    // 初始化配置文件
    configInit();
    this.gameFlow = new GameFlow();
    this.initializeListeners();
  }
  // 初始化监听消息
  private initializeListeners() {
    invoke("listen_for_client_start").then(() => {
      listen<string>("client_status", (event) =>
        this.handleClientStatus(event.payload)
      );
    });
  }

  private initAssistant() {
    const TIME_LIMIT = 30000;
    let elapsedTime = 0;
    const intervalTime = 3000;
    // invoke("init_keyboard");
    const lcuSuccess = setInterval(async () => {
      const isGetPath = await getClientPath();
      if (isGetPath) {
        clearInterval(lcuSuccess);
        setTimeout(() => {
          this.gameFlow.sendStartEvent();
          invoke("start_listener");
        }, 500);
      }
      elapsedTime += intervalTime;
      if (elapsedTime >= TIME_LIMIT) {
        clearInterval(lcuSuccess);
        console.log("超时，客户端未启动");
      }
    }, intervalTime);
  }

  private handleClientStatus(status: string) {
    switch (status) {
      case "ClientStarted":
        this.initAssistant();
        break;
    }
  }
}

new Background();

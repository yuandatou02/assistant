import { createMainWindows } from "./utils/createWindows";
import { configInit, getClientPath } from "@/background/utils/config.ts";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { GameFlow } from "@/background/gameFlow.ts";

class Background {
  private gameFlow!: GameFlow;
  init = async () => {
    await createMainWindows();
    configInit();
    this.initializeListeners();
    this.gameFlow = new GameFlow();
  };

  private initializeListeners = () => {
    invoke("listen_for_client_start").then(async () => {
      await listen<string>("client_status", (event) => {
        this.handleClientStatus(event.payload);
      });
    });
  };

  private handleClientStatus = async (status: string) => {
    switch (status) {
      case "ClientStarted":
        await this.initFrank();
        break;
    }
  };

  private initFrank = async () => {
    const TIME_LIMIT = 30000;
    let elapsedTime = 0;
    const intervalTime = 3000;

    await invoke("init_keyboard");
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
        console.error("超时，客户端未启动");
      }
    }, intervalTime);
  };
}

await new Background().init();

import { createMainWindows } from "./utils/createWindows";
import { configInit } from "@/background/utils/config.ts";
import { invoke } from "@tauri-apps/api/core";

class Background {
  init = async () => {
    await createMainWindows();
    configInit();
    this.initializeListeners();
  };

  private initializeListeners = () => {
    invoke("listen_for_client_start").then(() => {
      // todo: 监听客户端启动
    });
  };
}

await new Background().init();

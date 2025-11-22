import { window } from "@tauri-apps/api";
import { emitTo } from "@tauri-apps/api/event";

export class GameFlow {
  // 发送给主窗口游戏启动事件
  public sendStartEvent = async () => {
    window.Window.getByLabel("mainWindow").then((win) => {
      if (win !== null) {
        emitTo("mainWindow", "initHome");
      }
    });
  };
}

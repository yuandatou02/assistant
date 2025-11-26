import { invokeLcu } from "@/lcu";
import type { GameFlowData } from "@/lcu/types/QueryTypes";
import { window } from "@tauri-apps/api";
import { emitTo } from "@tauri-apps/api/event";

export class GameFlow {
  public mapId: number = 11;

  public sendMsgToMain = (messageId: string, content: any = "") => {
    window.Window.getByLabel("mainWindow").then((win) => {
      if (win !== null) {
        emitTo("mainWindow", "clientStatus", { messageId, content });
      }
    });
  };

  // 发送给主窗口游戏启动事件
  public sendStartEvent = async () => {
    window.Window.getByLabel("mainWindow").then((win) => {
      if (win !== null) {
        emitTo("mainWindow", "initHome");
      }
    });
  };
  // 自动接受对局
  public autoAcceptGmae = async () => {
    const isAutoAccept = JSON.parse(
      localStorage.getItem("configSetting") as string
    ).autoAccept;
    if (isAutoAccept < 50) return;
    if (isAutoAccept === 50) {
      invokeLcu("post", "/lol-matchmaking/v1/ready-check/accept");
      return;
    }
    const setTime = (isAutoAccept - 50) * 200;
    setTimeout(async () => {
      invokeLcu("get", "/lol-matchmaking/v1/ready-check").then((res: any) => {
        if (res?.playerResponse !== "Declined") {
          invokeLcu("post", "/lol-matchmaking/v1/ready-check/accept");
        }
        return;
      });
    }, setTime);
  };

  // 写入游戏信息
  public writeGameInfo = async () => {
    const res = await invokeLcu<GameFlowData>(
      "get",
      "/lol-gameflow/v1/session"
    );
    if (res === null) return;
    // 获取对局ID 和地图ID
    if (res.gameData !== undefined) {
      this.mapId = res.gameData.queue.mapId;
      localStorage.setItem(
        "gameInfo",
        String(
          JSON.stringify({
            queueId: res.gameData.queue.id,
            mapId: res.gameData.queue.mapId,
          })
        )
      );
    }
  };
}

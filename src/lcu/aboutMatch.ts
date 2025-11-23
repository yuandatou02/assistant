import { invoke } from "@tauri-apps/api/core";
import type { Game, MatchHistoryResp } from "./types/MatchLcuTypes";

export const queryMatchHistory = async (
  puuid: string,
  begIndex: number,
  endIndex: number
): Promise<Game[]> => {
  try {
    let allGame: Game[] = [];
    const MAX_REQUEST_SIZE = 50;
    // 如果请求范围超过最大限制，拆分请求
    if (endIndex - begIndex > MAX_REQUEST_SIZE) {
      allGame = await splitRequests(puuid, begIndex, endIndex);
    } else {
      allGame = await fetchMatchHistory(puuid, begIndex, endIndex);
    }
    // 如果没有获取到游戏数据，返回空数组
    if (!allGame || allGame.length === 0) {
      return [];
    }
    // 去重操作
    const uniqueGames = Array.from(
      new Map(allGame.map((game) => [game.gameId, game])).values()
    );
    // 按游戏创建时间降序排序
    return uniqueGames.sort((a, b) => b.gameCreation - a.gameCreation);
  } catch (error) {
    console.error("Error fetching match history:", error);
    return []; // 或者根据需要返回其他值
  }
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 处理多个请求
const splitRequests = async (
  puuid: string,
  begIndex: number,
  endIndex: number
): Promise<Game[]> => {
  const step = 50;
  let allGame: Game[] = [];
  let currentBegIndex = begIndex;

  // 循环拆分请求
  while (currentBegIndex < endIndex) {
    const currentEndIndex = Math.min(currentBegIndex + step - 1, endIndex);
    const games = await fetchMatchHistory(
      puuid,
      currentBegIndex,
      currentEndIndex
    );
    if (games.length > 0) {
      allGame = allGame.concat(games);
    }
    currentBegIndex = currentEndIndex + 1;
    await delay(200);
  }
  return allGame;
};

// 处理单个请求
const fetchMatchHistory = async (
  puuid: string,
  begIndex: number,
  endIndex: number
): Promise<Game[]> => {
  const uri = `/lol-match-history/v1/products/lol/${puuid}/matches?begIndex=${begIndex}&endIndex=${endIndex}`;
  const matchList = await invoke<MatchHistoryResp>("get_match_list", { uri });
  return matchList.games.games;
};

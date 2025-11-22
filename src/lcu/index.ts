import { invoke } from "@tauri-apps/api/core";

/**
 * 调用 Tauri 后端的 `invoke_lcu` 命令，以与英雄联盟客户端 (LCU) 进行交互。
 * @template T - 期望从 LCU API 获取的响应数据的类型。
 * @param {string} method - HTTP 请求方法 (例如: 'GET', 'POST', 'PUT', 'DELETE')。
 * @param {string} uri - LCU API 的端点路径 (例如: '/lol-summoner/v1/current-summoner')。
 * @param {string} [body=''] - (可选) 请求体，通常用于 'POST' 或 'PUT' 请求。默认为空字符串。
 * @returns {Promise<T | null>} 一个 Promise，成功时 resolve 为 LCU API 返回的数据 (类型为 T)，或在调用失败时 resolve 为 null。
 */
export const invokeLcu = <T>(method: string, uri: string, body: string = ''): Promise<T | null> => {
  return invoke<T | null>("invoke_lcu", { method, uri, body })
    .catch(() => null);
}

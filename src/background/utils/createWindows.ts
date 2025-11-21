import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

/**
 * 创建主窗口的函数
 * 该函数用于初始化并显示应用程序的主窗口
 * @returns {void} 无返回值
 */
export const createMainWindow = () => {
  // 创建一个新的Webview窗口实例
  const webview = new WebviewWindow("mainWindow", {
    // 设置窗口标题为"Assistant"
    title: "Assistant",
    // 指定窗口加载的HTML文件路径
    url: "src/main/index.html",
    // 设置窗口宽度为320像素
    width: 320,
    // 设置窗口高度为720像素
    height: 720,
    // 初始状态下窗口不可见
    visible: false,
    // 禁止调整窗口大小
    resizable: false,
    // 移除窗口装饰（如边框、标题栏等）
    decorations: false,
    // 窗口居中显示
    center: true,
    // 启用窗口透明度
    transparent: true,
  });
  // 监听窗口创建完成事件
  webview.once("tauri://webview-created", async function () {
    // 窗口创建完成后显示窗口
    webview.show();
  });
};

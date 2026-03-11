use log::error;
use rdev::{Event, EventType, Key, listen};
use tauri::{AppHandle, Manager};

/// 初始化全局键盘监听器
///
/// 启动一个全局键盘监听循环，捕获所有键盘事件并分发到回调函数处理。
/// 使用 Shift + Tab 组合键来控制窗口的显示和隐藏。
///
/// # Parameters
/// * `app` - Tauri 应用句柄，用于访问和管理应用窗口
///
/// # Returns
/// 无返回值
///
/// # Errors
/// 如果键盘监听启动失败，会打印错误信息
pub fn init_global_keyboard(app: AppHandle) {
    let mut shift_state: bool = false;

    // 捕获全局键盘事件
    if let Err(error) = listen(move |event: Event| callback(event, &mut shift_state, &app)) {
        error!("Error: {:?}", error);
    }
}

/// 键盘事件回调处理函数
///
/// 根据键盘事件类型（按下/释放）和具体按键进行相应的处理。
/// 主要处理 Shift 键的状态追踪和 Shift + Tab 组合键的窗口控制功能。
///
/// # Parameters
/// * `event` - 键盘事件对象，包含事件类型和按键信息
/// * `shift_state` - Shift 键状态的可变引用，true 表示 Shift 被按下
/// * `app` - Tauri 应用句柄，用于窗口操作
fn callback(event: Event, shift_state: &mut bool, app: &AppHandle) {
    match event.event_type {
        // 处理按键按下事件
        EventType::KeyPress(key_event) => match key_event {
            Key::ShiftLeft | Key::ShiftRight => handle_shift_press(shift_state),
            Key::Tab => handle_show_hide_window(shift_state, app, "recentMatchWindow"),
            _ => (),
        },

        // 处理按键释放事件
        EventType::KeyRelease(key_event) => {
            if (key_event == Key::ShiftLeft || key_event == Key::ShiftRight) && *shift_state {
                *shift_state = false;
            }
        }
        _ => (),
    }
}

/// 处理 Shift 键按下事件
///
/// 当检测到 Shift 键按下时，更新状态标志位。
///
/// # Parameters
/// * `shift_state` - Shift 键状态的可变引用，设置为 true 表示 Shift 被按下
fn handle_shift_press(shift_state: &mut bool) {
    if !*shift_state {
        *shift_state = true;
    }
}

/// 处理 Shift + Tab 组合键以显示/隐藏窗口
///
/// 当 Shift 键被按下的同时按下 Tab 键时，切换指定窗口的可见状态。
/// 如果窗口当前可见则隐藏，如果隐藏则显示。
///
/// # Parameters
/// * `shift_state` - Shift 键状态的引用，用于判断是否按下
/// * `app` - Tauri 应用句柄，用于获取和操作窗口
/// * `win_name` - 要控制的窗口名称标识符
fn handle_show_hide_window(shift_state: &mut bool, app: &AppHandle, win_name: &str) {
    if *shift_state {
        if let Some(win) = app.get_webview_window(win_name) {
            // 检查窗口当前是否可见
            match win.is_visible() {
                Ok(true) => {
                    win.hide().expect("hide window failed");
                }
                Ok(false) => {
                    win.show().expect("show window failed");
                }
                Err(e) => {
                    error!("Error checking window visibility: {}", e);
                }
            }
        }
    }
}

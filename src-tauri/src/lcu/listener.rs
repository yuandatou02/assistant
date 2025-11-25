use futures_util::StreamExt;
use log::info;
use tauri::{AppHandle, Emitter, EventTarget};

use crate::shaco::{model::ws::LcuSubscriptionType, ws};

pub async fn listen_client(app: AppHandle) {
    let mut client = ws::LcuWebSocketClient::connect().await.unwrap();

    client
        .subscribe(LcuSubscriptionType::JsonApiEvent(
            "/lol-gameflow/v1/gameflow-phase".to_string(),
        ))
        .await
        .unwrap();

    while let Some(event) = client.next().await {
        info!("客户端当前事件: {:?}", event);
        app.emit_to(
            EventTarget::labeled("background"),
            "client_status",
            event.data,
        )
        .unwrap();
    }
}

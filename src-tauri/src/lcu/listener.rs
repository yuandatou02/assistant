use tauri::AppHandle;

use crate::shaco::{model::ws::LcuSubscriptionType, ws};

pub async fn listen_client(app: AppHandle) {
    let mut client = ws::LcuWebSocketClient::connect().await.unwrap();

    client
        .subscribe(LcuSubscriptionType::JsonApiEvent(
            "/lol-gameflow/v1/gameflow-phase".to_string(),
        ))
        .await
        .unwrap();

    while let Some(event) =  {
        
    }
}

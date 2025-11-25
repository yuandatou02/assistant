use std::{
    pin::Pin,
    task::{Context, Poll},
};

use futures_util::{SinkExt, Stream, StreamExt};
use tauri::http::HeaderValue;
use tokio::net::TcpStream;
use tokio_tungstenite::{
    Connector, MaybeTlsStream, WebSocketStream,
    tungstenite::{self, Message, client::IntoClientRequest},
};

use crate::shaco::{
    error::LcuWebSocketError,
    model::ws::{LcuEvent, LcuSubscriptionType},
    utils::process_info,
};

#[derive(Debug)]
pub struct LcuWebSocketClient(WebSocketStream<MaybeTlsStream<TcpStream>>);

impl LcuWebSocketClient {
    pub async fn connect() -> Result<Self, LcuWebSocketError> {
        let (auth_token, port) = process_info::get_client_info()
            .map_err(|e| LcuWebSocketError::LcuNotAvailable(e.to_string()))?;

        let cert = native_tls::Certificate::from_pem(include_bytes!("./riotgames.pem")).unwrap();
        let tls = native_tls::TlsConnector::builder()
            .add_root_certificate(cert)
            .build()
            .unwrap();
        let connector = Connector::NativeTls(tls);
        let mut url = format!("wss:127.0.0.1:{}", port)
            .into_client_request()
            .map_err(|_| LcuWebSocketError::AuthError)?;
        url.headers_mut().insert(
            "Authorization",
            HeaderValue::from_str(format!("Basic {}", auth_token).as_str())
                .map_err(|_| LcuWebSocketError::AuthError)?,
        );

        let (ws_stream, _response) =
            tokio_tungstenite::connect_async_tls_with_config(url, None, false, Some(connector))
                .await
                .map_err(|e| LcuWebSocketError::Disconnected(e.to_string()))?;

        Ok(Self(ws_stream))
    }

    pub async fn subscribe(
        &mut self,
        subscription: LcuSubscriptionType,
    ) -> Result<(), LcuWebSocketError> {
        self.0
            .send(Message::text(format!("[5,\"{}\"]", subscription)))
            .await
            .map_err(|e| match e {
                tungstenite::Error::ConnectionClosed | tungstenite::Error::AlreadyClosed => {
                    LcuWebSocketError::Disconnected(e.to_string())
                }
                _ => LcuWebSocketError::SendError,
            })
    }
}

impl Stream for LcuWebSocketClient {
    type Item = LcuEvent;

    fn poll_next(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Option<Self::Item>> {
        loop {
            return match self.0.poll_next_unpin(cx) {
                Poll::Pending => Poll::Pending,
                Poll::Ready(Some(Ok(Message::Text(text)))) => {
                    let Ok(event) = serde_json::from_str::<LcuEvent>(&text) else {
                        continue;
                    };
                    Poll::Ready(Some(event))
                }
                Poll::Ready(Some(Ok(Message::Close(_))) | Some(Err(_)) | None) => Poll::Ready(None),
                _ => continue,
            };
        }
    }
}

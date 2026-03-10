use crate::lcu::utils::request::build_request_client;
use log::error;

pub struct RESTClient {
    port: String,
    client: reqwest::Client,
}

impl RESTClient {
    pub fn new(auth_token: String, port: String) -> anyhow::Result<Self> {
        let client = build_request_client(Some(auth_token));
        Ok(Self { port, client })
    }

    pub async fn get(&self, endpoint: &str) -> anyhow::Result<serde_json::Value> {
        self.client
            .get(format!("http://127.0.0.1:{}{}", self.port, endpoint))
            .send()
            .await?
            .error_for_status()?
            .json()
            .await
            .or_else(|e| {
                error!(
                    "get请求失败!请求地址{},失败原因: {}",
                    endpoint,
                    e.to_string()
                );
                Ok(serde_json::Value::Null)
            })
    }
}

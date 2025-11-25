use std::fmt::{self, Display};

use serde::{Deserialize, Deserializer, de};
use serde_json::Value;

#[derive(Debug, Clone)]
pub enum LcuSubscriptionType {
    AllJsonApiEvents,
    AllLcdsEvents,
    JsonApiEvent(String),
    LcdsEvent(String),
}

impl Display for LcuSubscriptionType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            LcuSubscriptionType::AllJsonApiEvents => f.write_str("OnJsonApiEvent"),
            LcuSubscriptionType::AllLcdsEvents => f.write_str("OnJsonApiEvent"),
            LcuSubscriptionType::JsonApiEvent(s) => f.write_str(&format!(
                "OnJsonApiEvent_{}",
                s.trim_start_matches('/').replace('/', "_")
            )),
            LcuSubscriptionType::LcdsEvent(s) => f.write_str(&format!(
                "OnLcdsEvent_{}",
                s.trim_start_matches('/').replace('/', "_")
            )),
        }
    }
}

/// Custom deserializer to differentiate between the different subscription types
impl<'de> Deserialize<'de> for LcuSubscriptionType {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;

        if s.starts_with("OnJsonApiEvent") {
            if s.len() > 14 {
                Ok(LcuSubscriptionType::JsonApiEvent(s[15..].to_string()))
            } else {
                Ok(LcuSubscriptionType::AllJsonApiEvents)
            }
        } else if s.starts_with("OnLcdsApiEvent") {
            if s.len() > 14 {
                Ok(LcuSubscriptionType::LcdsEvent(s[15..].to_string()))
            } else {
                Ok(LcuSubscriptionType::AllLcdsEvents)
            }
        } else {
            Err(de::Error::custom(format!(
                "Unknown SubscriptionType: {}",
                s
            )))
        }
    }
}

#[derive(Debug, Clone)]
pub struct LcuEvent {
    pub subscription_type: LcuSubscriptionType,
    pub data: Value,
    pub event_type: String,
}

impl<'de> Deserialize<'de> for LcuEvent {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        #[derive(Deserialize)]
        struct DeEvent {
            _opcode: i64,
            subscription_type: LcuSubscriptionType,
            data: Data,
        }

        #[derive(Deserialize)]
        #[serde(rename_all = "camelCase")]
        struct Data {
            data: Value,
            event_type: String,
        }
        let de_event = DeEvent::deserialize(deserializer)?;
        Ok(Self {
            subscription_type: de_event.subscription_type,
            data: de_event.data.data,
            event_type: de_event.data.event_type,
        })
    }
}

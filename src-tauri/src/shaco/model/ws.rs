use std::fmt::Display;

#[derive(Debug, Clone)]
pub enum LcuSubscriptionType {
    AllJsonApiEvents,
    AllLcdsEvents,
    JsonApiEvent(String),
    LcdsEvent(String),
}

impl Display for LcuSubscriptionType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            LcuSubscriptionType::AllJsonApiEvents => f.write_str("OnJsonApiEvent"),
            LcuSubscriptionType::AllLcdsEvents => f.write_str("OnLcdsEvent"),
            LcuSubscriptionType::JsonApiEvent(event) => f.write_str(&format!(
                "OnJsonApiEvent:{}",
                event.trim_start_matches('/').replace('/', "_")
            )),
            LcuSubscriptionType::LcdsEvent(s) => f.write_str(&format!(
                "OnLcdsEvent_{}",
                s.trim_start_matches('/').replace('/', "_")
            )),
        }
    }
}

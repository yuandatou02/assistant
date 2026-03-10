use base64::{Engine, engine::general_purpose};
use sysinfo::System;

use crate::lcu::error::ProcessInfoError;

const TARGET_PROCESS: &str = "LeagueClientUx.exe";

pub struct AuthResponse {
    pub token: String,
    pub port: String,
    pub region: String,
}

pub(crate) fn get_auth_info() -> Result<AuthResponse, ProcessInfoError> {
    let mut sys = System::new_all();
    sys.refresh_processes(sysinfo::ProcessesToUpdate::All, true);

    let args = sys
        .processes()
        .values()
        .find(|p| p.name() == TARGET_PROCESS)
        .map(|p| p.cmd())
        .ok_or(ProcessInfoError::ProcessNotAvailable)?;

    let port = args
        .iter()
        .find(|arg| arg.to_string_lossy().starts_with("--app-port="))
        .map(|arg| {
            arg.to_string_lossy()
                .strip_prefix("--app-port=")
                .unwrap()
                .to_string()
        })
        .ok_or(ProcessInfoError::PortNotFound)?;
    let auth_token = args
        .iter()
        .find(|arg| arg.to_string_lossy().starts_with("--remoting-auth-token="))
        .map(|arg| {
            arg.to_string_lossy()
                .strip_prefix("--remoting-auth-token=")
                .unwrap()
                .to_string()
        })
        .ok_or(ProcessInfoError::AuthTokenNotFound)?;
    let rso_platform_id = args
        .iter()
        .find(|arg| arg.to_string_lossy().starts_with("--rso_platform_id="))
        .map(|arg| {
            arg.to_string_lossy()
                .strip_prefix("--rso_platform_id=")
                .unwrap()
                .to_string()
        })
        .ok_or(ProcessInfoError::PlatformIdNotFound)?;
    Ok(AuthResponse {
        token: general_purpose::STANDARD.encode(format!("riot:{}", auth_token)),
        port,
        region: rso_platform_id,
    })
}

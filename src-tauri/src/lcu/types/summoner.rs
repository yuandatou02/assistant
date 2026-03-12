use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LcuSummonerInfo {
    #[serde(rename = "accountId")]
    pub account_id: i64,

    #[serde(rename = "displayName")]
    pub display_name: String,

    #[serde(rename = "gameName")]
    pub game_name: String,

    #[serde(rename = "internalName")]
    pub internal_name: String,

    #[serde(rename = "nameChangeFlag")]
    pub name_change_flag: bool,

    #[serde(rename = "percentCompleteForNextLevel")]
    pub percent_complete_for_next_level: f64,

    pub privacy: String,

    #[serde(rename = "profileIconId")]
    pub profile_icon_id: i64,

    pub puuid: String,

    #[serde(rename = "rerollPoints")]
    pub reroll_points: RerollPoint,

    #[serde(rename = "summonerId")]
    pub summoner_id: i64,

    #[serde(rename = "summonerLevel")]
    pub summoner_level: i64,

    pub unnamed: bool,

    #[serde(rename = "xpSinceLastLevel")]
    pub xp_since_last_level: i64,

    #[serde(rename = "xpUntilNextLevel")]
    pub xp_until_next_level: i64,

    pub success: Option<bool>,

    #[serde(rename = "tagLine")]
    pub tag_line: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RerollPoint {
    #[serde(rename = "currentPoints")]
    pub current_points: i64,

    #[serde(rename = "maxRolls")]
    pub max_rolls: i64,

    #[serde(rename = "numberOfRolls")]
    pub number_of_rolls: i64,

    #[serde(rename = "pointsCostToRoll")]
    pub points_cost_to_roll: i64,

    #[serde(rename = "pointsToReroll")]
    pub points_to_reroll: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SummonerInfo {
    pub name: String,

    pub privacy: String,

    #[serde(rename = "imgUrl")]
    pub img_url: String,

    pub lv: String,

    pub xp: i32,

    pub puuid: String,

    #[serde(rename = "currentId")]
    pub current_id: i64,

    pub tag_line: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Profile {
    pub checkpoint: i32,
    #[serde(rename = "honorLevel")]
    pub honor_level: i32,
    #[serde(rename = "rewardsLocked")]
    pub rewards_locked: bool,
}

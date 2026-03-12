use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RankedStats {
    #[serde(rename = "currentSeasonSplitPoints")]
    pub current_season_split_points: i64,

    #[serde(rename = "earnedRegaliaRewardIds")]
    pub earned_regalia_reward_ids: Vec<String>,

    #[serde(rename = "highestCurrentSeasonReachedTierSR")]
    pub highest_current_season_reached_tier_sr: String,

    #[serde(rename = "highestPreviousSeasonEndDivision")]
    pub highest_previous_season_end_division: String,

    #[serde(rename = "highestPreviousSeasonEndTier")]
    pub highest_previous_season_end_tier: String,

    #[serde(rename = "highestRankedEntry")]
    pub highest_ranked_entry: RankedEntry,

    #[serde(rename = "highestRankedEntrySR")]
    pub highest_ranked_entry_sr: RankedEntry,

    #[serde(rename = "previousSeasonSplitPoints")]
    pub previous_season_split_points: i64,

    #[serde(rename = "queueMap")]
    pub queue_map: std::collections::HashMap<String, RankedEntry>,

    pub queues: Vec<RankedEntry>,

    #[serde(rename = "rankedRegaliaLevel")]
    pub ranked_regalia_level: i64,

    pub seasons: std::collections::HashMap<String, SeasonInfo>,

    #[serde(rename = "splitsProgress")]
    pub splits_progress: serde_json::Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RankedEntry {
    #[serde(rename = "climbingIndicatorActive")]
    pub climbing_indicator_active: bool,

    #[serde(rename = "currentSeasonWinsForRewards")]
    pub current_season_wins_for_rewards: i64,

    pub division: String,

    #[serde(rename = "highestDivision")]
    pub highest_division: String,

    #[serde(rename = "highestTier")]
    pub highest_tier: String,

    #[serde(rename = "isProvisional")]
    pub is_provisional: bool,

    #[serde(rename = "leaguePoints")]
    pub league_points: i64,

    pub losses: i64,

    #[serde(rename = "miniSeriesProgress")]
    pub mini_series_progress: String,

    #[serde(rename = "previousSeasonEndDivision")]
    pub previous_season_end_division: String,

    #[serde(rename = "previousSeasonEndTier")]
    pub previous_season_end_tier: String,

    #[serde(rename = "previousSeasonHighestDivision")]
    pub previous_season_highest_division: String,

    #[serde(rename = "previousSeasonHighestTier")]
    pub previous_season_highest_tier: String,

    #[serde(rename = "previousSeasonWinsForRewards")]
    pub previous_season_wins_for_rewards: i64,

    #[serde(rename = "provisionalGameThreshold")]
    pub provisional_game_threshold: i64,

    #[serde(rename = "provisionalGamesRemaining")]
    pub provisional_games_remaining: i64,

    #[serde(rename = "queueType")]
    pub queue_type: String,

    #[serde(rename = "ratedRating")]
    pub rated_rating: i64,

    #[serde(rename = "ratedTier")]
    pub rated_tier: String,

    pub tier: String,

    pub warnings: Option<serde_json::Value>,

    pub wins: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SeasonInfo {
    #[serde(rename = "currentSeasonEnd")]
    pub current_season_end: i64,

    #[serde(rename = "currentSeasonId")]
    pub current_season_id: i64,

    #[serde(rename = "nextSeasonStart")]
    pub next_season_start: i64,
}

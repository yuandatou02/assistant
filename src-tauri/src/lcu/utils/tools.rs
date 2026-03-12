use crate::lcu::types::rank::RankedEntry;

pub fn generate_rank_string(rank: Option<&RankedEntry>) -> String {
    match rank {
        None => "未定级".to_string(),
        Some(value) => {
            if value.tier == "" {
                "未定级".to_string()
            } else {
                format!(
                    "{} {} {}",
                    english_to_chinese(&value.tier),
                    deal_divsion(&value.division),
                    value.league_points
                )
            }
        }
    }
}

// 英文段位昵称转中文
pub fn english_to_chinese(tier: &str) -> &str {
    match tier {
        "CHALLENGER" => "王者",
        "GRANDMASTER" => "宗师",
        "MASTER" => "大师",
        "DIAMOND" => "钻石",
        "EMERALD" => "翡翠",
        "PLATINUM" => "铂金",
        "GOLD" => "黄金",
        "SILVER" => "白银",
        "BRONZE" => "青铜",
        "IRON" => "黑铁",
        _ => "未定级",
    }
}

// 处理段位数据
pub fn deal_divsion(divsion: &str) -> &str {
    if divsion == "NA" { "" } else { divsion }
}

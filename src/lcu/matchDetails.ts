import { champDict } from "@/resources/champList";
import { invokeLcu } from ".";
import type {
  Game,
  Participant,
  ParticipantIdentity,
  ParticipantsInfo,
  ParticipantStats,
  PropertiesToCompareTypes,
  ShowDataTypes,
  SummonerDetailInfo,
  SumPlatInfo,
} from "./types/MatchLcuTypes";
import { queryGameType } from "./utils";

export default class MatchDetails {
  private team100Kills = 0;
  private team200Kills = 0;
  private team100GoldEarned = 0;
  private team200GoldEarned = 0;
  private markeUsed = {
    kills: true,
    assists: true,
    turretKills: true,
    totalDamageDealtToChampions: true,
    totalMinionsKilled: true,
    goldEarned: true,
    totalDamageTaken: true,
    visionScore: true,
  };

  public queryGameDetail = async (gameId: number, summonerId: number) => {
    this.init();
    const response = await invokeLcu<Game>(
      "get",
      `/lol-match-history/v1/games/${gameId}`
    );
    if (response === null || response.queueId === undefined) {
      return null;
    }
    return this.getParticipantsDetails(response, summonerId, gameId);
  };

  private getParticipantsDetails(
    response: Game,
    summonerId: number,
    gameId: number
  ) {
    if (response.participants.length !== 10) {
      return null;
    }
    const isTeamOne = response.participantIdentities
      .slice(0, 5)
      .find((value) => value.player.summonerId === summonerId)
      ? true
      : false;
    const titleList = this.getDetailsTitle(
      response.gameCreation,
      response.gameDuration,
      response.queueId
    );
    const maxMatchData = this.getMaxField(response.participants);
    const participantsInfo: ParticipantsInfo = {
      teamOne: [],
      teamTwo: [],
      headerInfo: [],
      queueId: response.queueId,
      gameId: gameId,
    };
    const nameList = this.getparticipantIdAndName(
      response.participantIdentities
    );
    for (let i = 0; i < 5; i++) {
      this.team100Kills += isTeamOne
        ? response.participants[i].stats.kills
        : response.participants[i + 5].stats.kills;
      this.team200Kills += isTeamOne
        ? response.participants[i + 5].stats.kills
        : response.participants[i].stats.kills;
      this.team100GoldEarned += isTeamOne
        ? response.participants[i].stats.goldEarned
        : response.participants[i + 5].stats.goldEarned;
      this.team200GoldEarned += isTeamOne
        ? response.participants[i + 5].stats.goldEarned
        : response.participants[i].stats.goldEarned;

      participantsInfo.teamOne.push(
        this.analyticalData(
          response.participants[i],
          nameList[i],
          maxMatchData,
          summonerId
        )
      );
      participantsInfo.teamTwo.push(
        this.analyticalData(
          response.participants[i + 5],
          nameList[i + 5],
          maxMatchData,
          summonerId
        )
      );
    }
    participantsInfo.teamOne[
      this.queryMvpIndex(participantsInfo.teamOne).index
    ].isMvp = true;
    participantsInfo.teamTwo[
      this.queryMvpIndex(participantsInfo.teamTwo).index
    ].isMvp = true;

    titleList.push(
      String(this.team100Kills),
      String(this.team200Kills),
      String(this.goldToStr(this.team100GoldEarned)),
      String(this.goldToStr(this.team200GoldEarned))
    );
    participantsInfo.headerInfo = titleList;

    if (!isTeamOne) {
      const temp = participantsInfo.teamOne;
      participantsInfo.teamOne = participantsInfo.teamTwo;
      participantsInfo.teamTwo = temp;
    }
    return participantsInfo;
  }

  // 找出评分最大的对象的数组下表
  private queryMvpIndex = (array: SummonerDetailInfo[]) => {
    return array.reduce(
      (max, obj, index) => {
        if (Number(obj.score) > max.value) {
          return { value: Number(obj.score), index };
        } else {
          return max;
        }
      },
      { value: 0, index: 0 }
    );
  };

  // 解析对局数据
  private analyticalData = (
    participant: Participant,
    nameList: SumPlatInfo,
    maxMatchData: PropertiesToCompareTypes,
    sumId: number
  ): SummonerDetailInfo => {
    const iconList = this.getIconList(participant.stats, maxMatchData);
    const checkAndPushIcon = (
      stats: ParticipantStats,
      condition: (stats: ParticipantStats) => boolean,
      iconName: string
    ) => {
      if (condition(stats)) {
        iconList.push(iconName);
      }
    };
    checkAndPushIcon(
      participant.stats,
      (stats: ParticipantStats) => stats.firstBloodKill,
      "firstBlood"
    );
    checkAndPushIcon(
      participant.stats,
      (stats: ParticipantStats) => stats.tripleKills > 0,
      "threeKills"
    );
    checkAndPushIcon(
      participant.stats,
      (stats: ParticipantStats) => stats.quadraKills > 0,
      "fourKills"
    );
    checkAndPushIcon(
      participant.stats,
      (stats: ParticipantStats) => stats.pentaKills > 0,
      "fiveKills"
    );
    checkAndPushIcon(
      participant.stats,
      (stats: ParticipantStats) => stats.largestKillingSpree >= 8,
      "god"
    );

    const showDataDict: ShowDataTypes = this.getShowDataPercent(maxMatchData, {
      totalDamageDealtToChampions:
        participant.stats.totalDamageDealtToChampions,
      totalDamageTaken: participant.stats.totalDamageTaken,
      goldEarned: participant.stats.goldEarned,
      visionScore: participant.stats.visionScore,
      totalMinionsKilled:
        participant.stats.totalMinionsKilled +
        participant.stats.neutralMinionsKilled,
    });

    return {
      name: nameList.name,
      accountId: nameList.summonerId,
      puuid: nameList.puuid,
      isCurSum: nameList.summonerId === sumId,
      teamType: participant.teamId,
      champLevel: participant.stats.champLevel,
      champImgUrl: `${champDict[participant.championId].alias}.png`,
      spell1Id: participant.spell1Id,
      spell2Id: participant.spell2Id,
      items: [
        participant.stats.item0,
        participant.stats.item1,
        participant.stats.item2,
        participant.stats.item3,
        participant.stats.item4,
        participant.stats.item5,
        participant.stats.item6,
      ],
      kills: participant.stats.kills,
      deaths: participant.stats.deaths,
      assists: participant.stats.assists,
      //物理伤害
      physicalDamageDealtToChampions:
        participant.stats.physicalDamageDealtToChampions,
      // 魔法伤害
      magicDamageDealtToChampions:
        participant.stats.magicDamageDealtToChampions,
      // 真实伤害
      trueDamageDealtToChampions: participant.stats.trueDamageDealtToChampions,
      // 伤害总和
      totalDamageDealtToChampions:
        participant.stats.totalDamageDealtToChampions,
      // 承受伤害
      totalDamageTaken: participant.stats.totalDamageTaken,
      // 击杀野怪
      neutralMinionsKilled: participant.stats.neutralMinionsKilled,
      // 击杀小兵
      totalMinionsKill: participant.stats.totalMinionsKilled,
      // 获得金钱
      goldEarned: participant.stats.goldEarned,
      // 花费金钱
      goldSpent: participant.stats.goldSpent,
      // 视野得分
      visionScore: participant.stats.visionScore,
      // 放置视野
      wardsPlaced: participant.stats.wardsPlaced,
      // 符文数据
      runesList: [
        participant.stats.perk0,
        participant.stats.perk1,
        participant.stats.perk2,
        participant.stats.perk3,
        participant.stats.perk4,
        participant.stats.perk5,
      ],
      totalMinionsKilled:
        participant.stats.totalMinionsKilled +
        participant.stats.neutralMinionsKilled,
      iconList: iconList,
      score: this.analyseSingleMatch(participant.stats),
      isWin: participant.stats.win,
      isMvp: false,
      showDataDict: showDataDict,
    };
  };

  // 获取召唤师participantId 和 name
  private getparticipantIdAndName = (
    participantIdentities: ParticipantIdentity[]
  ) => {
    const dataList: SumPlatInfo[] = [];
    for (const participantIdentity of participantIdentities) {
      dataList.push({
        puuid: participantIdentity.player.puuid,
        name:
          participantIdentity.player.gameName ||
          participantIdentity.player.summonerName,
        summonerId: participantIdentity.player.summonerId,
      });
    }
    return dataList;
  };

  // 获取十名召唤师中的某些数据的最大数据
  private getMaxField = (participants: Participant[]) => {
    const propertiesToCompare: (keyof PropertiesToCompareTypes)[] = [
      "kills",
      "assists",
      "turretKills",
      "totalDamageDealtToChampions",
      "totalMinionsKilled",
      "goldEarned",
      "totalDamageTaken",
      "visionScore",
    ];

    return participants.reduce(
      (res: PropertiesToCompareTypes, obj: Participant) => {
        propertiesToCompare.forEach((property) => {
          if (obj.stats[property] >= res[property]) {
            res[property] = obj.stats[property];
          }
        });
        return res;
      },
      {
        kills: 0,
        assists: 0,
        turretKills: 0,
        totalDamageDealtToChampions: 0,
        totalMinionsKilled: 0,
        goldEarned: 0,
        totalDamageTaken: 0,
        visionScore: 0,
      }
    );
  };

  private getDetailsTitle = (
    creation: number,
    duration: number,
    queueId: number
  ) => {
    const createTime = this.timestampToDate(creation);
    const dateStr = createTime[1];
    const timeStr = createTime[0];
    const lane = queryGameType(queueId);
    const gameDuration = (duration / 60).toFixed(0);
    return [dateStr, timeStr, lane, gameDuration];
  };

  private init() {
    [
      this.team100Kills,
      this.team200Kills,
      this.team100GoldEarned,
      this.team200GoldEarned,
    ] = [0, 0, 0, 0];
    this.markeUsed = {
      kills: true,
      assists: true,
      turretKills: true,
      totalDamageDealtToChampions: true,
      totalMinionsKilled: true,
      goldEarned: true,
      totalDamageTaken: true,
      visionScore: true,
    };
  }

  private timestampToDate = (timestamp: number): [string, string] => {
    const date = new Date(timestamp);
    // 获取时间
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return [
      `${hours} : ${minutes}`,
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) +
        "-" +
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()),
    ];
  };

  private goldToStr = (gold: number) => {
    return Number((gold / 1000).toFixed(1));
  };

  // 获取对于的最大数据图标
  private getIconList = (
    stats: ParticipantStats,
    maxMatchData: PropertiesToCompareTypes
  ) => {
    if (maxMatchData === null) {
      return [];
    }
    const iconList: string[] = [];
    for (const key of Object.keys(maxMatchData)) {
      if (key === "totalMinionsKilled") {
        if (
          stats.totalMinionsKilled + stats.neutralMinionsKilled ===
          maxMatchData.totalMinionsKilled
        ) {
          iconList.push(key);
        }
        continue;
      }
      // @ts-ignore
      if (stats[key] === maxMatchData[key] && this.markeUsed[key]) {
        iconList.push(key);
        // @ts-ignore
        this.markeUsed[key] = false;
      }
    }
    return iconList;
  };

  // 获取需要显示数据的百分比
  private getShowDataPercent = (
    maxDict: PropertiesToCompareTypes,
    curDict: ShowDataTypes
  ) => {
    const resDict: any = {};
    for (const key of Object.keys(curDict)) {
      // @ts-ignore
      resDict[key] = this.computePercent(maxDict[key], curDict[key]);
    }
    return resDict;
  };

  // 根据最高数据算出百分比
  private computePercent = (max: number, cur: number) => {
    if (max === 0 || cur === 0) {
      return "0%";
    }
    return Math.round((cur / max) * 10000) / 100 + "%";
  };

  // 通过分析数据得出单场得分情况
  private analyseSingleMatch = (match: ParticipantStats): string => {
    const kda =
      match.deaths === 0
        ? (match.kills + match.assists) * 2
        : ((match.kills + match.assists) / match.deaths) * 3;
    let score = 0;
    if (match["firstBloodKill"]) {
      score += 2;
    } // 一血 加5分
    if (match["firstBloodAssist"]) {
      score += 1;
    } // 一血助攻 加2分
    score += match["doubleKills"] * 1; // 一次双杀加1分
    score += match["tripleKills"] * 2; // 一次三杀加2分
    score += match["quadraKills"] * 3; // 一次四杀加3分
    score += match["pentaKills"] * 4; // 一次五杀加4分
    score += kda;
    return score.toFixed(1);
  };
}

export interface SummonerInfo {
  name: string;
  privacy: string;
  imgUrl: string;
  lv: string | number;
  xp: number;
  puuid: string;
  currentId: number;
  tagLine: string | undefined;
}

export interface SummonerData {
  summonerInfo: SummonerInfo | null;
  rankList: string[] | null;
  champLevel: string[][] | null;
}

<template>
  <div class="h-full flex flex-col" v-if="queueId !== 1700">
    <match-content-header :title-list="headerInfo" :title="titleArr[rotatedIndex][1]" @change-show="changeShowMode" />
    <div class="flex grow justify-between">
      <match-details @open-drawer="openMatchDrawer" :summoner-list="teamOne" :is-one="true" :summoner-id="summonerId"
        :show-mode="titleArr[rotatedIndex][0]" />
      <match-details @open-drawer="openMatchDrawer" :summoner-list="teamTwo" :is-one="false" :summoner-id="summonerId"
        :show-mode="titleArr[rotatedIndex][0]" />
    </div>
  </div>

  <n-drawer v-model:show="isMatchDra" v-if="!isGameIn" style="
      border-top-right-radius: 0.45rem;
      border-bottom-right-radius: 0.45rem;
    " @after-leave="curMatchDraData = null" :auto-focus="false" :width="265" placement="left">
    <match-drawer v-if="curMatchDraData !== null" :personal-details="curMatchDraData" :is-allow-add="isAllowAdd" />
  </n-drawer>
</template>

<script lang="ts" setup>
import { ref, type Ref } from "vue";
import { NDrawer } from "naive-ui";
import matchContentHeader from "./matchContentHeader.vue";
import matchDetails from "./matchDetails.vue";
import matchDrawer from "./matchDrawer.vue";
import type { SumDetail, SummonerDetailInfo } from "@/lcu/types/MatchLcuTypes";
import { getDrawerData } from "@/lcu/aboutMatch";

const props = defineProps<{
  queueId: number;
  headerInfo: string[];
  teamOne: SummonerDetailInfo[];
  teamTwo: SummonerDetailInfo[];
  summonerId: number;
  isGameIn: boolean;
}>();

const rotatedIndex = ref(0);
const isAllowAdd = ref(true);
const isMatchDra = ref(false);
const curMatchDraData: Ref<SumDetail | null> = ref(null);
const titleArr = [
  ["totalDamageDealtToChampions", "输出伤害"],
  ["totalDamageTaken", "承受伤害"],
  ["goldEarned", "商店存款"],
  ["visionScore", "视野得分"],
  ["totalMinionsKilled", "击杀小兵"],
];

const changeShowMode = () => {
  rotatedIndex.value = (rotatedIndex.value += 1) % titleArr.length;
};

const openMatchDrawer = async (summonerId: number) => {
  if (props.isGameIn) {
    // 如果是游戏里面的窗口显示此页面，不让打开抽屉窗口
    return;
  }
  const allTeam = props.teamOne.concat(props.teamTwo);
  const summonerInfo = allTeam.find((item) => item.accountId === summonerId);
  isAllowAdd.value =
    allTeam.find(
      (item) =>
        item.accountId ===
        JSON.parse(localStorage.getItem("sumInfo") as string).summonerId
    ) !== undefined;
  curMatchDraData.value = await getDrawerData(summonerInfo);
  isMatchDra.value = true;
};
</script>

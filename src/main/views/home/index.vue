<template>
  <div class="mainContent" v-if="summonerData.summonerInfo"></div>
  <div class="mainContent" v-else>
    <start-game />
  </div>
</template>

<script setup lang="ts">
import StartGame from "@/main/views/home/startGame.vue";
import { onMounted, reactive, ref } from "vue";
import type { SummonerData } from "@/lcu/types/SummonerTypes";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentSummonerAllInfo } from "@/lcu/summoner.ts";

const summonerData = reactive<SummonerData>({
  summonerInfo: null,
  rankList: null,
  champLevel: null,
});
const curRegion = ref<string | null>(null);

const init = async (isFirst: boolean) => {
  const summonerAllInfo = await getCurrentSummonerAllInfo();
  if (summonerAllInfo === null) {
    return false;
  }
  summonerData.summonerInfo = summonerAllInfo.summonerInfo;
  return true;
};

onMounted(() => {
  invoke<string>("get_lol_region")
    .then((region) => {
      curRegion.value = region;
      init(true);
    })
    .catch(() => {
      // onClientLaunch();
    });
});
</script>

<style scoped></style>

<template>
  <div class="mainContent">
    <start-game />
  </div>
</template>

<script setup lang="ts">
import StartGame from "@/main/views/home/startGame.vue";
import { onMounted, reactive, ref } from "vue";
import type { SummonerData } from "@/lcu/types/SummonerTypes";
import { invoke } from "@tauri-apps/api/core";

const summonerData = reactive<SummonerData>({
  summonerInfo: null,
  rankList: null,
  champLevel: null,
});
const curRegion = ref<string | null>(null);

const init = async () => {
  const summonerAllInfo = await getCurrentSummonerAllInfo();
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

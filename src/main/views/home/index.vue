<template>
  <div class="mainContent" v-if="summonerData.summonerInfo">
    <n-card size="small" class="shadow!" content-style="padding-bottom: 0;">
      <!-- 头像 昵称 等级-->
      <div class="h-14 flex gap-x-2">
        <n-avatar
          class="avatarEffect"
          round
          :bordered="false"
          :size="56"
          :src="summonerData.summonerInfo.imgUrl"
          fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
        />
        <n-space class="grow! justify-between!" :size="[0, 0]" vertical>
          <div class="flex justify-between">
            <!--            昵称-->
            <n-tag type="success" :bordered="false" class="w-32.5! justify-center!" round>
              <n-ellipsis class="max-w-27.5!" :tooltip="false">
                {{ summonerData.summonerInfo.name }}
              </n-ellipsis>
            </n-tag>
            <n-button class="px-2!" :bordered="false" type="success" size="small" round @click.prevent=""> 我的战绩 </n-button>
          </div>
          <div class="flex justify-between gap-x-3">
            <n-tag type="warning" size="small" round :bordered="false">
              {{ summonerData.summonerInfo.lv }}
            </n-tag>
            <div class="grow bg-[#f0a020]/15 px-1.75 text-[#f0a020] text-xs rounded-xl">
              <div class="flex justify-between items-center">
                <n-progress
                  type="line"
                  :show-indicator="false"
                  :percentage="summonerData.summonerInfo.xp"
                  status="warning"
                  processing
                  class="w-25! mt-[1.2px]!"
                  :height="10"
                />
                <div class="pt-0.5">{{ summonerData.summonerInfo.xp }}%</div>
              </div>
            </div>
          </div>
        </n-space>
      </div>
      <n-divider dashed class="mt-3.5! mb-0.5!" />
      <!--段位 荣誉等级-->
      <n-list>
        <n-list-item>
          <n-space justify="space-between">
            <n-tag class="w-32! justify-center!" type="success" :bordered="false" round> 单双 {{ summonerData.rankList?.[0] }} </n-tag>
            <n-tag class="w-32! justify-center!" type="success" :bordered="false" round> 灵活 {{ summonerData.rankList?.[1] }} </n-tag>
          </n-space>
        </n-list-item>
        <n-list-item>
          <n-space justify="space-between">
            <n-tag class="w-32! justify-center!" type="warning" :bordered="false" round> 云顶 {{ summonerData.rankList?.[2] }} </n-tag>
            <n-tag class="w-32! justify-center!" type="warning" :bordered="false" round> {{ summonerData.rankList?.[3] }} </n-tag>
          </n-space>
        </n-list-item>
      </n-list>
    </n-card>
    <n-card size="small" content-style="padding-top:10px" class="shadow! h-100.5!">
      <summoner-mastery-champ v-if="summonerData.champLevel" :max-h="378" :exist-champ-list="summonerData.champLevel" />
    </n-card>
  </div>
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
import { listen } from "@tauri-apps/api/event";
import { NAvatar, NButton, NCard, NDivider, NEllipsis, NList, NListItem, NProgress, NSpace, NTag } from "naive-ui";
import SummonerMasteryChamp from "@/main/components/summonerMasteryChamp.vue";

const summonerData = reactive<SummonerData>({
  summonerInfo: null,
  rankList: null,
  champLevel: null,
});
const curRegion = ref<string | null>(null);

const init = async (isFirst: boolean) => {
  const summonerAllInfo = await getCurrentSummonerAllInfo();
  console.log(summonerAllInfo);
  if (summonerAllInfo === null) {
    return false;
  }
  summonerData.summonerInfo = summonerAllInfo.summonerInfo;
  summonerData.rankList = summonerAllInfo.rankList;
  summonerData.champLevel = summonerAllInfo.champLevel;
  return true;
};

onMounted(() => {
  invoke<string>("get_lol_region")
    .then((region) => {
      curRegion.value = region;
      init(true);
    })
    .catch(() => {
      onClientLaunch();
    });
});

const onClientLaunch = async () => {
  const closeMessageOn = await listen<string>("initHome", () => {
    let timer = 0;
    const interval = setInterval(async () => {
      timer += 1;
      if (summonerData.summonerInfo === null) {
        await init(true);
      } else {
        clearInterval(interval);
        closeMessageOn();
      }
      if (timer === 15) {
        clearInterval(interval);
        closeMessageOn();
      }
    }, 1000);
  });
};
</script>

<style scoped></style>

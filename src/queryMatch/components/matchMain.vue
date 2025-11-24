<template>
  <div class="flex h-full box-border">
    <matchList />
    <div class="grow p-3 ml-7" :key="matchStore.participantsInfo?.gameId" v-if="matchStore.participantsInfo !== null">
      <matchContent :queue-id="matchStore.participantsInfo.queueId"
        :header-info="matchStore.participantsInfo.headerInfo" :team-one="matchStore.participantsInfo.teamOne"
        :team-two="matchStore.participantsInfo.teamTwo" :summoner-id="matchStore.summonerId" :is-game-in="false"
        @change-summoner="searchSummoner" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import matchList from "./matchList.vue";
import useMatchStore from "../store";
import matchContent from "./matchContent.vue";

const matchStore = useMatchStore();

const searchSummoner = async (summonerId: number) => {
  await matchStore.init(summonerId);
};
</script>

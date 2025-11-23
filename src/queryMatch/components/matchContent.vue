<template>
    <div class="h-full flex flex-col" v-if="queueId !== 1700">
        <match-content-header :title-list="headerInfo" :title="titleArr[rotatedIndex][1]"
            @change-show="changeShowMode" />
        <div class="flex grow justify-between">
            <match-details :summoner-list="teamOne" :is-one="true" :summoner-id="summonerId"/>
            <match-details :summoner-list="teamTwo" :is-one="false" :summoner-id="summonerId"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import matchContentHeader from "./matchContentHeader.vue";
import matchDetails from "./matchDetails.vue";
import type { SummonerDetailInfo } from "@/lcu/types/MatchLcuTypes";

defineProps<{
    queueId: number, headerInfo: string[],
    teamOne: SummonerDetailInfo[], teamTwo: SummonerDetailInfo[],
    summonerId: number;
}>();

const rotatedIndex = ref(0);
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
</script>

<template>
    <div class="h-full flex flex-col" v-if="queueId !== 1700">
        <match-content-header :title-list="headerInfo" :title="titleArr[rotatedIndex][1]"
            @change-show="changeShowMode" />
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import matchContentHeader from "./matchContentHeader.vue";

defineProps<{ queueId: number, headerInfo: string[]; }>();

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

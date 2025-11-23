<template>
    <div class="flex flex-col justify-between mt-[17px]">
        <n-space v-for="summoner in summonerList" vertical>
            <match-sum-details :summoner="summoner" :is-one="isOne" :summoner-id="summonerId" />
        </n-space>
    </div>
</template>

<script lang="ts" setup>
import type { SummonerDetailInfo } from "@/lcu/types/MatchLcuTypes";
import matchSumDetails from "./matchSumDetails.vue";
import { NSpace, NTag, NPopover } from "naive-ui";

defineProps<{ summonerList: SummonerDetailInfo[], isOne: boolean, summonerId: number; }>();
</script>
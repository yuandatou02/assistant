<template>
    <div class="main bg-neutral-100 dark:bg-neutral-900">
        <div data-tauri-drag-region class="dragDiv"></div>
        <queryHeader class="h-10 mb-2" />
        <div class="flex">
            <summonerInfoView v-if="matchStore.summonerInfo" :key="matchStore.summonerId"
                :summoner-info="matchStore.summonerInfo" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import queryHeader from './components/queryHeader.vue';
import summonerInfoView from "./components/summonerInfoView.vue";
import useMatchStore from "./store";

const matchStore = useMatchStore();

onBeforeMount(async () => {
    // 判断是否是其他窗口启动的此窗口
    const isQueryRecord = localStorage.getItem("queSumMatch");
    if (isQueryRecord === null) {
        await matchStore.init();
    }
});
</script>
<template>
    <div class="main bg-neutral-100 dark:bg-neutral-900">
        <div data-tauri-drag-region class="dragDiv"></div>
        <queryHeader class="h-10 mb-2" />
        <div class="flex">
            <summonerInfoView v-if="matchStore.summonerInfo" :key="matchStore.summonerId"
                :summoner-info="matchStore.summonerInfo" />
            <div class="w-[254px]" v-else>

            </div>
            <div class="ml-3 grow">
                <n-card v-if="!matchStore.matchLoading" class="shadow! h-full!" size="small"
                    content-style="padding:0 0 0 12px">
                    <matchErr v-if="matchStore.matchList === null" />
                    <matchMain v-else-if="matchStore.matchList.length !== 0" />
                    <div v-else-if="!matchStore.matchLoading" class="w-full h-full flex justify-center items-center">
                        <n-result size="large" status="404" title="召唤师数据为空" description="此页数不存在数据，请返回前一页">
                            <template #footer>
                                <n-button type="error">
                                    生活总归带点荒谬
                                </n-button>
                            </template>
                        </n-result>
                    </div>
                </n-card>
                <n-card v-else class="shadow! h-full!" size="small" content-style="padding:0 0 0 12px">
                    <loading-anime />
                </n-card>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { NCard, NResult, NDrawer, NDrawerContent, NButton } from "naive-ui";
import { onBeforeMount } from 'vue';
import queryHeader from './components/queryHeader.vue';
import summonerInfoView from "./components/summonerInfoView.vue";
import matchErr from "./components/matchErr.vue";
import matchMain from "./components/matchMain.vue";
import loadingAnime from "./components/loadingAnime.vue";
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
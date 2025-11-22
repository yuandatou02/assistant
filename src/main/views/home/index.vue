<template>
    <div class="mainContent" v-if="summonerData.summonerInfo"></div>
    <div class="mainContent" v-else>
        <startGame />
    </div>
</template>


<script lang="ts" setup>
import {
    NCard,
    NAvatar,
    NProgress,
    NSpace,
    NTag,
    NDivider,
    NList,
    NListItem,
    NButton,
    NEllipsis, NModal,
} from "naive-ui";
import startGame from "./startGame.vue";
import { onMounted, reactive } from "vue";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type { SummonerData } from "@/lcu/types/SummonerTypes";

const summonerData = reactive<SummonerData>({
    summonerInfo: null,
    rankList: null,
    champLevel: null,
});

onMounted(() => {
    invoke<boolean>("is_lol_client").then((val: boolean) => {
        if (val) {
            initData();
        } else {
            onClientLaunch();
        }
    });
});

const onClientLaunch = async () => {
    const closeMessageOn = await listen<string>("initHome", () => {
        let timer = 0;
        const interval = setInterval(async () => {
            timer++;
            initData();
            if (timer === 15) {
                clearInterval(interval);
                closeMessageOn();
            }
        }, 1000);
    });
};

const initData = async () => {

}

</script>
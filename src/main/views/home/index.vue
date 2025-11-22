<template>
    <div class="mainContent" v-if="summonerData.summonerInfo">
        <n-card size="small" class="shadow!" content-style="padding-bottom: 0;">
            <!-- 头像 昵称 等级 -->
            <div class="h-14 flex gap-x-2">
                <n-avatar class="avatarEffect" round :bordered="false" :size="56"
                    :src="summonerData.summonerInfo.imgUrl"
                    fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png" />

                <n-space class="grow" :size="[0, 0]" justify="space-between" vertical>
                    <div class=" flex justify-between">
                        <!-- 昵称 -->
                        <n-tag type="success" class="w-[130px]! justify-center!" :bordered="false" round>
                            <n-ellipsis class=" max-w-[110px]!" :tooltip="false">
                                {{ summonerData.summonerInfo.name }}
                            </n-ellipsis>
                        </n-tag>
                        <!-- 我的战绩按钮 -->
                        <n-button class="px-2!" :bordered="false" type="success" size="small" round>
                            我的战绩
                        </n-button>
                    </div>
                    <!-- 等级 -->
                    <div class="flex justify-between gap-x-3">
                        <n-tag type="warning" size="small" round :bordered="false">
                            {{ summonerData.summonerInfo.lv }}
                        </n-tag>
                        <div class="grow bg-[rgba(240,160,32,0.15)] px-[7px] text-[#f0a020] text-xs rounded-xl">
                            <div class="flex justify-between items-center">
                                <n-progress type="line" :show-indicator="false"
                                    :percentage="summonerData.summonerInfo.xp" status="warning" processing
                                    class="w-[100px]! mt-[1.2px]!" :height="10" />
                                <div class="pt-0.5!">{{ summonerData.summonerInfo.xp }} %</div>
                            </div>
                        </div>
                    </div>
                </n-space>
            </div>
            <n-divider dashed style="margin: 14px 0 2px 0;" />
            <!-- 段位 荣誉等级 -->
            <n-list>
                <n-list-item>
                    <n-space justify="space-between">
                        <n-tag class="w-32! justify-center!" type="success" :bordered="false" :round="false">
                            单双 {{ summonerData.rankList?.[0] }}
                        </n-tag>
                        <n-tag class="w-32! justify-center!" type="success" :bordered="false" :round="false">
                            灵活 {{ summonerData.rankList?.[1] }}
                        </n-tag>
                    </n-space>
                </n-list-item>
                <n-list-item>
                    <n-space justify="space-between">
                        <n-tag class="w-32! justify-center!" type="warning" :bordered="false" :round="false">
                            云顶 {{ summonerData.rankList?.[2] }}
                        </n-tag>
                        <n-tag class="w-32! justify-center!" type="warning" :bordered="false" :round="false">
                            {{ summonerData.rankList?.[3] }}
                        </n-tag>
                    </n-space>
                </n-list-item>
            </n-list>
        </n-card>
    </div>
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
import { getCurrentSummonerAllInfo } from "@/lcu/aboutSummoner";

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
            if (summonerData.summonerInfo === null) {
                initData();
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

const initData = async () => {
    const summonerInfo = await getCurrentSummonerAllInfo();
    if (summonerInfo === null) return false;
    summonerData.summonerInfo = summonerInfo.summonerInfo;
    summonerData.rankList = summonerInfo.rankList;
    return true;
}

</script>
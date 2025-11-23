<template>
    <div class="flex flex-col w-[254px]">
        <n-card size="small" class="shadow!" content-style="padding-bottom:0">
            <div class="h-14 flex gap-x-2">
                <!-- 头像 -->
                <n-avatar class="avatarEffect" round :bordered="false" :size="56" :src="summonerInfo.info.imgUrl"
                    fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png" />
                <n-space class="grow" :size="[0, 0]" justify="space-between" vertical>
                    <div class="flex justify-between">
                        <!-- 昵称 -->
                        <n-tag class="w-full! justify-center!" type="success" :bordered="false" round>
                            <n-ellipsis class="max-w-[140px]!">
                                {{ summonerInfo.info.name }}
                            </n-ellipsis>
                        </n-tag>
                    </div>
                    <div class="flex justify-between gap-x-3">
                        <!-- 等级进度条 -->
                        <div class="grow bg-[rgba(240,160,32,0.15)] px-[7px] text-[#f0a020] text-[12px] rounded-xl">
                            <div class="flex justify-between items-center gap-x-2">
                                <n-progress type="line" :show-indicator="false" :percentage="summonerInfo.info.xp"
                                    status="warning" processing :height="10" />
                                <div class="pt-px">
                                    <n-ellipsis class="max-w-10!">
                                        {{ summonerInfo.info.lv }}
                                    </n-ellipsis>
                                </div>
                            </div>
                        </div>
                    </div>
                </n-space>
            </div>
            <!-- 排位数据 -->
            <n-list class="mt-[21px]!">
                <n-list-item v-for="rank in rankRender">
                    <div class="flex justify-between">
                        <n-tag class="w-[76px]! justify-center!" type="success" :bordered="false" :round="false">
                            {{ rank.title }}
                        </n-tag>
                        <n-tag class="w-[76px]! justify-center!" type="warning" :bordered="false" :round="false">
                            {{ rank.value }}
                        </n-tag>
                    </div>
                </n-list-item>
            </n-list>
        </n-card>
        <!-- 战绩分析加载页面 -->
        <n-card size="small" class="mt-3! shadow! h-[337px]!" content-style="padding-top:10px">
            <div class="pl-0.5" v-if="matchStore.matchLoading">
                <n-steps size="small" vertical>
                    <n-step style="margin: 4px 0" title="近期使用英雄">
                        <template #icon>
                            <n-icon>
                                <FlameOutline />
                            </n-icon>
                        </template>
                        <n-space justify="space-between">
                            <n-space vertical :size="[0, 2.5]" v-for="_ in 3">
                                <n-skeleton height="45px" width="45px" :sharp="false" />
                                <n-tag :bordered="false" size="small" class="text-sm! w-[45px]! justify-center!" />
                            </n-space>
                        </n-space>
                    </n-step>
                    <n-step style="margin: 0;" title="近期活跃程度">
                        <template #icon>
                            <n-icon>
                                <PlanetOutline />
                            </n-icon>
                        </template>
                        <n-space class="pt-1!" :size="[12, 16]" justify="space-between">
                            <n-space :size="[0, 3]" vertical v-for="_ in 6">
                                <n-skeleton height="45px" circle />
                                <n-tag :bordered="false" round class="w-[45px]! h-[22px]! px-3!">
                                    <div class=" absolute top-[7px] right-[5px]"></div>
                                </n-tag>
                            </n-space>
                        </n-space>
                    </n-step>
                </n-steps>
            </div>
        </n-card>
    </div>
</template>

<script lang="ts" setup>
import type { SummonerInfo } from "@/lcu/types/SummonerTypes";
import {
    NAvatar,
    NCard,
    NProgress,
    NSpace,
    NTag,
    NList,
    NListItem,
    NEllipsis,
    NStep,
    NIcon,
    NSteps,
    NSkeleton
} from "naive-ui";
import { FlameOutline, PlanetOutline } from "@vicons/ionicons5";
import useMatchStore from "../store";

const props = defineProps<{ summonerInfo: { info: SummonerInfo, rank: string[]; }; }>();
const matchStore = useMatchStore();
const rankRender = [
    { title: '单双排位', value: props.summonerInfo.rank[0] },
    { title: '灵活排位', value: props.summonerInfo.rank[1] },
    { title: '云顶排位', value: props.summonerInfo.rank[2] }
];
</script>
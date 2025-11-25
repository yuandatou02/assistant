<template>
    <div class="mainContent">
        <n-card size="small" class="shadow!" content-style="padding-bottom: 0;">
            <n-space justify="space-between">
                <n-dropdown :show-arrow="false" trigger="hover" :options="rankOptions" @select="handleRankSelect">
                    <n-button secondary type="info">{{ is101 ? '国服排位英雄数据' : '韩服排位英雄数据' }}</n-button>
                </n-dropdown>
                <n-select v-model:value="tier" :show-checkmark="false" :options="is101 ? cnOptions : krOptions"
                    @update:value="handleTierSelect" />
            </n-space>
            <n-space class="mt-2! mb-2.5!" justify="space-between">
                <n-button v-for="(button, index) in ghostButtons" :key="index" :bordered="false"
                    :type="isCheck === button.value ? 'info' : 'tertiary'" size="small" secondary
                    @click="button.action">
                    {{ button.label }}
                </n-button>
            </n-space>
        </n-card>
        <n-card class="shadow! mt-[18px]!" size="small" content-style="padding:0 12px 10px 12px;">
            <n-list>
                <template #header>
                    <div class="h-7 flex gap-x-5">
                        <search-champ @select-function="searchChampData" />
                        <n-dropdown trigger="hover" @select="handleSelect" placement="left-start"
                            :options="positionOptions">
                            <div class=" absolute right-2 top-2" :class="lane"></div>
                        </n-dropdown>
                    </div>
                </template>
                <n-scrollbar class="max-h-[432px]! pr-[13px]!">
                    <n-list-item v-if="champList.length !== 0" v-for="champ in champList">
                        <div class="flex gap-x-3">
                            <div
                                class="flex items-center justify-center h-12 w-12 rounded bg-blue-100 cursor-pointer dark:bg-[#70c0e850]">
                                <n-avatar :size="40" :bordered="false" lazy :render-placeholder="() => null"
                                    :intersection-observer-options="{
                                        root: '#image-scroll-container',
                                    }" :src="champ.imgUrl"
                                    @click="initDesDrawer(true, champ.champId, champ.imgUrl, champ.tLevel)"
                                    fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png" />
                            </div>
                            <div class="grow">
                                <div class="h-12 flex flex-col gap-y-2.5">
                                    <div class="text-sm">{{ champ.name }}</div>
                                    <div class="flex justify-between items-end relative">
                                        <div class="text-xs w-17"
                                            :class="isCheck === 2 ? 'text-blue-400' : 'text-gray-400 '">
                                            胜率 {{ champ.win }}
                                        </div>
                                        <div :class="isCheck === 4 ? 'text-blue-400' : 'text-gray-400 '"
                                            class="text-xs w-17">
                                            禁用 {{ champ.ban }}
                                        </div>
                                        <div :class="isCheck === 3 ? 'text-blue-400' : 'text-gray-400 '"
                                            class="text-xs w-19">
                                            登场率 {{ champ.appearance }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </n-list-item>
                </n-scrollbar>
            </n-list>
        </n-card>
        <n-drawer style="border-top-left-radius: 0.5rem;border-top-right-radius: 0.5rem" placement="bottom"
            :auto-focus="true" height="500" v-model:show="isShowDrawer" @after-leave="initDesDrawer(false)">
            <champ-detail :champ-id="currentChampDrawer.champId" :is101="is101" :lane="lane" :tier="tier"
                :selected-list="currentChampDrawer.selectedList" />
        </n-drawer>
    </div>
</template>

<script lang="ts" setup>
import "./assistCommon.css";
import type { ConfigRank } from "@/background/types";
import { cnOptions, getLocalDateStr, getPostion, krOptions, positionOptions, rankOptions } from "@/main/utils/rankUtils";
import {
    NCard, NAvatar, NSpace, NSelect, NBackTop,
    NList, NListItem, NScrollbar, useMessage, NDropdown, NButton, NDrawer, arDZ
} from "naive-ui";
import searchChamp from "@/main/components/searchChamp.vue";
import champDetail from "./champDetail.vue";
import { onMounted, ref, type Ref } from "vue";
import type { ChampInfo } from "@/lcu/types/RankTypes";
import { aliasToId, champDict } from "@/resources/champList";
import { queryCNServe, queryKRServe } from "@/lcu/abuoutRank";

const configRank: ConfigRank = JSON.parse(localStorage.getItem("configRank") as string);
const is101 = ref(configRank.is101);
const tier = ref(configRank.tier);
const lane = ref(configRank.lane);
const isShowDrawer = ref(false);
const isCheck = ref(1);
const champList: Ref<ChampInfo[]> = ref([]);
const currentChampDrawer: Ref<{ champId: number, selectedList: string[]; }> = ref({
    champId: 0,
    selectedList: [] as string[]
});
const message = useMessage();


const searchChampData = (value: string) => {
    if (value === '') {
        message.warning('请输入英雄名');
        return;
    }
    const resultChamp = champList.value.filter(item => item.champId === aliasToId[value])[0];
    if (resultChamp) {
        initDesDrawer(true, resultChamp.champId, resultChamp.imgUrl, resultChamp.tLevel);
    } else {
        message.warning('当前英雄在此位置不存在');
    }
};

const handleSelect = (positon: string) => {
    champList.value = [];
    isCheck.value = 1;
    configRank.lane = positon;
    localStorage.setItem("configRank", JSON.stringify(configRank));
    lane.value = positon;
    queryChampRankData().then(() => {
        switch (positon) {
            case 'top':
                message.success('上单数据更新成功');
                break;
            case 'jungle':
                message.success('打野数据更新成功');
                break;
            case 'mid':
                message.success('中单数据更新成功');
                break;
            case 'bottom':
                message.success('下路数据更新成功');
                break;
            case 'support':
                message.success('辅助数据更新成功');
                break;
        }
    });
};

const handleTierSelect = async (key: number) => {
    champList.value = [];
    tier.value = key;
    configRank.tier = key;
    localStorage.setItem("configRank", JSON.stringify(configRank));
    await queryChampRankData();
};

// 获取不同服务器的数据
const queryChampRankData = async (): Promise<boolean> => {
    if (is101.value) {
        const champInfo = await queryCNServe(configRank, tier.value, lane.value, getLocalDateStr(), 1);
        if (champInfo) {
            champList.value = champInfo;
            return true;
        }
    } else {
        const laneKr = getPostion(lane.value);
        const champInfo = await queryKRServe(configRank, tier.value, laneKr, "135");
        if (champInfo) {
            champList.value = champInfo;
            return true;
        } else {
            message.error('韩服数据获取异常');
            handleRankSelect();
            return false;
        }
    }
    return false;
};

// 根据不同的参数进行 快速排序
const quickSort = (factor: string) => {
    champList.value.sort((x: any, y: any) => {
        return factor == 'sortId' ? parseFloat(x[factor]) - parseFloat(y[factor]) : parseFloat(y[factor]) - parseFloat(x[factor]);
    });
};

// 改变不同服务器的数据排行
const handleRankSelect = () => {
    isCheck.value = 1;
    is101.value = !is101.value;
    tier.value = is101.value ? 200 : 2;
    champList.value = [];
    queryChampRankData().then((isSuccess: boolean) => {
        if (isSuccess) {
            if (is101.value) {
                message.success("国服数据获取成功!");
            } else {
                message.success("韩服数据获取成功!");
            }
            configRank.tier = tier.value;
            configRank.is101 = is101.value;
            localStorage.setItem("configRank", JSON.stringify(configRank));
        }
    });
};

const getComprehensiveRankData = () => {
    isCheck.value = 1;
    quickSort('sortId');
};
// 根据胜率数据改变排行
const getWinRankData = () => {
    isCheck.value = 2;
    quickSort('win');
};
// 根据出场率改变排行
const getAppearanceRankData = () => {
    isCheck.value = 3;
    quickSort('appearance');
};
// 根据禁用率改变排行
const getBanRankData = () => {
    isCheck.value = 4;
    quickSort('ban');
};

// ghostButtons列表
const ghostButtons = [
    { label: '综合', value: 1, action: getComprehensiveRankData },
    { label: '胜率', value: 2, action: getWinRankData },
    { label: '禁用', value: 4, action: getBanRankData },
    { label: '登场', value: 3, action: getAppearanceRankData },
];

// 初始化或者清空抽屉数据 打开英雄详细数据抽屉窗口
const initDesDrawer = (isInit: boolean, champId?: number, imgUrl?: string, level?: string) => {
    if (isInit) {
        isShowDrawer.value = true;
        // @ts-ignore
        const selectedList: string[] = [imgUrl, champDict[champId].label + '•' + champDict[champId].title, level, String(champId)];
        // @ts-ignore
        currentChampDrawer.value = {
            champId: champId, selectedList: selectedList,
        };
    } else {
        currentChampDrawer.value = {
            champId: 0, selectedList: []
        };
    }
};

onMounted(async () => {
    await queryChampRankData();
});
</script>
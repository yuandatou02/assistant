<template>
    <div class="mainContent">
        <n-card size="small" class="shadow!" content-style="padding-bottom: 0;">
            <n-space justify="space-between">
                <n-dropdown :show-arrow="false" trigger="hover" :options="rankOptions">
                    <n-button secondary type="info">{{ is101 ? '国服排位英雄数据' : '韩服排位英雄数据' }}</n-button>
                </n-dropdown>
                <n-select v-model:value="tier" :show-checkmark="false" :options="is101 ? cnOptions : krOptions" />
            </n-space>
            <n-space class="mt-2! mb-2.5!" justify="space-between">
                <n-button v-for="(button, index) in ghostButtons" :key="index" :bordered="false"
                    :type="isCheck === button.value ? 'info' : 'tertiary'" size="small" secondary>
                    {{ button.label }}
                </n-button>
            </n-space>
        </n-card>
        <n-card class="shadow! mt-[18px]!" size="small" content-style="padding:0 12px 10px 12px;">
            <n-list>
                <template #header>
                    <div class="h-7 flex gap-x-5">
                        <search-champ @select-function="searchChampData" />
                        <n-dropdown trigger="hover" placement="left-start" :options="positionOptions">
                            <div class=" absolute right-2 top-2" :class="lane"></div>
                        </n-dropdown>
                    </div>
                </template>
            </n-list>
        </n-card>
    </div>
</template>

<script lang="ts" setup>
import "./assistCommon.css";
import type { ConfigRank } from "@/background/types";
import { cnOptions, krOptions, positionOptions, rankOptions } from "@/main/utils/rankUtils";
import {
    NCard, NAvatar, NSpace, NSelect, NBackTop,
    NList, NListItem, NScrollbar, useMessage, NDropdown, NButton, NDrawer, arDZ
} from "naive-ui";
import searchChamp from "@/main/components/searchChamp.vue";
import { ref, type Ref } from "vue";
import type { ChampInfo } from "@/lcu/types/RankTypes";
import { aliasToId } from "@/resources/champList";

const configRank: ConfigRank = JSON.parse(localStorage.getItem("configRank") as string);
const is101 = ref(configRank.is101);
const tier = ref(configRank.tier);
const lane = ref(configRank.lane);
const isCheck = ref(1);
const champList: Ref<ChampInfo[]> = ref([]);
const message = useMessage();
// ghostButtons列表
const ghostButtons = [
    { label: '综合', value: 1, },
    { label: '胜率', value: 2, },
    { label: '禁用', value: 4, },
    { label: '登场', value: 3, },
];

const searchChampData = (value: string) => {
    if (value === '') {
        message.warning('请输入英雄名');
        return;
    }
    const resultChamp = champList.value.filter(item => item.champId === aliasToId[value])[0];
    if (resultChamp) {
        message.success('查询成功');
    } else {
        message.warning('当前英雄在此位置不存在');
    }
};
</script>
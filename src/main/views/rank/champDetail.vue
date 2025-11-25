<template>
    <n-drawer-content body-content-style="padding:0 21px">
        <n-list>
            <template #header>
                <div class="flex h-12 gap-x-3">
                    <n-avatar class="cursor-pointer hover:rounded" style="
                            transition: border-radius 0.5s
                                cubic-bezier(0.4, 0, 0.2, 1);
                        " round :bordered="false" :size="48" @click="preselectChamp(Number(selectedList[3]))"
                        fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                        :src="selectedList[0]" />
                    <div class="grow">
                        <n-space vertical :size="[0, 2]">
                            <div>{{ selectedList[1] }}</div>
                            <n-space justify="space-between">
                                <div class="text-gray-400 text-[13px]">
                                    当前英雄胜率•请看下方数据
                                </div>
                            </n-space>
                        </n-space>
                    </div>
                    <div class="absolute top-3 right-5" :class="'imgT' + selectedList[2]"></div>
                </div>
            </template>
            <n-tabs size="small" type="segment" animated>
                <n-tab-pane name="advanced" tab="优势对线">
                    <champ-win-rate :champ-list="advancedList" @preselect-champ="preselectChamp" />
                </n-tab-pane>
                <n-tab-pane name="regress" tab="劣势对线">
                    <champ-win-rate :champ-list="regressList" @preselect-champ="preselectChamp" />
                </n-tab-pane>
            </n-tabs>
        </n-list>
    </n-drawer-content>
</template>

<script lang="ts" setup>
import type { ChampDetailDrawer } from "@/lcu/types/RankTypes";
import {
    NAvatar,
    NList,
    NTabs,
    NTabPane,
    NScrollbar,
    NSkeleton,
    NListItem,
    NSpace,
    NTag,
    useMessage,
    NDrawerContent,
} from "naive-ui";
import champWinRate from "./champWinRate.vue";
import type { Ref } from "vue";
import { ref } from "vue";
import { onMounted } from "vue";
import { getRestRaintData } from "@/lcu/abuoutRank";

const props = defineProps<ChampDetailDrawer>();
const advancedList: Ref<[string, string, number, number, number][]> = ref([]);
const regressList: Ref<[string, string, number, number, number][]> = ref([]);
const message = useMessage();

// 预选英雄
const preselectChamp = async (champId: number) => {
    message.error('请在选择英雄阶段使用');
};

onMounted(async () => {
    const response = await getRestRaintData(props.champId, props.lane, props.tier, props.is101, "135");
    if (response !== null) {
        advancedList.value = response.filter((item) => item[2] >= 50).reverse();
        regressList.value = response.filter((item) => item[2] < 50);
    } else {
        message.error("获取英雄数据失败");
    }
});
</script>

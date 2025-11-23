<template>
    <div class="pl-0.5">
        <n-steps size="small" vertical>
            <n-step style="margin: 0;" title="近期使用英雄">
                <template #icon>
                    <n-icon>
                        <FlameOutline />
                    </n-icon>
                </template>
                <n-space justify="space-between">
                    <n-space vertical v-for="champ in analysisData.top3Champions">
                        <n-avatar :size="WIDTH" :src="getImg(champ.champId)" />
                        <n-tag v-if="pageType === 0" :bordered="false" size="small"
                            class="text-sm! w-[55px]! justify-center!">
                            {{ champ.count }}/{{ analysisData.totalChampions }}
                        </n-tag>
                        <n-tag v-else :bordered="false" size="small" class="text-sm! w-[45px]! justify-center!">
                            {{ champ.count }}/{{ analysisData.totalChampions }}
                        </n-tag>
                    </n-space>
                </n-space>
            </n-step>
            <n-step style="margin: 0;" title="近期活跃程度">
                <template #icon>
                    <n-icon>
                        <PlanetOutline />
                    </n-icon>
                </template>
                <n-space :class="pageType === 1 ? 'pt-1!' : ''" :size="pageType === 1 ? [12, 8] : [12, 10]"
                    justify="space-between">
                    <n-space vertical v-for="(pos, index) in posRate">
                        <n-progress :style="proStyle" type="circle" :stroke-width="10"
                            :percentage="getPercent(analysisData.roleCountMap[pos.key], analysisData.totalChampions)"
                            :color="usedRole !== pos.key ? colorGreen.color : colorBlue.color"
                            :rail-color="usedRole !== pos.key ? colorGreen.bgColor : colorBlue.bgColor" />
                        <n-tag v-if="pageType === 0" :bordered="false" round style="width: 55px;padding: 0 12px;">
                            <template #avatar>
                                <n-avatar style="background-color:#ffffff00;" :src="pos.imgUrl" />
                            </template>
                            <div class=" absolute!" style="top: 7px; right: 5px;">{{ pos.name }}</div>
                        </n-tag>
                        <n-tag v-else :bordered="false" round style="width: 45px;height:22px;padding: 0 22px;">
                            <template #avatar>
                                <n-avatar style="background-color:#ffffff00;" :src="pos.imgUrl" />
                            </template>
                        </n-tag>
                    </n-space>
                </n-space>
            </n-step>
            <n-step v-if="pageType === 0" status="wait" title="节选最近 50场对局分析">
                <template #icon>
                    <n-icon>
                        <BulbOutline />
                    </n-icon>
                </template>
            </n-step>
        </n-steps>
    </div>
</template>

<script lang="ts" setup>
import { NAvatar, NSpace, NTag, NSteps, NStep, NIcon, NProgress } from "naive-ui";
import { FlameOutline, PlanetOutline, BulbOutline } from "@vicons/ionicons5";
import type { RencentDataAnalysisTypes } from "@/lcu/types/TeammateTypes";
import { champDict } from "@/resources/champList";
import { posRate } from "@/resources/otherList";

const props = defineProps<{ analysisData: RencentDataAnalysisTypes, pageType: number; }>();
const WIDTH = props.pageType === 0 ? 55 : 45;
const proStyle = `width: ${WIDTH}px;font-size: 14px`;

const getImg = (champId: number) => {
    return `https://game.gtimg.cn/images/lol/act/img/champion/${champDict[champId].alias}.png`;
};
const getPercent = (num: number, total: number) => {
    return Math.round((num / total) * 100);
};
const roles = props.analysisData.roleCountMap;
const usedRole = Object.keys(roles).reduce((a, b) => roles[a] > roles[b] ? a : b);
const colorGreen = {
    color: '#18A058',
    bgColor: 'rgba(24,160,88,0.2)'
};
const colorBlue = {
    color: '#f0a020',
    bgColor: 'rgba(240,160,32,0.2)'
};
</script>
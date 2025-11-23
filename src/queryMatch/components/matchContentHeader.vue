<template>
    <n-grid class=" bg-neutral-100! rounded! dark:bg-neutral-800!" :cols="7">
        <n-gi>
            <n-space vertical align="center">
                <div class=" text-gray-400">对局日期</div>
                <div>{{ titleList[0] }}</div>
            </n-space>
        </n-gi>
        <n-gi>
            <n-space vertical align="center">
                <div class=" text-gray-400">对局类型</div>
                <div>{{ titleList[2] }}</div>
            </n-space>
        </n-gi>
        <n-gi>
            <n-space vertical align="center">
                <div class=" text-gray-400">开始时间</div>
                <div>{{ titleList[1] }}</div>
            </n-space>
        </n-gi>
        <n-gi>
            <n-space vertical align="center">
                <div class=" text-gray-400">数据显示</div>
                <div class=" cursor-pointer text-emerald-500" @click="handleChangeShow">{{ title }}</div>
            </n-space>
        </n-gi>
        <n-gi>
            <n-space vertical align="center">
                <div class="text-gray-400">双方比分</div>
                <div>
                    <text style="color: #66B3FF">{{ titleList[4] }}</text>
                    /
                    <text style="color: #FF6666">{{ titleList[5] }}</text>
                </div>
            </n-space>
        </n-gi>
        <n-gi>
            <n-space vertical align="center">
                <div class=" text-gray-400">对局时长</div>
                <div class=" cursor-pointer text-emerald-500">{{ titleList[3] }}分钟</div>
            </n-space>
        </n-gi>
        <n-gi>
            <n-space vertical align="center">
                <text class="text-gray-400">经济差距</text>
                <text v-if="titleList[6] > titleList[7]" style="color: #66B3FF">.
                    {{ (titleList[6] - titleList[7]).toFixed(1) }} K</text>
                <text v-else style="color: #FF6666">
                    {{ (titleList[7] - titleList[6]).toFixed(1) }} K
                </text>
            </n-space>
        </n-gi>
    </n-grid>
</template>

<script lang="ts" setup>
import { NGrid, NGi, NSpace } from "naive-ui";


defineProps<{ titleList: string[], title: string; }>();
const emit = defineEmits<{
    changeShow: [];
}>();

const handleChangeShow = () => {
    emit("changeShow");
};
</script>
<template>
    <n-drawer-content body-content-style="padding:0 21px">
        <n-list>
            <template #header>
                <div class="flex h-12 gap-x-3">
                    <n-avatar class=" cursor-pointer hover:rounded"
                        style="transition: border-radius .5s cubic-bezier(0.4, 0, 0.2, 1);" round :bordered="false"
                        :size="48"
                        fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                        :src="selectedList[0]" />
                    <div class="grow">
                        <n-space vertical :size="[0, 2]">
                            <div>{{ selectedList[1] }}</div>
                            <n-space justify="space-between">
                                <div class="text-gray-400 text-[13px]">当前英雄胜率•请看下方数据</div>
                            </n-space>
                        </n-space>
                    </div>
                    <div class=" absolute top-3 right-5" :class="'imgT' + selectedList[2]"></div>
                </div>
            </template>
        </n-list>
    </n-drawer-content>
</template>

<script lang="ts" setup>
import type { ChampDetailDrawer } from "@/lcu/types/RankTypes";
import { NAvatar, NList, NTabs, NTabPane, NScrollbar, NSkeleton, NListItem, NSpace, NTag, useMessage, NDrawerContent } from "naive-ui";
const props = defineProps<ChampDetailDrawer>();
</script>
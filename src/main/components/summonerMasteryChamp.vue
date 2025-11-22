<template>
    <n-scrollbar v-if="champList?.length === 0" :style="styleSco">
        <n-space vertical :size="[0, 15]" class="mt-[3px]!">
            <div class="flex" v-for="_ in 6">
                <n-skeleton height="50px" width="50px" :sharp="false" class="mr-2!" />
                <div class="grow flex flex-col justify-between">
                    <n-skeleton heigh="22px" width="100%" :sharp="false"></n-skeleton>
                    <n-skeleton heigh="22px" width="100%" :sharp="false"></n-skeleton>
                </div>
            </div>
        </n-space>
    </n-scrollbar>
    <n-scrollbar id="image-scroll-container" v-else-if="champList?.length !== 0" :style="styleSco">
        <div>
            <n-space vertical :size="[0, 15]" class="mt-[3px]!">
                <div class="flex h-[50px]" v-for="champ in champList" has-sider>
                    <div class="mr-2 w-[50px]">
                        <div class="flex gap-x-3">
                            <div
                                class="flex items-center justify-center rounded bg-blue-100 dark:bg-[#70c0e850] w-[50px] h-[50px]">
                                <n-avatar :size="42" :src="champ[0]" lazy :render-placeholder="() => null"
                                    :intersection-observer-options="{
                                        root: '#image-scroll-container',
                                    }"
                                    fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png" />
                            </div>
                        </div>
                    </div>
                    <div class="grow">
                        <div class="flex flex-col justify-between h-full">
                            <n-tag class=" justify-center!" size="small" :bordered="false" type="success">
                                {{ champ[1] }}
                            </n-tag>
                            <n-tag class=" justify-center!" size="small" :bordered="false" type="info">
                                {{ champ[2] }}
                            </n-tag>
                        </div>
                    </div>
                </div>
            </n-space>
        </div>
    </n-scrollbar>
    <n-result v-else class="mt-20!" status="418" title="数据获取失败" description="生活总归带点荒谬"></n-result>
</template>

<script lang="ts" setup>
import { NSpace, NScrollbar, NAvatar, NTag, NResult, NSkeleton } from "naive-ui";

const props = defineProps<{ champList: string[][] | undefined; maxH: number; }>();
const styleSco = `max-height:${props.maxH}px;padding-right: 13px`;
</script>
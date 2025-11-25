<template>
    <div>
        <n-list-item v-if="champList.length === 0" v-for="_ in 5">
            <n-space>
                <n-skeleton height="48px" circle />
                <n-space vertical size="medium">
                    <n-skeleton height="20px" width="216px" round />
                    <n-skeleton height="20px" width="216px" round />
                </n-space>
            </n-space>
        </n-list-item>
        <n-scrollbar id="image-scroll-container" class="max-h-[350px]! pr-3!" v-else>
            <n-list-item v-for="champ in champList">
                <div class="flex gap-x-3">
                    <n-avatar class="cursor-pointer hover:rounded"
                        style="transition: border-radius .5s cubic-bezier(0.4, 0, 0.2, 1);" round :bordered="false"
                        :size="48" :src="champ[1]" @click="preselectChamp(champ[3])"
                        fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png" />
                    <div class="flex grow flex-col justify-between">
                        <n-tag type="info" :bordered="false" size="small" round class="justify-center! h-5!">
                            {{ champ[0] }}
                        </n-tag>
                        <n-tag :type="champ[2] >= 50 ? 'success' : 'error'" :bordered="false" size="small"
                            class="justify-center! h-5!" round>
                            场数:{{ champ[4] }}&emsp;胜率:{{ champ[2] }}%
                        </n-tag>
                    </div>
                </div>
            </n-list-item>
        </n-scrollbar>
    </div>
</template>

<script lang="ts" setup>
import { NAvatar, NScrollbar, NSkeleton, NListItem, NSpace, NTag } from "naive-ui";

defineProps<{ champList: [string, string, number, number, number][] }>();
const emit = defineEmits(["preselectChamp"]);
const preselectChamp = (champId: number) => {
    emit("preselectChamp", champId);
}
</script>
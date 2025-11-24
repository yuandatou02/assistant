<template>
    <n-list>
        <n-list-item class="w-[186px]!" v-for="(match, index) in matchStore.matchList">
            <n-space @click.prevent="renderMatch(index, match.gameId)">
                <n-avatar :bordered="false" :size="42" style="display:block"
                    :src="'https://game.gtimg.cn/images/lol/act/img/champion/' + match.champImgUrl"
                    fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png" />

                <n-space class=" relative! h-full!" vertical :size="[0, 0]">
                    <div class="flex gap-x-3">
                        <n-tag size="small" type="success" v-if="match.isWin" class="w-[74px]! justify-center!"
                            :bordered="false">
                            {{ match.kills }}-{{ match.deaths }}-{{ match.assists }}
                        </n-tag>
                        <n-tag size="small" type="error" v-else class="w-[74px]! justify-center!" :bordered="false">
                            {{ match.kills }}-{{ match.deaths }}-{{ match.assists }}
                        </n-tag>
                        <n-tag size="small" :type="index === curMatch ? 'warning' : 'default'"
                            :class="index === curMatch ? '' : 'text-gray-400'" :bordered="false"
                            style="width: 46px;justify-content: center;cursor: default !important;">

                            <div class="flex items-center gap-x-1">
                                <n-icon size="14">
                                    <ThumbsUpOutline v-if="match.kda >= 5" />
                                    <ThumbsDownOutline v-else />
                                </n-icon>
                                {{ match.kda }}
                            </div>

                        </n-tag>
                    </div>
                    <div class="flex justify-between absolute w-full" style="bottom: -3px">
                        <div class="flex justify-between" style="width: 73px;">
                            <text class="text-xs text-gray-400">{{ match.matchTime }}</text>
                            <text class="text-xs text-gray-400">{{ match.startTime }}</text>
                        </div>
                        <text class="text-xs text-gray-400">{{ match.gameModel }}</text>
                    </div>
                </n-space>
            </n-space>
        </n-list-item>
    </n-list>
</template>


<script lang="ts" setup>
import { NAvatar, NSpace, NTag, NList, NListItem, NIcon } from "naive-ui";
import { ThumbsUpOutline, ThumbsDownOutline } from "@vicons/ionicons5";
import useMatchStore from "../store";
import { ref, watch } from "vue";

const matchStore = useMatchStore();
const curMatch = ref(0);

watch(() => matchStore.matchList, () => {
    curMatch.value = 0;
});

const renderMatch = (index: number, gameId: number) => {
    curMatch.value = index;
    matchStore.getMatchDetail(gameId);
};
</script>
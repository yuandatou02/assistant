<template>
    <div class="flex gap-x-3 w-[290px]">
        <!-- 头像 -->
        <div class=" relative cursor-pointer">
            <n-avatar :bordered="false" :size="50"
                :src="'https://game.gtimg.cn/images/lol/act/img/champion/' + summoner.champImgUrl"
                fallback-src="https://wegame.gtimg.com/g.26-r.c2d3c/helper/lol/assis/images/resources/usericon/4027.png"
                style="display: block;" />
            <div :class="isOne ? 'champAvatarColorRed champLevel' : 'champAvatarColorBlue champLevel'">
                {{ summoner.champLevel }}
            </div>
        </div>
        <div class="grow flex flex-col justify-between">
            <!-- 装备 -->
            <div class="flex justify-between">
                <img class="itemClass" v-for="url in summoner.items" :src="getItemImgUrl(url)" alt="装备">
            </div>
            <!-- 召唤师昵称 -->
            <div class="flex justify-between">
                <div class="nameDiv"
                    :class="summonerId === summoner.accountId ? 'nameDiv currentSumColor slideSum' : 'nameDiv text-gray-400'">
                    <n-ellipsis class="max-w-[170px]!">
                        {{ summoner.name }}
                    </n-ellipsis>
                </div>
                <n-tag class="w-[59px]! justify-center!" size="tiny" :bordered="false">
                    {{ summoner.kills }}-{{ summoner.deaths }}-{{ summoner.assists }}
                </n-tag>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { SummonerDetailInfo } from "@/lcu/types/MatchLcuTypes";
import { getItemImgUrl } from "@/lcu/utils";
import { NAvatar, NEllipsis, NTag } from "naive-ui";

defineProps<{ summoner: SummonerDetailInfo, isOne: boolean, summonerId: number; }>();
</script>

<style scoped>
.champLevel {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    width: 15px;
    height: 15px;
    bottom: 0px;
    right: 0px;
    color: #ffffff;
    border-radius: 2px;
}

.currentSumColor {
    color: #f0a020;
}

.nameDiv {
    font-size: 13px;
    line-height: 16px;
}

.itemClass {
    width: 25px;
    height: 25px;
    border-radius: 3px;
}
</style>
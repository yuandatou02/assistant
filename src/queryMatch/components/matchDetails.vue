<template>
  <div class="flex flex-col justify-between mt-[17px]">
    <n-space v-for="summoner in summonerList" vertical>
      <match-sum-details
        :summoner="summoner"
        :is-one="isOne"
        :summoner-id="summonerId"
      />
      <!-- 数据显示 -->
      <div class="progressDivP">
        <n-tag
          class="h-[26px]! w-[50px]! justify-center! text-gray-400!"
          size="small"
          :bordered="false"
        >
          {{ summoner[showMode] }}
        </n-tag>
        <div class="flex grow flex-col h-full justify-between">
          <div class="matchIconImgDiv">
            <!-- 召唤师技能 -->
            <img
              class="itemClassSecond"
              :src="getspellImgUrl(summoner.spell1Id)"
              alt="召唤师技能1"
            />
            <img
              class="itemClassSecond"
              :src="getspellImgUrl(summoner.spell2Id)"
              style="margin-right: 5px"
              alt="召唤师技能2"
            />
            <n-popover
              v-for="icon in getIconImg(
                summoner.iconList,
                summoner.isMvp,
                summoner.isWin
              )"
              :show-arrow="false"
              style="padding: 2px 6px; font-size: 13px"
              trigger="hover"
            >
              <template #trigger>
                <img class="matchIconImg" :src="icon[1]" />
              </template>
              <span>{{ icon[0] }}</span>
            </n-popover>
          </div>
          <p
            :style="'width:' + summoner.showDataDict[showMode]"
            :key="showMode"
            :class="
              isOne
                ? 'scale-in-hor-left champAvatarColorRed progressP'
                : 'scale-in-hor-left champAvatarColorBlue progressP'
            "
          />
        </div>
      </div>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
import type { SummonerDetailInfo } from "@/lcu/types/MatchLcuTypes";
import matchSumDetails from "./matchSumDetails.vue";
import { NSpace, NTag, NPopover } from "naive-ui";
import { getspellImgUrl } from "@/lcu/utils";
import { getIconImg } from "../utils/tools";

defineProps<{
  summonerList: SummonerDetailInfo[];
  isOne: boolean;
  summonerId: number;
  showMode: string;
}>();
</script>

<style scoped>
.matchIconImgDiv {
  display: flex;
  align-items: flex-end;
  gap: 5px;
}

.progressDivP {
  width: 290px;
  height: 26px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  gap: 12px;
  align-items: flex-end;
  position: relative;
}

.itemClassSecond {
  width: 15px;
  height: 15px;
  border-radius: 2.5px;
}

.matchIconImg {
  height: 12px;
  padding-bottom: 1px;
}

.progressP {
  height: 6px;
  border-radius: 1px;
  margin: 0px;
}
</style>

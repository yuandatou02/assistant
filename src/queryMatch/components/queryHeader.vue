<template>
  <div class="flex">
    <div class="flex gap-x-2 items-center mr-3">
      <img src="@/assets/icon/app-icon.png" alt="app-icon" class="h-10" draggable="false" />
      <img src="@/assets/icon/Frank.png" alt="frank" draggable="false" />
      <n-button v-if="false" size="small" class="ml-7.5! text-[#666666]! w-[90.41px]!" secondary type="tertiary"> lolfrank.cn </n-button>
      <n-button v-else size="small" class="ml-7.5! w-[90.41px]!" secondary type="info"> 返回 </n-button>
    </div>
    <div class="grow flex items-center gap-x-3">
      <n-button size="small" secondary type="tertiary" :bordered="false" class="w-35.25! text-[#666666]! text-[13.5px]!" text>
        仅显示玩家战绩数据
      </n-button>
      <n-button size="small" :bordered="false" @click.prevent="refreshPage" type="success" class="w-11.5! px-2.25!"> 刷新 </n-button>
      <n-select
        size="small"
        v-model:value="selectVal"
        :disabled="inputVal !== ''"
        @update:value="changeMatchMode"
        :options="options"
        class="w-25! ml-7!"
      />
      <n-pagination v-model:page="pageVal" @update-page="pageChange" :page-slot="10" :page-count="12" />
    </div>
    <n-space class="pt-2.5!" :size="[8, 0]">
      <n-button @click.prevent="handleMin" text>
        <n-icon size="20">
          <circle-minus />
        </n-icon>
      </n-button>
      <n-button text circle @click.prevent="handleClose">
        <n-icon size="20">
          <circle-x />
        </n-icon>
      </n-button>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { NButton, NIcon, NPagination, NSelect, NSpace } from "naive-ui";
import { CircleMinus, CircleX } from "@vicons/tabler";
import { ref } from "vue";
import { getCurrentWindow } from "@tauri-apps/api/window";

const inputVal = ref("");
const selectVal = ref(0);
const pageVal = ref(1);
const options = [
  {
    label: "全部模式",
    value: 0,
  },
  {
    label: "单双排位",
    value: 420,
  },
  {
    label: "灵活排位",
    value: 440,
  },
  {
    label: "匹配模式",
    value: 430,
  },
  {
    label: "极地乱斗",
    value: 450,
  },
  {
    label: "斗魂竞技",
    value: 1700,
  },
];

const refreshPage = () => {
  // todo: 刷新页面
};

const changeMatchMode = () => {
  // todo: 切换模式
};
const pageChange = (_page: number) => {
  // todo: 切换页码
};
const handleMin = async () => {
  await getCurrentWindow().minimize();
};

const handleClose = async () => {
  await getCurrentWindow().close();
};
</script>

<style scoped></style>

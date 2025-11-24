<template>
  <header class="flex">
    <div class="flex gap-x-2 items-center mr-3">
      <img src="@/assets/icon/app-icon.png" class="h-10" draggable="false" alt="应用图标" />
      <img src="@/assets/icon/Frank.png" draggable="false" alt="应用名称" />
      <n-button v-if="false" size="small" class="ml-[30px] w-[90.41px] text-[#666666]" secondary type="tertiary">
        lolfrank.cn
      </n-button>
      <n-button v-else size="small" class="ml-[30px] w-[90.41px]" secondary type="info">
        Back Self
      </n-button>
    </div>
    <div class="grow flex items-center gap-x-3">
      <n-button size="small" secondary type="tertiary" :bordered="false"
        class="w-[141px]! text-[#666666]! text-[13.5px]!">
        仅显示玩家战绩数据
      </n-button>
      <n-button size="small" :bordered="false" type="success" class="w-[46px]! px-[9px]!" @click.prevent="refreshPage">
        刷新
      </n-button>
      <n-select v-model:value="selectVal" :disabled="inputVal !== ''" size="small" class="w-[100px]! ml-7!"
        :options="options" />
      <n-pagination v-model:page="pageVal" @update-page="pageChange" :page-slot="10" :page-count="10" />
    </div>
    <n-space class="pt-2.5!" :size="[8, 0]">
      <n-button text @click.prevent="handleMinimize">
        <n-icon size="20">
          <RemoveCircleOutline />
        </n-icon>
      </n-button>
      <n-button text circle @click.prevent="handleSet">
        <n-icon size="20">
          <SettingsOutline />
        </n-icon>
      </n-button>
      <n-button text circle @click.prevent="handleCloseWindow">
        <n-icon size="20">
          <CloseCircleOutline />
        </n-icon>
      </n-button>
    </n-space>
  </header>
</template>

<script lang="ts" setup>
import {
  NButton,
  NSelect,
  NPagination,
  NAlert,
  NModal,
  NCard,
  useMessage,
  NIcon,
  NSpace,
  MessageReactive,
} from "naive-ui";
import {
  RemoveCircleOutline,
  SettingsOutline,
  CloseCircleOutline,
} from "@vicons/ionicons5";
import { getCurrentWindow } from "@tauri-apps/api/window";
import useMatchStore from "../store";
import { ref } from "vue";

const matchStore = useMatchStore();
const pageVal = ref(1);
const selectVal = ref(0);
const inputVal = ref('');

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

const message = useMessage();

const handleMinimize = async () => {
  await getCurrentWindow().minimize();
};
const handleSet = () => {
  message.info("无效按钮，或许起到了造型上的作用");
};
const handleCloseWindow = async () => {
  await getCurrentWindow().close();
};

const refreshPage = async () => {
  pageVal.value = 1;
  await matchStore.init();
};

const pageChange = (page: number) => {
  if (selectVal.value === 0) {
    matchStore.getMatchList(page);
  }
};
</script>

<template>
  <header class="flex justify-between items-center h-8 mb-2 relative">
    <div data-tauri-drag-region class="dragDiv" />
    <div class="flex items-center">
      <img src="@/assets/icon/app-icon.png" alt="app-icon" class="h-8" draggable="false" />
      <img src="@/assets/icon/Frank.png" draggable="false" class="pl-1 h-6.25" alt="frank" />
    </div>
    <div class="flex mt-0.5 gap-x-2">
      <n-button v-if="isShowNoticeIcon" :focusable="false" @click.prevent="showDialog" text>
        <n-icon size="20" :color="'#f0a020'">
          <bulb />
        </n-icon>
      </n-button>
      <n-button :focusable="false" @click.prevent="handleMinimize" text>
        <n-icon size="20">
          <circle-minus />
        </n-icon>
      </n-button>
      <n-button :focusable="false" text circle @click.prevent="isShowDrawer = true">
        <n-icon size="20">
          <settings />
        </n-icon>
      </n-button>
      <n-button :focusable="false" @click.prevent="handleConfirm" text circle>
        <n-icon size="20">
          <circle-x />
        </n-icon>
      </n-button>
    </div>
  </header>
  <n-drawer class="rounded-t-lg!" v-model:show="isShowDrawer" :placement="'bottom'" :auto-focus="false" height="580">
    <setting />
  </n-drawer>
</template>

<script setup lang="ts">
import { h, onMounted, ref } from "vue";
import { NButton, NCheckbox, NDrawer, NIcon, NSpace, useDialog } from "naive-ui";
import { CircleMinus, Settings, CircleX, Bulb } from "@vicons/tabler";
import Setting from "@/main/components/setting.vue";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { exit } from "@tauri-apps/plugin-process";
import type { ConfigSettingTypes } from "@/background/types";
import { invoke } from "@tauri-apps/api/core";
import { Notice } from "@/main/utils/notice.ts";

const isShowNoticeIcon = ref(false);
const isShowDrawer = ref(false);
const dialog = useDialog();
const { configSetting } = defineProps<{
  configSetting: ConfigSettingTypes;
}>();
const shouldCloseLOL = ref(configSetting.shouldCloseLOL);
const notice = new Notice();

const handleMinimize = async () => {
  await getCurrentWindow().minimize();
};
const handleConfirm = () => {
  dialog.error({
    title: "退出",
    // 使用 render 函数自定义内容
    content: () =>
      h(
        NSpace,
        { vertical: true },
        {
          default: () => [
            h("div", { style: { lineHeight: "1.5", minHeight: "24px" } }, "是否退出 Frank?"),
            h(
              NCheckbox,
              {
                // 绑定值
                checked: shouldCloseLOL.value,
                // 更新值的回调
                "onUpdate:checked": (val) => {
                  shouldCloseLOL.value = val;

                  const config: ConfigSettingTypes = JSON.parse(localStorage.getItem("configSetting") as string);
                  config.shouldCloseLOL = val;

                  localStorage.setItem("configSetting", JSON.stringify(config));
                },
              },
              { default: () => "同时关闭 LOL 客户端" },
            ),
          ],
        },
      ),
    positiveText: "确定",
    negativeText: "取消",
    autoFocus: false,
    transformOrigin: "center",
    style: "margin:8px;max-width:334px;margin-bottom:78px; border-radius:12px;",
    closable: false,
    onPositiveClick: () => {
      exit(1);
      if (shouldCloseLOL.value) {
        invoke("close_lol_client");
      }
    },
    onNegativeClick: () => {},
  });
};

onMounted(() => {
  notice.init().then((v) => {
    if (v) {
      isShowNoticeIcon.value = true;
    }
  });
});

const showDialog = () => {
  notice.showDialog();
};
</script>

<style scoped></style>

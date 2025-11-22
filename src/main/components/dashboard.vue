<template>
    <header class=" flex justify-between items-center h-8 mb-2 relative">
        <div data-tauri-drag-region class="dragDiv"></div>
        <div class=" flex items-center">
            <img src="@/assets/icon/app-icon.png" class=" h-8" alt="应用图标">
            <img src="@/assets/icon/Frank.png" draggable="false" class=" pl-1 h-[25px]" alt="应用名称">
        </div>
        <div class=" flex mt-0.5 gap-x-2">
            <n-button v-if="isShowNoticeIcon" :focusable="false" text>
                <n-icon size="20" color="#f0a020">
                    <bulbOutline />
                </n-icon>
            </n-button>
            <!-- 最小化图标 -->
            <n-button :focusable="false" text @click.prevent="handleMinimize">
                <n-icon size="20">
                    <removeCircleOutline />
                </n-icon>
            </n-button>
        </div>
    </header>
</template>

<script lang="ts" setup>
import { NIcon, NButton, NPopconfirm, NDrawer } from "naive-ui";
import { BulbOutline, RemoveCircleOutline } from "@vicons/ionicons5";
import { ref } from "vue";
import { getCurrentWindow } from "@tauri-apps/api/window";

const isShowNoticeIcon = ref(false);

/**
 * 最小化当前窗口的处理函数
 */
const handleMinimize = async () => {
    // 定义异步函数 handleMinize
    await getCurrentWindow().minimize();
};
</script>
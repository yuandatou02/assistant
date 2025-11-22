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
            <!-- 设置图标 -->
            <n-button :focusable="false" text circle @click="isShowDrawer = true">
                <n-icon size="20">
                    <SettingsOutline />
                </n-icon>
            </n-button>
            <!-- 推出图标 -->
            <n-popconfirm @positive-click="handleClose">
                <template #trigger>
                    <n-button text circle>
                        <n-icon size="20">
                            <CloseCircleOutline />
                        </n-icon>
                    </n-button>
                </template>
                是否退出英雄联盟助手？
            </n-popconfirm>
        </div>
    </header>
</template>

<script lang="ts" setup>
import { NIcon, NButton, NPopconfirm, NDrawer } from "naive-ui";
import { BulbOutline, RemoveCircleOutline, SettingsOutline, CloseCircleOutline } from "@vicons/ionicons5";
import { ref } from "vue";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { exit } from "@tauri-apps/plugin-process";

const isShowNoticeIcon = ref(false);
const isShowDrawer = ref(false);

/**
 * 最小化当前窗口的处理函数
 */
const handleMinimize = async () => {
    // 定义异步函数 handleMinize
    await getCurrentWindow().minimize();
};

/**
 * 关闭处理函数
 * 该函数用于执行关闭操作，并异步退出程序
 */
const handleClose = async () => {
    await exit();
};
</script>
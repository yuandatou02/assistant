<template>
    <n-drawer-content body-style="padding:20px 22px" body-content-style="padding:0">
        <n-list>
            <n-list-item class=" pt-0!">
                <div class=" gap-x-5 flex justify-between items-center">
                    <n-tag :bordered="false">鼓励开发</n-tag>
                    <n-button @click.prevent="showModal = true" class="w-[186px]!" size="small" secondary
                        :bordered="false" type="warning">
                        赞助英雄联盟助手
                    </n-button>
                </div>
            </n-list-item>
            <!-- 切换主题 -->
            <n-list-item>
                <div class=" flex gap-x-5 justify-between items-center">
                    <n-tag :bordered="false">主题样式</n-tag>
                    <div class=" flex grow justify-between">
                        <n-radio :checked="theme === 'light'" name="basic-demo" value="light"
                            @click.prevent="handleThemeChange('light')">白羽清风</n-radio>
                        <n-radio :checked="theme === 'dark'" name="basic-demo" value="dark"
                            @click.prevent="handleThemeChange('dark')">幽黑星空</n-radio>
                    </div>
                </div>
            </n-list-item>
        </n-list>
    </n-drawer-content>
</template>

<script lang="ts" setup>
import { relaunch } from "@tauri-apps/plugin-process";
import { NDrawerContent, NModal, NTag, NButton, NSelect, NSwitch, NSlider, NRadio, NList, NListItem, useDialog } from "naive-ui";
import { ref } from "vue";

const showModal = ref(false);
const theme = localStorage.getItem("theme") || "light";
const dialog = useDialog();

/**
 * 处理主题变更的函数
 * @param {string} key - 主题标识符，用于指定要切换到的主题
 */
const handleThemeChange = (key: string) => {
    // 检查当前主题是否与要切换的主题不同
    if (theme !== key) {
        // 显示确认对话框，提示用户主题切换将重启应用
        dialog.warning({
            title: '提示', // 对话框标题
            content: '主题切换将重启助手, 是否执行操作?', // 对话框内容
            showIcon: true, // 是否显示图标
            positiveText: '确认', // 确认按钮文本
            negativeText: '取消', // 取消按钮文本
            maskClosable: true, // 点击遮罩是否可关闭对话框
            closable: false, // 是否显示关闭按钮
            autoFocus: false, // 是否自动聚焦到第一个按钮
            style: 'margin:8px;max-width:334px', // 对话框样式
            // 确认按钮点击事件处理函数
            onPositiveClick: async () => {
                // 根据当前主题设置相反的主题到本地存储
                theme === 'dark' ? localStorage.setItem('theme', 'light') : localStorage.setItem('theme', 'dark');
                // 执行重启操作
                await relaunch();
            }
        });
    }
};
</script>
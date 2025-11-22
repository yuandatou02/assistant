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
            <!-- 秒选英雄 -->
            <n-list-item>
                <div class=" flex gap-x-5 justify-between">
                    <n-tag :bordered="false">秒选英雄</n-tag>
                    <div class=" flex grow items-center justify-between">
                        <n-select class="w-[126px]!" size="small" v-model:value="config.autoPickChampion.championId"
                            :disabled="!config.autoPickChampion.isAuto" :options="optionsChampion" :filter="searchChamp"
                            filterable spellcheck="false" placeholder="选择英雄" @update:value="saveConfig" />
                        <n-switch v-model:value="config.autoPickChampion.isAuto" @click="saveConfig" />
                    </div>
                </div>
            </n-list-item>
            <!-- 秒禁英雄 -->
            <n-list-item>
                <div class=" flex gap-x-5 justify-between">
                    <n-tag :bordered="false">秒禁英雄</n-tag>
                    <div class=" flex grow items-center justify-between">
                        <n-select v-model:value="config.autoBanChampion.championId" filterable spellcheck="false"
                            size="small" :filter="searchChamp" :options="optionsChampion"
                            :disabled="!config.autoBanChampion.isAuto" @update:value="saveConfig" placeholder="选择英雄"
                            class="w-[126px]!" />
                        <n-switch v-model:value="config.autoBanChampion.isAuto" @click="saveConfig" />
                    </div>
                </div>
            </n-list-item>
            <!-- 秒禁/秒选英雄 是否使用一次关闭 -->
            <n-list-item>
                <div class=" gap-x-5 flex justify-between">
                    <n-tag :bordered="false">昙花一现</n-tag>
                    <div class=" flex grow items-center justify-between">
                        <n-tag :disabled="!config.autoIsOne" :type="config.autoIsOne ? 'success' : 'default'">
                            使用一次后会禁用
                        </n-tag>
                        <n-switch v-model:value="config.autoIsOne" @click="saveConfig" class="mt-0!" />
                    </div>
                </div>
                <n-tag class="mt-1.5! w-full! justify-center!" :disabled="true" :bordered="false" size="small">
                    秒选/秒禁英雄 功能使用一次后关闭
                </n-tag>
            </n-list-item>
            <!-- 游戏窗口设置 -->
            <n-list-item>
                <div class=" gap-x-5 flex justify-between">
                    <n-tag :bordered="false">游戏窗口</n-tag>
                    <div class=" flex grow items-center justify-between">
                        <n-tag :type="config.isGameInWindow ? 'success' : 'default'" :disabled="!config.isGameInWindow">
                            自动打开游戏窗口
                        </n-tag>
                        <n-switch v-model:value="config.isGameInWindow" @click="saveConfig" />
                    </div>
                </div>
                <n-tag class="mt-1.5! w-full! justify-center!" :disabled="true" :bordered="false" size="small">
                    游戏内显示战绩窗口，显示|隐藏 SHIFT+TAB
                </n-tag>
                <n-tag class="mt-1.5! w-full! justify-center!" :disabled="!config.isGameInWindow ? false : true"
                    :bordered="false" size="small">
                    关闭自动打开后，进入游戏需点击右下角图标
                </n-tag>
            </n-list-item>
            <!-- 秒接对局 -->
            <n-list-item>
                <div class=" gap-x-5 flex justify-between items-center">
                    <n-tag :bordered="false">秒接对局</n-tag>
                    <n-slider v-model:value="config.autoAccept" :step="10" @update:value="saveConfig" />
                </div>
                <n-tag class="mt-1.5! w-full! justify-center!" :disabled="true" :bordered="false" size="small">
                    数值: [ {{ '<' }}50 关闭 ] [=50 开启 ] [ {{ '=' }}60 延迟两秒 ] </n-tag>
            </n-list-item>
            <!-- 底部 -->
            <n-list-item style="padding-bottom: 0px;">
                <div class="flex justify-between items-center">
                    <n-button size="small" secondary type="tertiary">
                        版本 {{ version }}
                    </n-button>
                    <n-button size="small" secondary type="tertiary">
                        By Java_S
                    </n-button>
                    <n-button size="small" secondary type="tertiary" @click="restart">
                        重启
                    </n-button>
                </div>
            </n-list-item>
        </n-list>
        <n-modal v-model:show="showModal" class="m-2! max-w-[334px]!">
            <sponsor :is-completed="false" />
        </n-modal>
    </n-drawer-content>
</template>

<script lang="ts" setup>
import { relaunch } from "@tauri-apps/plugin-process";
import sponsor from "./sponsor.vue";
import { NDrawerContent, NModal, NTag, NButton, NSelect, NSwitch, NSlider, NRadio, NList, NListItem, useDialog } from "naive-ui";
import { ref } from "vue";
import type { ConfigSettingTypes } from "@/background/types";
import { keywordsList, optionsChampion } from "@/resources/champList";

const showModal = ref(false);
const theme = localStorage.getItem("theme") || "light";
const dialog = useDialog();
const config = ref<ConfigSettingTypes>(JSON.parse(localStorage.getItem("configSetting") as string));
declare const __APP_VERSION__: string;
const version = __APP_VERSION__;

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


/**
 * 搜索匹配函数
 * @param pattern - 搜索关键字字符串
 * @param options - 包含标签信息的选项对象
 * @returns boolean - 返回是否找到匹配项
 */
const searchChamp = (pattern: string, options: object) => {
    // 检查搜索关键字是否为空
    if (pattern === '' || pattern === null) { return false; }

    // 将关键字转换为小写并过滤匹配项
    const keyword = pattern.toLowerCase();
    const renderList = keywordsList.filter(item => item.keywords.toLowerCase().includes(keyword));

    // 限制匹配结果数量，超过5个或没有匹配项时返回false
    if (renderList.length > 5 || renderList.length === 0) {
        return false;
    }

    // 遍历匹配列表，检查是否存在与选项标签相等的名称
    for (const renderListElement of renderList) {
        if (renderListElement.name === options.label) {
            return true;
        }
    }
    return false;
};

const saveConfig = () => {
    localStorage.setItem("configSetting", JSON.stringify(config.value));
};

const restart = async () => {
    await relaunch();
};
</script>
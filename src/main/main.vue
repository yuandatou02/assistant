<template>
    <n-config-provider :locale="zhCN" :theme="theme === 'dark' ? darkTheme : null" :theme-overrides="themeOverrides">
        <n-dialog-provider>
            <n-message-provider :placement="'bottom'">
                <assistant />
            </n-message-provider>
        </n-dialog-provider>
    </n-config-provider>
</template>

<script lang="ts" setup>
import { NMessageProvider, NConfigProvider, zhCN, darkTheme, NDialogProvider } from "naive-ui";
import { themeOverrides } from "./utils/theme";
import Assistant from "./index.vue";

const theme = localStorage.getItem('theme') || 'light';
</script>

<template>
    <n-card :bordered="false" size="small" role="dialog" aria-modal="true">
        <n-alert v-if="isCompleted" title="本次多次使用助手完成对局" type="info">
            {{ sentence }} <br />[此提示每月只会弹出一次]
        </n-alert>
        <n-alert v-else title="感谢您的支持❤️" type="success">
            {{ sentence }}
        </n-alert>
        <n-collapse class="mt-4!">
            <n-collapse-item title="微信" name="1">
                <div class="flex flex-col items-center gap-1 justify-center">
                    <div class="w-[150px] h-[150px]">
                        <img class="w-full" :src="Wechat" alt="微信支付">
                    </div>
                    <n-tag class=" text-[13px]!" checkable disabled>若需要回复, 请在付款备注中, 留下您的邮箱</n-tag>
                </div>
            </n-collapse-item>
            <n-collapse-item title="支付宝" name="2">
                <div class="flex flex-col items-center gap-1 justify-center">
                    <div class="w-[150px] h-[150px]">
                        <img class="w-full" :src="Alipay" alt="支付包支付">
                    </div>
                    <n-tag class="text-[13px]!" checkable disabled>若需要回复, 请在付款备注中, 留下您的邮箱</n-tag>
                </div>
            </n-collapse-item>
        </n-collapse>
    </n-card>
</template>

<script lang="ts" setup>
import { NAlert, NCard, NCollapse, NCollapseItem, NTag } from "naive-ui";

defineProps<{ isCompleted: boolean; }>();
const sentence = '如果您觉得软件的内容有帮助，请考虑为Frank提供一点小小的赞助！您的支持，就是我追求完美代码的续航电源！！！ 😊';
const Wechat = new URL("/src/assets/matchImage/Wechat.JPEG", import.meta.url).href;
const Alipay = new URL("/src/assets/matchImage/Alipay.JPEG", import.meta.url).href;
</script>
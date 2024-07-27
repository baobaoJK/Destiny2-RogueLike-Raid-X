<script lang="ts" setup>
import { useUserStore } from '@/stores';
import { ref } from 'vue'

// 属性
const props = defineProps({
    title: {
        type: String,
        default: '输入值'
    },
})

// 基础属性
const visible = ref(false)
const valueInput = ref(0)
const dialogType = ref('')
const userStore = useUserStore()

// 输入框变化
const handleChange = (value: number) => {
    console.log(value)

    if (dialogType.value === 'money') {
        userStore.playerMoney = value
    }
    else if (dialogType.value == 'draw') {
        userStore.drawCount = value
    }
}

// 打开模态框
const open = (type: string) => {
    if (type === 'money') {
        valueInput.value = userStore.playerMoney
    }
    else if (type === 'draw') {
        valueInput.value = userStore.drawCount
    }
    dialogType.value = type
    visible.value = true
}

// 关闭模态框
const close = () => {
    visible.value = false
}

// 导出方法
defineExpose({
    open,
    close
})
</script>

<template>
    <el-dialog class="dialog value-dialog" v-model="visible" :close-on-click-modal="false" width="25rem" align-center>
        <div class="value-input-box">
            <label for="value">{{ props.title }}：</label>
            <el-input-number v-model="valueInput" :min="-100" :max="100" @change="handleChange" id="value" />
        </div>
        <div class="buttons">
            <button type="button" class="button value-cancel" @click="close">
                关闭
            </button>
        </div>
    </el-dialog>
</template>

<style lang="scss">
// 货币/抽卡次数模态框样式
.value-dialog {
    clip-path: polygon(3rem 0%, 100% 0%, 100% calc(100% - 3rem), calc(100% - 3rem) 100%, 0 100%, 0% 3rem) !important;

    .value-input-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 80%;

        label {
            color: white;
            font-size: 1.25rem;
            margin-bottom: 1rem;
        }
    }

    .buttons {
        display: flex;
        margin-top: 1rem;

        button {
            padding: 0.25rem 4em;
        }
    }
}
</style>

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
            <label for="money">{{ props.title }}：</label>
            <el-input-number v-model="valueInput" :min="-100" :max="100" @change="handleChange" id="money" />
        </div>
        <div class="buttons">
            <button type="button" class="button money-cancel" @click="close">
                取消
            </button>
        </div>
    </el-dialog>
</template>

<style lang="scss" scoped></style>

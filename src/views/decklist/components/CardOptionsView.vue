<script lang="ts" setup>
import { useUserStore } from '@/stores';
import { deckType, deleteCard, getCardTypeName, saveCard } from '@/utils';
import { ref, watch } from 'vue'

// 属性
defineProps({
    title: {
        type: String,
        default: '输入值'
    },
})

// 基础属性
const visible = ref(false)
const optionsTitles = ref()
const dialogType = ref()
const userStore = useUserStore()
const data = ref()
const value: any = ref([])

const exportValue = ref()
const importValue = ref()

// 获取玩家列表卡牌
const getPlayerDeckList = () => {
    const data: any = []

    for (let i = 0; i < 8; i++) {
        userStore.deckList[deckType[i]].forEach((item: any) => {
            data.push({
                key: item,
                label: `${item.cardName}-(${getCardTypeName(item.type)})`,
            })
        })
    }
    return data
}
// 导入卡牌
const importCard = () => {
    if (value.value.length !== 0) {
        value.value.forEach((card: any) => {
            saveCard(card)
        })
    }

    data.value = []
    value.value = []
    importValue.value = ''
}
const changeText = () => {

    let deckList: any = []
    if (importValue.value != '') {
        try {
            deckList = JSON.parse(importValue.value)
        }
        catch (error) {
            console.error(error)
            deckList = []
            data.value = []
        }

        if (deckList.length !== 0) {
            data.value = []
            deckList.forEach((card: any) => {
                data.value.push({
                    key: card,
                    label: `${card.cardName}-(${getCardTypeName(card.type)})`
                })
            });
        }
    }
    else {
        data.value = []
    }

    console.log(data.value)
}

// 导出卡牌
const exportCard = () => {
    console.log(value.value)

    for (let i = 0; i < value.value.length; i++) {
        deleteCard(value.value[i])
    }
    // JSON 转换字符串
    exportValue.value = JSON.stringify(value.value)

    data.value = getPlayerDeckList()
}

// 打开模态框
const open = (type: string) => {
    if (type === 'import') {
        data.value = []
        dialogType.value = 'import'
        optionsTitles.value = ['卡牌列表', '导入列表']
    }
    else if (type === 'export') {
        data.value = getPlayerDeckList()
        dialogType.value = 'export'
        optionsTitles.value = ['卡牌列表', '导出列表']
    }
    visible.value = true
}

// 关闭模态框
const close = () => {
    visible.value = false
    data.value = []
    value.value = []
    exportValue.value = ''
    importValue.value = ''
}

// 导出方法
defineExpose({
    open,
    close
})

// 监听
watch(importValue, () => {
    changeText()
})
</script>

<template>
    <el-dialog class="dialog card-options-dialog" v-model="visible" :close-on-click-modal="false" width="60rem"
        align-center>
        <div class="title-box">
            <h1>{{ title }}</h1>
            <p v-if="dialogType === 'export'">点击导出卡牌后，复制下面的输入框内容发送给队友即可</p>
            <p v-else>复制队友发送过来的内容到下面的输入框，点击导入卡牌即可</p>
        </div>
        <div class="card-options-box">
            <el-transfer v-model="value" :data="data" :titles="optionsTitles" :button-texts="['移除', '添加']" />
            <el-input v-if="dialogType === 'export'" v-model="exportValue" placeholder="导出卡牌信息"></el-input>
            <el-input v-else v-model="importValue" placeholder="导入卡牌信息"></el-input>
        </div>
        <div class="buttons">

            <button type="button" class="button export-button" @click="exportCard"
                v-if="dialogType === 'export'">导出卡牌</button>
            <button type="button" class="button export-button" @click="importCard" v-else>导入卡牌</button>
            <button type="button" class="button cancel-button" @click="close">
                关闭
            </button>
        </div>
    </el-dialog>
</template>

<style lang="scss" scoped>
.card-options-dialog {

    .title-box {
        text-align: center;
        margin-bottom: 2rem;

        h1 {
            font-size: 2rem;
            letter-spacing: 1rem;
            margin-left: 1rem;
            margin-bottom: 1rem
        }

        p {
            font-size: 1.25rem;
            letter-spacing: 0.5rem;
            margin-left: 0.5rem;
        }
    }

    .card-options-box {
        margin-bottom: 2rem;
        background-color: white;
    }

}
</style>

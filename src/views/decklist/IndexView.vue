<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useDeckListStore, useUserStore } from '@/stores'
import { storeToRefs } from 'pinia';
import TipsView from "@/components/tips/IndexView.vue"
import CardOptionsView from './components/CardOptionsView.vue'
import InfoBoard from '@/components/infoboard/IndexView.vue'
import {
  getPlayerDeckListType,
  shuffle,
  deckType,
  cardTypeListName,
  deleteCard,
  saveCard,
  cardImg,
  randomCard
} from '@/utils'

// 用户信息
const { deckList, infoBoard, torture, program, drawCount, playerMoney } = storeToRefs(useUserStore())

// 卡池信息
const {
  microGain,
  microGainCount,
  strongGain,
  strongGainCount,
  opportunity,
  opportunityCount,
  microDiscomfort,
  microDiscomfortCount,
  strongDiscomfort,
  strongDiscomfortCount,
  unacceptable,
  unacceptableCount,
  technology,
  technologyCount,
  support,
  supportCount,
} = storeToRefs(useDeckListStore())


// 提示框
const tipsRef = ref()
const tooltipShow = ref(false)
const tooltipConfig: any = ref({
  itemName: '',
  itemKind: '',
  itemRarity: '',
  itemDescription: '',
  itemCount: 0,
  itemAllCount: 1,
  itemIdea: ''
})

// 显示提示框
const showTooltip = (card: any, index: number) => {
  tooltipShow.value = true

  tooltipConfig.value.itemName = card.cardName
  tooltipConfig.value.itemKind = `${cardTypeListName[index]}`
  tooltipConfig.value.itemRarity = '史诗'
  tooltipConfig.value.itemDescription = card.description
  tooltipConfig.value.itemCount = computed(() => card.count)
  tooltipConfig.value.itemIdea = card.idea

  tipsRef.value.setToolTips(card)
}

//  关闭提示框
const hideTooltip = () => {
  tooltipShow.value = false
}

// 激活的 tabs 名称
const activeName = ref(cardTypeListName[0])

// 获取玩家卡牌
const getCardCount = () => {
  let count = 0
  for (let i = 0; i < deckType.length; i++) {
    deckList.value[deckType[i]].forEach((item: any) => {
      if (item != null) {
        count += 1
      }
    });
  }

  return count === 0 ? true : false
}

// 卡组
const allDeckList = ref()

// 提示框
const cardDialogVisible = ref(false)
const shuffleDialogVisible = ref(false)
const randomDialogVisible = ref(false)

const allDeck = ref()
const allDeckCount = ref()

// 删除卡牌
const deleteCardButton = (card: any) => {
  // 苦肉计
  if (torture.value && (card.type === deckType[0] || card.type === deckType[1])) {
    drawCount.value += 2
    ElMessage({
      message: '已触发苦肉计，获取 2 次抽卡机会',
      type: 'success',
      grouping: true
    })
  }

  // 卡牌回收计划
  if (program.value) {
    let str = ''
    if (card.type === deckType[0]) {
      playerMoney.value += 1
      str = '您已出售微弱增益卡牌，获得 1 货币'
    }

    if (card.type === deckType[1]) {
      playerMoney.value += 3
      str = '您已出售强大增益卡牌，获得 3 货币'
    }

    if (card.type === deckType[2]) {
      playerMoney.value += 6
      str = '您已出售欧皇增益卡牌，获得 6 货币'
    }

    ElMessage({
      message: str,
      type: 'success',
      grouping: true
    })
  }

  deleteCard(card)
}

// 添加卡牌
const addCardButton = () => {
  cardDialogVisible.value = true
  // console.log(deckList.value)
}
const addCard = (card: any) => {
  saveCard(card)
}

// 打乱卡牌
const shuffleCardButton = () => {
  const tempDeckList: any[] = []

  deckType.forEach((item) => {
    const tempList = getPlayerDeckListType(item)

    tempList.forEach((card: any) => {
      tempDeckList.push(card)
    })
  })

  allDeck.value = tempDeckList

  if (allDeck.value.length == 0) {
    ElMessage({
      message: '你当前没有卡牌可以打乱',
      grouping: true,
      type: 'success'
    })
    return
  }

  allDeck.value = shuffle(allDeck.value)
  shuffleDialogVisible.value = true
}

const cardOptionsRef = ref()
const cardOptionsTitle = ref('')

// 导入卡牌
const importCardButton = () => {
  cardOptionsTitle.value = '导入卡牌'
  cardOptionsRef.value.open('import')
}

// 导出卡牌
const exportCardButton = () => {
  cardOptionsTitle.value = '导出卡牌'
  cardOptionsRef.value.open('export')
}

// 随机卡牌
const randomCardButton = () => {
  randomDialogVisible.value = true
}


// 初始化
const initDeckList = () => {
  allDeckList.value = [
    microGain,
    strongGain,
    opportunity,
    microDiscomfort,
    strongDiscomfort,
    unacceptable,
    technology,
    support
  ]

  allDeckCount.value = [
    microGainCount,
    strongGainCount,
    opportunityCount,
    microDiscomfortCount,
    strongDiscomfortCount,
    unacceptableCount,
    technologyCount,
    supportCount
  ]

  // 苦肉计
  if (torture.value) {
    ElMessage({
      message: `苦肉计已生效，你可以选择失去一张增益卡牌换取两次抽卡机会`,
      duration: 0,
      showClose: true
    })
  }

  // 卡牌回收计划
  if (program.value) {
    ElMessage({
      message: `卡牌回收计划已生效，你可以售卖你多余的增益卡牌，微弱增益 1 个货币，强大增益 3 个货币，欧皇增益 6 个货币`,
      duration: 0,
      showClose: true
    })
  }
}

initDeckList()
</script>

<template>
  <div id="decklist" @mousemove="tipsRef.moveTooltip($event)">

    <!-- 提示框 -->
    <TipsView ref="tipsRef" :tooltipShow="tooltipShow">
      <template #header>
        <div class="name">{{ tooltipConfig.itemName }}</div>
        <div class="type">
          <div class="kind">{{ tooltipConfig.itemKind }}</div>
          <div class="rarity">{{ tooltipConfig.itemRarity }}</div>
        </div>
      </template>
      <template #main>
        <div class="description">
          <div class="text">
            <p class="type">{{ tooltipConfig.itemDescription }}</p>
            <p v-if="tooltipConfig.itemIdea !== 'D2RRX'">
              想法来源：{{ tooltipConfig.itemIdea }}
            </p>
          </div>
        </div>
        <div class="line"></div>
        <div class="monetary">
          <div class="name">
            <img class="card" :src="cardImg" alt="cardImg.png" />
            <p>卡池剩余</p>
          </div>
          <div class="info">
            <p class="text">
              <span class="count">{{ tooltipConfig.itemCount }}</span> /
              <span class="all-count">{{ tooltipConfig.itemAllCount }}</span>
            </p>
          </div>
        </div>
      </template>
    </TipsView>

    <div class="decks">
      <div class="deck-top">
        <h1 class="deck-title">持有卡牌</h1>
        <div class="deck-options">
          <button class="button get-button" @click="addCardButton()">卡牌选取</button>
          <button class="button shuffle-button" @click="shuffleCardButton()">打乱卡牌顺序</button>
          <button class="button import-button" @click="exportCardButton()">卡牌导出</button>
          <button class="button export-button" @click="importCardButton()">卡牌导入</button>
          <button class="button random-button" @click="randomCardButton()">抽取随机卡牌</button>
          <!-- <button class="button" @click="useDeckListStore().getDeckList()">重置卡牌列表</button> -->
        </div>
        <hr class="deck-line" />
      </div>

      <div class="card-list" v-if="getCardCount()">
        <h2 class="deck-title">你当前没有卡牌</h2>
      </div>
      <div class="card-list" v-for="(deck, name, index) in deckList" :key="index">
        <div class="card-list-header" :style="{ display: deck.length === 0 ? 'none' : 'block' }">
          <h2 class="deck-title">
            {{ cardTypeListName[index] }} - 持有 {{ deck.length }} 张
          </h2>
          <hr class="deck-line" />
        </div>

        <div class="card-item" v-for="card in deck" :key="card.id">
          <div class="card" v-if="deck.length != 0">
            <div class="card-info">
              <div>
                <p class="card-name">- {{ card.cardName }} -</p>
                <p class="card-sub">- {{ card.name }} -</p>
              </div>
              <div>
                <p class="card-text">{{ card.description }}</p>
                <hr v-if="card.idea !== 'D2RRX'">
                <p v-if="card.idea !== 'D2RRX'">想法来源：{{ card.idea }}</p>
              </div>
            </div>
          </div>
          <button class="button delete-button" @click="deleteCardButton(card)">
            删除
          </button>
        </div>
      </div>
    </div>

    <!-- 卡牌选取模态框 -->
    <el-dialog class="dialog card-dialog" v-model="cardDialogVisible" :close-on-click-modal="false" width="75.25rem"
      align-center>
      <h1 class="title">卡牌选取</h1>

      <div class="box card-list-box">
        <el-tabs v-model="activeName" class="card-tabs">
          <el-tab-pane v-for="(deckList, index) in allDeckList" :key="index"
            :label="cardTypeListName[index] + '-(' + deckList.value.length + '张)'" :name="cardTypeListName[index]">
            <el-scrollbar height="25rem" native
              view-style="display: flex; flex-wrap: wrap; justify-content: center; width: 65rem; overfloy-x: hidden;">
              <div class="item card-item" v-for="(card, index2) in deckList.value" :key="index2"
                @mousemove="showTooltip(card, index)" @mouseout="hideTooltip()">
                <div class="card" @click="addCard(card)">
                  <div class="info card-info">
                    <div>
                      <p class="card-name">{{ card.name }}</p>
                      <p class="card-sub">{{ card.cardName }}</p>
                    </div>
                    <div>
                      <p class="card-level">卡牌等级：T{{ card.tagLevel }}</p>
                      <p class="card-description">卡池剩余：{{ card.count }} 张</p>
                    </div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </div>

      <button type="button" class="button card-cancel card-close" @click="cardDialogVisible = false">
        取消
      </button>
    </el-dialog>

    <!-- 打乱顺序 -->
    <el-dialog class="dialog shuffle-dialog" v-model="shuffleDialogVisible" :close-on-click-modal="false"
      width="75.25rem" align-center>
      <h1 class="title">打乱顺序</h1>
      <div class="box shuffle-list-box">
        <div class="item shuffle-item" v-for="(card, index) in allDeck" :key="index">
          <div class="card">
            <div class="info shuffle-info">
              <p class="card-id">{{ card.name }}</p>
              <p class="card-name">{{ card.cardName }}</p>
              <p class="card-name">- {{ index + 1 }} -</p>
            </div>
          </div>
        </div>
      </div>
      <button type="button" class="button shuffle-cancel" @click="shuffleDialogVisible = false">
        取消
      </button>
    </el-dialog>

    <!-- 获取随机卡帕 -->
    <el-dialog class="dialog random-dialog" v-model="randomDialogVisible" :close-on-click-modal="false" width="75.25rem"
      align-center>
      <h1 class="title">随机抽取卡牌</h1>
      <div class="box random-list-box">
        <div class="item random-item" v-for="(type, index) in cardTypeListName" :key="index">
          <div class="card" @click="randomCard(1, index, false)">
            <div class="info random-info">
              <p>抽取一张</p>
              <p class="card-id">{{ type }}</p>
            </div>
          </div>
        </div>
      </div>
      <button type="button" class="button random-cancel" @click="randomDialogVisible = false">
        取消
      </button>
    </el-dialog>

    <!-- 卡牌操作模态框 -->
    <CardOptionsView ref="cardOptionsRef" :title="cardOptionsTitle">
    </CardOptionsView>

    <!-- 持有卡牌帮助信息版 -->
    <InfoBoard type="right" :show-info-board="infoBoard.gameDeckList">
      <template #close-button>
        <div class="close-button">
          <a @click="infoBoard.gameDeckList = !infoBoard.gameDeckList">{{ infoBoard.gameDeckList ? "关闭" : "查看手牌说明"
            }}</a>
        </div>
      </template>
      <template #title>
        <h1 class="title">
          持有卡牌说明
        </h1>
      </template>
      <template #content>
        <div>
          <p>如果 微弱不适 和 重度不适卡牌有冲突，则优先执行 重度不适卡牌 的描述</p>
          <hr>
          <p>在这里你可以进行以下操作</p>
          <p>卡牌导出</p>
          <p>卡牌导入</p>
          <p>打乱卡牌顺序</p>
          <p>选取卡牌</p>
          <p>从某个卡牌类型中随机抽取一张</p>
          <p>查看各个卡牌的描述信息</p>
          <p>查看卡牌在卡池的数量</p>
        </div>
      </template>
    </InfoBoard>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/decklist';
</style>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useDeckListStore, useUserStore } from '@/stores'
import { getDeckListType, getPlayerDeckListType, shuffle, deckType } from '@/utils'

// 卡牌类型名称
const cardTypeListName = [
  '微弱增益',
  '强大增益',
  '欧皇增益',
  '微弱不适',
  '重度不适',
  '反人类',
  '特殊卡牌',
  '辅助卡牌'
]

// 卡组
const playerDeckList = ref()
const deckList = ref()

// 提示框
const cardDialogVisible = ref(false)
const randomDialogVisible = ref(false)

const allDeck = ref()

// 删除卡牌
const deleteCardButton = (card: any, typeIndex: string | number, index: string | number) => {
  // deleteCard(card)
  playerDeckList.value[typeIndex].value.splice(index, 1)
}

// 添加卡牌
const addCardButton = () => {
  const deckListStore = useDeckListStore()
  deckList.value = {
    MicroGain: deckListStore.microGain,
    StrongGain: deckListStore.strongGain,
    Opportunity: deckListStore.opportunity,
    MicroDiscomfort: deckListStore.microDiscomfort,
    StrongDiscomfort: deckListStore.strongDiscomfort,
    Unacceptable: deckListStore.unacceptable,
    Technology: deckListStore.technology,
    Support: deckListStore.support
  }

  cardDialogVisible.value = true

  console.log(deckList.value)
}
const addCard = (card: any, index: string | number) => {
  const userStore = useUserStore()

  const type = card.type
  const deckList = getDeckListType(type)

  for (let i = 0; i < deckList.length; i++) {
    if (deckList[i].id == card.id) {
      deckList[i].count = 0
      card = deckList[i]
      userStore.deckList[type].push(card)
      break
    }
  }

  ElMessage({
    message: '你已添加 - ' + card.cardName + ' - 卡牌',
    grouping: true,
    type: 'success'
  })
}

// 打乱卡牌
const randomCardButton = () => {
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
  randomDialogVisible.value = true
}

// 初始化
const initDeckList = () => {
  // 读取存档
  const userStore = useUserStore()

  // 卡组
  const microGainDeckList = ref(userStore.deckList.MicroGain)
  const strongGainDeckList = ref(userStore.deckList.StrongGain)
  const opportunityDeckList = ref(userStore.deckList.Opportunity)
  const microDiscomfortDeckList = ref(userStore.deckList.MicroDiscomfort)
  const strongDiscomfortDeckList = ref(userStore.deckList.StrongDiscomfort)
  const unacceptableDeckList = ref(userStore.deckList.Unacceptable)
  const technologyDeckList = ref(userStore.deckList.Technology)
  const supportDeckList = ref(userStore.deckList.Support)
  playerDeckList.value = [
    microGainDeckList,
    strongGainDeckList,
    opportunityDeckList,
    microDiscomfortDeckList,
    strongDiscomfortDeckList,
    unacceptableDeckList,
    technologyDeckList,
    supportDeckList
  ]

  // 卡组添加
  const microGainList: any = ref([])
  const strongGainList: any = ref([])
  const opportunityList: any = ref([])
  const microDiscomfortList: any = ref([])
  const strongDiscomfortList: any = ref([])
  const unacceptableList: any = ref([])
  const technologyList: any = ref([])
  const supportList: any = ref([])
  deckList.value = [
    microGainList,
    strongGainList,
    opportunityList,
    microDiscomfortList,
    strongDiscomfortList,
    unacceptableList,
    technologyList,
    supportList
  ]
}

initDeckList()
</script>

<template>
  <div id="decklist">
    <div class="decks">
      <div class="deck-top">
        <h1 class="deck-title">持有卡牌</h1>
        <div class="deck-options">
          <button class="button get-button" @click="addCardButton()">卡牌选取</button>
          <button class="button random-button" @click="randomCardButton()">打乱卡牌顺序</button>
        </div>
        <hr class="deck-line" />
      </div>

      <div class="card-list" v-for="(deck, index) in playerDeckList" :key="index">
        <div class="card-list-header">
          <h2 class="deck-title">
            {{ cardTypeListName[index] }} - 持有 {{ deck.value.length }} 张
          </h2>
          <hr class="deck-line" />
        </div>

        <div class="card-item" v-for="(card, index2) in deck.value" :key="index2">
          <div class="card">
            <div class="card-info">
              <div>
                <p class="card-name">- {{ card.cardName }} -</p>
                <p class="card-sub">- {{ card.name }} -</p>
              </div>
              <p class="card-text">{{ card.description }}</p>
            </div>
          </div>
          <button class="button delete-button" @click="deleteCardButton(card, index, index2)">
            删除
          </button>
        </div>
      </div>
    </div>

    <!-- 卡牌选取模态框 -->
    <el-dialog
      class="dialog card-dialog"
      v-model="cardDialogVisible"
      :close-on-click-modal="false"
      width="75.25rem"
      align-center
    >
      <h1 class="title">卡牌选取</h1>

      <div class="box card-list-box">
        <div class="card-list" v-for="(deck, deckType, index) in deckList" :key="index">
          <div class="card-list-header">
            <h2 class="deck-title">{{ cardTypeListName[index] }} - {{ deck.length }} 张</h2>
            <hr class="deck-line" />
          </div>

          <div class="item card-item" v-for="(card, index2) in deck" :key="index2">
            <div class="card" @click="addCard(card, index)">
              <div class="info card-info">
                <div>
                  <p class="card-name">{{ card.name }}</p>
                  <p class="card-sub">{{ card.cardName }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="button card-cancel card-close"
        @click="cardDialogVisible = false"
      >
        取消
      </button>
    </el-dialog>

    <!-- 打乱顺序 -->
    <el-dialog
      class="dialog random-dialog"
      v-model="randomDialogVisible"
      :close-on-click-modal="false"
      width="75.25rem"
      align-center
    >
      <h1 class="title">打乱顺序</h1>
      <div class="box random-list-box">
        <div class="item random-item" v-for="(card, index) in allDeck" :key="index">
          <div class="card">
            <div class="info random-info">
              <p class="card-id">{{ card.name }}</p>
              <p class="card-name">{{ card.cardName }}</p>
              <p class="card-name">- {{ index + 1 }} -</p>
            </div>
          </div>
        </div>
      </div>
      <button type="button" class="button random-cancel" @click="randomDialogVisible = false">
        取消
      </button>
    </el-dialog>
  </div>
</template>

<style lang="scss">
@import '@/assets/styles/decklist';
</style>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
import { deckType } from '@/utils'

// 玩家事件
const playerEventList = ref()

// 抽卡模态框
const deckDialogVisible = ref(false)

// 属性
const eventFlipList: any = ref([])
const eventTitle = ref('当前没有事件')
const deckListText = ref('')

const dangerDeckList = ref([])
const punishCount = ref(0)

// 接受事件
const acceptEvent = (playerEvent: any, index: number) => {
  runEvent(playerEvent.name)
  playerEventList.value[index].stage = 'active'
}

// 完成事件
const finishEvent = (playerEvent: any, index: number) => {
  ElMessage({
    message: '已完成事件',
    grouping: true,
    type: 'success'
  })

  deleteEvent(index)
}

// 放弃事件
const dropEvent = (playerEvent: any, index: number) => {
  punishCount.value += 1
  // dangerDeckList.value = getDangerDeck()
  deckDialogVisible.value = true
  deleteEvent(index)
}

// 删除事件
const deleteEvent = (index: number) => {
  const userStore = useUserStore()
  playerEventList.value.splice(index, 1)

  const newEventList: any = ref([])

  playerEventList.value.forEach((item: any) => {
    if (item) {
      newEventList.value.push(item)
    }
  })

  userStore.playerEventList = newEventList.value

  if (playerEventList.value.length == 0) {
    eventTitle.value = '当前没有事件'
  }
}

// 个人事件处理机制 ↓
const runEvent = (eventName: any) => {
  const userStore = useUserStore()

  let str = ''

  // 亚托克斯
  if (eventName == 'Aatrox') {
    for (const card of userStore.deckList[deckType[4]]) {
      if (card.id == 'Aatrox') {
        str = '卡牌 - 亚托克斯 - 已存在'
        return
      }
    }

    const aatroxCard = {
      id: 'Aatrox',
      type: 'StrongDiscomfort',
      name: 'Aatrox',
      cardName: '亚托克斯',
      description:
        '获得一把挽歌且绑定威能位无法更换，可被【贱卖】【重铸】和2阶圣水解除，前二者失去挽歌，后者保留',
      illustrate: '无',
      priority: 0,
      weight: 0,
      count: 0
    }

    userStore.deckList[deckType[4]].push(aatroxCard)
    console.log(userStore.deckList[deckType[4]])

    str = '已添加卡牌 - 亚托克斯 - 至重度不适中'
  }

  // 顺手牵羊
  if (eventName == 'Take-Others') {
    let randomPlayer = Math.round(Math.random() * 5 + 1)

    while (randomPlayer == userStore.roleId) {
      randomPlayer = Math.round(Math.random() * 5 + 1)
    }

    str = `抽取 ${randomPlayer} 号玩家的一张卡`
  }

  // 无中生有
  if (eventName == 'Create-Nothing') {
    str = '已为你添加 2 次抽卡机会'
    userStore.drawCount += 2
  }

  // 窃取
  if (eventName == 'Steal') {
    str = '已为你添加 1 次商店免费刷新机会'
    userStore.refreshCount += 1
  }

  // 扫雷
  if (eventName == 'Minesweeper') {
    window.open('https://minesweeper.online/cn/', '_blank')
  }

  // 改变事件状态
  for (let i = 0; i < playerEventList.value.length; i++) {
    if (eventName == playerEventList.value[i].name) {
      userStore.playerEventList[i].stage = 'active'
      break
    }
  }

  if (str != '') {
    ElMessage({
      message: str,
      showClose: true,
      duration: 0
    })
  }
}

// 添加卡牌
const cardFlip = ref(Array.from({ length: 12 }, () => false))
const addCard = (card: any, index: number) => {
  if (cardFlip.value[index]) {
    return
  }

  if (punishCount.value <= 0) {
    ElMessage({
      message: '抽卡次数已用完',
      grouping: true,
      type: 'error'
    })
    return
  }

  cardFlip.value[index] = true
  punishCount.value -= 1

  // saveDeck(card)
}

// 初始化
const initPlayerEvent = () => {
  // 读取游戏存档
  const userStore = useUserStore()
  playerEventList.value = userStore.playerEventList
  // console.log(playerEventList.value)

  eventFlipList.value = []

  if (playerEventList.value.length != 0) {
    eventTitle.value = '当前有新事件'
    for (const element of playerEventList.value) {
      eventFlipList.value.push(false)
    }

    setTimeout(() => {
      for (let i = 0; i < eventFlipList.value.length; i++) {
        eventFlipList.value[i] = true
      }
    }, 100)
  } else {
    eventTitle.value = '当前没有事件'
  }
}
initPlayerEvent()
</script>
<template>
  <div id="playerevent">
    <h2 class="event-title">{{ eventTitle }}</h2>

    <div class="event-list">
      <div class="event-box" v-for="(playerEvent, index) in playerEventList" :key="index">
        <div class="event-item" :class="{ flip: eventFlipList[index] }">
          <div class="event-card event-front">
            <div class="event-info">
              <div>
                <p class="title">- {{ playerEvent.eventName }} -</p>
                <p class="sub-title">- {{ playerEvent.name }} -</p>
              </div>
              <p class="text">{{ playerEvent.description }}</p>
              <div class="buttons">
                <button
                  class="button confirm"
                  :style="{
                    display:
                      playerEvent.stage === 'none' || playerEvent.stage === 'timeout'
                        ? 'block'
                        : 'none'
                  }"
                  @click="acceptEvent(playerEvent, index)"
                >
                  接受
                </button>
                <button
                  class="button finish"
                  :style="{ display: playerEvent.stage === 'active' ? 'block' : 'none' }"
                  @click="finishEvent(playerEvent, index)"
                >
                  完成
                </button>
              </div>
            </div>
          </div>
          <div class="event-card event-back"></div>
        </div>
        <button class="button quit" @click="dropEvent(playerEvent, index)">放弃</button>
        <p class="event-name">- 个人事件 -</p>
      </div>
    </div>

    <!-- 卡牌抽奖模态框 -->
    <!-- <el-dialog
      class="dialog deck-dialog"
      v-model="deckDialogVisible"
      :close-on-click-modal="false"
      width="79.25rem"
      align-center
    >
      <div class="deck-list-info">
        <h1 class="deck-list-title">放弃事件惩罚：抽取 1 次险中求胜卡池</h1>
        <p class="deck-list-text">{{ deckListText }}</p>
      </div>

      <div class="deck-list-box">
        <div
          class="card-item"
          v-for="(card, index) in dangerDeckList"
          :key="index"
          :class="{ flip: cardFlip[index] }"
          @click="addCard(card, index)"
        >
          <div class="card card-front">
            <div class="card-info">
              <p class="card-id">{{ card.cardName }}</p>
              <p class="card-name">{{ card.name }}</p>
            </div>
          </div>
          <div class="card card-back"></div>
        </div>
      </div>
      <button type="button" class="button deck-confirm" @click="deckDialogVisible = false">
        确认
      </button>
    </el-dialog> -->
  </div>
</template>

<style lang="scss">
@import '@/assets/styles/playerevent';
</style>

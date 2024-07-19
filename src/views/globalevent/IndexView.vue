<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useDungenoStore, useUserStore } from '@/stores'
import { shuffle, lottery, checkDeck, getDeckListType, deckType } from '@/utils'

// 全局事件
const globalEventList = ref()

// 抽卡模态框
const deckDialogVisible = ref(false)

// 属性
const eventFlipList: any = ref([])
const eventTitle = ref('当前没有事件')
const playersText = ref('')

const selfDeckList = ref()
const cardFlip = ref(Array.from({ length: 6 }, () => false))

// 接受事件
const acceptEvent = (playerEvent: any, index: number) => {
  runEvent(playerEvent.name)
  globalEventList.value[index].stage = 'active'
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

// 删除事件
const deleteEvent = (index: number) => {
  const userStore = useUserStore()
  globalEventList.value.splice(index, 1)

  const newEventList: any = ref([])

  globalEventList.value.forEach((item: any) => {
    if (item) {
      newEventList.value.push(item)
    }
  })

  userStore.globalEventList = newEventList.value

  if (globalEventList.value.length == 0) {
    eventTitle.value = '当前没有事件'
  }
}

// 全局事件处理机制 ↓
const runEvent = (eventName: any) => {
  const userStore = useUserStore()
  const dungeonStore = useDungenoStore()

  let players = [1, 2, 3, 4, 5, 6]

  do {
    players = shuffle(players)
  } while (players[0] == userStore.roleId)

  let str = ''

  // 紧急支援
  if (eventName == 'MAYDAY') {
    const dungeon = lottery(dungeonStore.dungeons)
    str = `玩家 ${players[0]} | ${players[1]} | ${players[2]} 需前往 - ${dungeon.name} -`
  }

  // 五谷丰登
  if (eventName == 'Bumper-Harvest') {
    deckDialogVisible.value = true
    const deck = getDeckListType(deckType[0])

    // 微弱增益
    while (deck.length != 6) {
      const card = lottery(deck)
      if (checkDeck(deck, card)) {
        deck.push(card)
      }
    }

    selfDeckList.value = deck
    str =
      `抽取顺序为 ${players[0]} | ${players[1]} | ${players[2]} ` +
      `| ${players[3]} | ${players[4]} | ${players[5]}`

    setTimeout(() => {
      cardFlip.value = Array.from({ length: 6 }, () => true)
    }, 500)
  }

  // 各自为营
  if (eventName == 'Split-Up') {
    str =
      `${players[0]} | ${players[1]} | ${players[2]} 需要做为 1 队，` +
      `${players[3]} | ${players[4]} | ${players[5]} 需要做为 2 队 ` +
      `分别完成此次遭遇战`
  }

  // 斗地主
  if (eventName == 'Dou-Di-Zhu') {
    str = `玩家 ${players[0]} | ${players[1]} | ${players[2]} 需前往 斗地主环节`
  }

  // 木头人
  if (eventName == 'Wood-Man') {
    str = `玩家 ${players[0]} 需要当报数者，剩余玩家当木头人，前往熔炉竞技场进行此活动`
  }

  // 改变事件状态
  for (let i = 0; i < globalEventList.value.length; i++) {
    if (eventName == globalEventList.value[i].name) {
      userStore.globalEventList[i].stage = 'active'
      break
    }
  }

  if (str != '') {
    ElMessage({
      message: str,
      duration: 0,
      showClose: true
    })
  }
}

// 初始化
const initGlobalEvent = () => {
  // 读取存档
  const userStore = useUserStore()
  globalEventList.value = userStore.globalEventList
  // console.log(gameConfig.globalEventList)

  eventFlipList.value = []

  if (globalEventList.value.length != 0) {
    eventTitle.value = '当前有新事件'
    for (const element of globalEventList.value) {
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
initGlobalEvent()
</script>

<template>
  <div id="globalevent">
    <h2 class="event-title">{{ eventTitle }}</h2>

    <div class="event-list">
      <div class="event-box" v-for="(globalEvent, index) in globalEventList" :key="index">
        <div class="event-item" :class="{ flip: eventFlipList[index] }">
          <div class="event-card event-front">
            <div class="event-info">
              <div>
                <p class="title">{{ globalEvent.eventName }}</p>
                <p class="sub-title">{{ globalEvent.name }}</p>
              </div>
              <p class="text">{{ globalEvent.description }}</p>
              <div class="buttons">
                <button
                  class="button confirm"
                  :style="{
                    display:
                      globalEvent.stage === 'none' || globalEvent.stage === 'timeout'
                        ? 'block'
                        : 'none'
                  }"
                  @click="acceptEvent(globalEvent, index)"
                >
                  接受
                </button>
                <button
                  class="button finish"
                  :style="{ display: globalEvent.stage === 'active' ? 'block' : 'none' }"
                  @click="finishEvent(globalEvent, index)"
                >
                  完成
                </button>
              </div>
            </div>
          </div>
          <div class="event-card event-back"></div>
        </div>
        <p class="event-name">- 全局事件 -</p>
      </div>
    </div>

    <!-- 卡牌抽奖模态框 -->
    <el-dialog
      class="dialog deck-dialog"
      v-model="deckDialogVisible"
      :close-on-click-modal="false"
      width="79.25rem"
      align-center
    >
      <div class="deck-info">
        <h1 class="deck-title">五谷丰登</h1>
        <p class="players">{{ playersText }}</p>
      </div>
      <div class="deck-list-box">
        <div
          class="card-item"
          v-for="(card, index) in selfDeckList"
          :key="index"
          :class="{ flip: cardFlip[index] }"
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
    </el-dialog>
  </div>
</template>

<style lang="scss">
@import '@/assets/styles/globalevent';
</style>

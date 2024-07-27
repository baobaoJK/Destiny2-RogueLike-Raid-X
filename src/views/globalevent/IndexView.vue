<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useDungenoStore, useUserStore } from '@/stores'
import { shuffle, lottery, checkDeck, getDeckListType, deckType, getDeckListTagLevelList } from '@/utils'
import InfoBoard from "@/components/infoboard/IndexView.vue"

// 用户信息
const userStore = useUserStore()
const { globalEventList, infoBoard } = storeToRefs(useUserStore())

// 地牢信息
const dungeonStore = useDungenoStore()

// 抽卡模态框
const deckDialogVisible = ref(false)
const deckTitle = ref()

// 属性
const eventFlipList: any = ref([])

const selfDeckList = ref()
const cardFlip = ref(Array.from({ length: 6 }, () => false))

// 接受事件
const acceptEvent = (globalEvent: any, index: number) => {
  globalEventList.value[index].stage = 'active'
  runEvent(globalEvent.name)
}

// 完成事件
const finishEvent = (globalEvent: any, index: number) => {
  ElMessage({
    message: `已完成 ${globalEvent.eventName} 事件`,
    grouping: true,
    type: 'success'
  })

  deleteEvent(index)
}

// 删除事件
const deleteEvent = (index: number) => {
  globalEventList.value.splice(index, 1)
}

// 全局事件处理机制 ↓
const runEvent = (eventName: any) => {

  let players = [1, 2, 3, 4, 5, 6]

  do {
    players = shuffle(players)
  } while (players[0] == userStore.roleId)

  let str = ''

  // 紧急支援
  if (eventName == 'MAYDAY') {
    const dungeon = lottery(dungeonStore.dungeons)
    str = `玩家 ${players[0]} | ${players[1]} | ${players[2]} 需前往 - ${dungeon.name} - 进行地牢遭遇战`
  }

  // 五谷丰登
  if (eventName == 'Bumper-Harvest') {
    deckDialogVisible.value = true
    deckTitle.value = '五谷丰登'

    const deckList = getDeckListTagLevelList('MicroGain', [2, 2, 2])

    selfDeckList.value = deckList
    str =
      `抽取顺序为 ${players[0]} | ${players[1]} | ${players[2]} ` +
      `| ${players[3]} | ${players[4]} | ${players[5]}`

    const changeCardState = setTimeout(() => {
      cardFlip.value = Array.from({ length: 6 }, () => true)
      clearTimeout(changeCardState)
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

  // 左平行，右......
  if (eventName == 'Left-Parallel-Right') {
    str =
      `1队 ${players[0]} | ${players[1]} 号 玩家 || ` +
      `2队 ${players[2]} | ${players[3]} 号 玩家 || ` +
      `3队 ${players[4]} | ${players[5]} 号 玩家`
  }

  // 生化母体
  if (eventName == 'Biochemical-Matrix') {
    deckDialogVisible.value = true
    deckTitle.value = '生化危机'

    const deckList = getDeckListTagLevelList('StrongDiscomfort', [1, 2, 3])

    selfDeckList.value = deckList
    str = `从左至右的获取顺序为 ` +
      `${players[0]} | ${players[1]} | ${players[2]} ` +
      `| ${players[3]} | ${players[4]} | ${players[5]}` +
      `若玩家身上由此张卡牌则作废`

    const changeCardState = setTimeout(() => {
      cardFlip.value = Array.from({ length: 6 }, () => true)
      clearTimeout(changeCardState)
    }, 500)
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

  eventFlipList.value = Array.from({ length: globalEventList.value.length }, () => false)

  const changeCardState = setTimeout(() => {
    for (let i = 0; i < eventFlipList.value.length; i++) {
      eventFlipList.value[i] = true
    }
    clearTimeout(changeCardState)
  }, 100)
}
initGlobalEvent()
</script>

<template>
  <div id="globalevent">
    <h2 class="event-title" v-if="globalEventList.length == 0">当前没有全局事件</h2>
    <h2 class="event-title" v-else>全局事件</h2>

    <div class="event-list">
      <div class="event-box" v-for="(globalEvent, index) in globalEventList" :key="index">
        <div class="event-item" :class="{ flip: eventFlipList[index] }">
          <div class="event-card event-front">
            <div class="event-info">
              <div>
                <p class="title">{{ globalEvent.eventName }}</p>
                <p class="sub-title">{{ globalEvent.name }}</p>
              </div>
              <div>
                <p class="text">{{ globalEvent.description }}</p>
                <hr v-if="globalEvent.idea !== 'D2RRX'">
                <p v-if="globalEvent.idea !== 'D2RRX'">想法来源：{{ globalEvent.idea }}</p>
              </div>
              <div class="buttons">
                <button class="button confirm" v-if="globalEvent.stage === 'none'"
                  @click="acceptEvent(globalEvent, index)">
                  接受
                </button>
                <button class="button finish" v-else @click="finishEvent(globalEvent, index)">
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
    <el-dialog class="dialog deck-dialog" v-model="deckDialogVisible" :close-on-click-modal="false" width="79.25rem"
      align-center>
      <div class="deck-info">
        <h1 class="deck-title">{{ deckTitle }}</h1>
      </div>
      <div class="deck-list-box">
        <div class="card-item" v-for="(card, index) in selfDeckList" :key="index" :class="{ flip: cardFlip[index] }">
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

    <!-- 全局事件信息版 -->
    <InfoBoard type="right" :show-info-board="infoBoard.gameGlobalEvent">
      <template #close-button>
        <div class="close-button">
          <a @click="infoBoard.gameGlobalEvent = !infoBoard.gameGlobalEvent">{{ infoBoard.gameGlobalEvent ? "关闭" :
            "查看事件说明"
            }}</a>
        </div>
      </template>
      <template #title>
        <h1 class="title">
          全局事件说明
        </h1>
      </template>
      <template #content>
        <div>
          <p>队长每次抵达遭遇战插旗点时</p>
          <p>都会刷新 1 - 2 个 全局事件</p>
          <p>若获得了事件，则必须立即查看该事件</p>
          <p>全局事件无法放弃，强制执行</p>
        </div>
      </template>
    </InfoBoard>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/globalevent';
</style>

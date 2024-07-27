<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
import { randomNum, getDangerDeck, saveCard, youCant } from '@/utils'
import { storeToRefs } from 'pinia';
import InfoBoard from "@/components/infoboard/IndexView.vue"
import { drink, luckNumber, spy, winOrLoss } from './composables/specialEvent';

// 用户信息
const userStore = useUserStore()
const { playerEventList, infoBoard } = storeToRefs(useUserStore())

// 抽卡模态框
const deckDialogVisible = ref(false)

// 属性
const eventFlipList: any = ref([])

// 接受事件
const acceptEvent = (playerEvent: any, index: number) => {
  playerEventList.value[index].stage = 'active'
  runEvent(playerEvent)
}

// 完成事件
const finishEvent = (playerEvent: any, index: number) => {
  let str = `已完成 ${playerEvent.eventName} 事件`
  const randomMoney = randomNum(0, 1)

  if (randomMoney != 0) {
    userStore.playerMoney += randomMoney
    str = `已完成 ${playerEvent.eventName}  事件，获得 ${randomMoney} 货币`
  }

  ElMessage({
    message: str,
    grouping: true,
    type: 'success'
  })

  deleteEvent(index)

  // 内鬼
  if (playerEvent.name === 'Spy') {
    specialTitle.value = playerEvent.eventName
    specialDescription.value = playerEvent.description
    optionList.value = [
      {
        text: '成功',
        handler: () => {
          spy(1)
          specialDialogVisible.value = false
        }
      }, {
        text: '失败',
        handler: () => {
          spy(0)
          specialDialogVisible.value = false
        }
      }]

    specialDialogVisible.value = true
  }

  // 饮鸩止渴
  if (playerEvent.name === 'Drinking-Poison-to-Quench-Thirst') {
    drink()
  }
}

// 放弃事件
const dropEvent = (playerEvent: any, index: number) => {
  punishCount.value += 1
  dangerDeckList.value = getDangerDeck()
  deckDialogVisible.value = true

  ElMessage({
    message: `已放弃 ${playerEvent.eventName} 事件，需要抽取一次险中求胜卡池`,
    grouping: true,
    type: 'error'
  })

  deleteEvent(index)
}

// 删除事件
const deleteEvent = (index: number) => {
  playerEventList.value.splice(index, 1)
}

// 个人事件处理机制 ↓
const specialDialogVisible = ref(false)
const specialTitle = ref('')
const specialDescription = ref('')
const optionList = ref()
const runEvent = (playerEvent: any) => {

  let str = ''

  // 亚托克斯
  if (playerEvent.name == 'Aatrox') {
    const aatroxCard = {
      id: 'Aatrox',
      type: 'StrongDiscomfort',
      tag: 'god',
      name: 'Aatrox',
      cardName: '亚托克斯',
      description:
        '获得一把挽歌且绑定威能位无法更换，可被【贱卖】【重铸】和2阶圣水解除，前二者失去挽歌，后者保留',
      illustrate: '无',
      priority: 0,
      weight: 0,
      count: 0
    }
    saveCard(aatroxCard)
  }

  // 顺手牵羊
  if (playerEvent.name == 'Take-Others') {
    let randomPlayer;

    do {
      randomPlayer = randomNum(1, 6)
    }
    while (randomPlayer == userStore.roleId)

    str = `抽取 ${randomPlayer} 号玩家的一张卡`
  }

  // 无中生有
  if (playerEvent.name == 'Create-Nothing') {
    str = '已为你添加 2 次抽卡机会'
    userStore.drawCount += 2
  }

  // 窃取
  if (playerEvent.name == 'Steal') {
    str = '已为你添加 1 次商店免费刷新机会'
    userStore.steal = true
    userStore.refreshCount += 1
  }

  // 扫雷
  if (playerEvent.name == 'Minesweeper') {
    window.open('https://minesweeper.online/cn/', '_blank')
  }

  // 赢下所有或一无所有
  if (playerEvent.name == 'Win-or-Loss') {
    specialTitle.value = playerEvent.eventName
    specialDescription.value = playerEvent.description
    optionList.value = [
      {
        text: '20',
        handler: () => {
          winOrLoss(20)
          specialDialogVisible.value = false
        }
      },
      {
        text: '1',
        handler: () => {
          winOrLoss(1)
          specialDialogVisible.value = false
        }
      },
      {
        text: '无事发生',
        handler: () => {
          winOrLoss(0)
          specialDialogVisible.value = false
        }
      }]

    specialDialogVisible.value = true
  }

  // 幸运数字
  if (playerEvent.name == 'Lucky-Number') {
    specialTitle.value = playerEvent.eventName
    specialDescription.value = playerEvent.description
    optionList.value = [
      {
        text: '7/14/17',
        handler: () => {
          luckNumber(7)
          specialDialogVisible.value = false
        }
      },
      {
        text: '2的倍数',
        handler: () => {
          luckNumber(2)
          specialDialogVisible.value = false
        }
      },
      {
        text: '无事发生',
        handler: () => {
          luckNumber(0)
          specialDialogVisible.value = false
        }
      }]

    specialDialogVisible.value = true
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
const dangerDeckList = ref()
const punishCount = ref(0)
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

  if (userStore.random) {
    youCant()
  }
  else {
    saveCard(card)
  }
}

// 初始化
const initPlayerEvent = () => {

  eventFlipList.value = Array.from({ length: playerEventList.value.length }, () => false)

  const changeCardState = setTimeout(() => {
    for (let i = 0; i < eventFlipList.value.length; i++) {
      eventFlipList.value[i] = true
    }
    clearTimeout(changeCardState)
  }, 100)
}
initPlayerEvent()
</script>
<template>
  <div id="playerevent">
    <h2 class="event-title" v-if="playerEventList.length == 0">当前没有个人事件</h2>
    <h2 class="event-title" v-else>个人事件</h2>

    <div class="event-list">
      <div class="event-box" v-for="(playerEvent, index) in playerEventList" :key="index">
        <div class="event-item" :class="{ flip: eventFlipList[index] }">
          <div class="event-card event-front">
            <div class="event-info">
              <div>
                <p class="title">{{ playerEvent.eventName }}</p>
                <p class="sub-title">{{ playerEvent.name }}</p>
              </div>
              <div>
                <p class="text">{{ playerEvent.description }}</p>
                <hr v-if="playerEvent.idea !== 'D2RRX'">
                <p v-if="playerEvent.idea !== 'D2RRX'">想法来源：{{ playerEvent.idea }}</p>
              </div>
              <div class="buttons">
                <!-- <button class="button confirm" @click="acceptEvent(playerEvent, index)">
                  接受
                </button> -->
                <button class="button confirm" v-if="playerEvent.stage === 'none'"
                  @click="acceptEvent(playerEvent, index)">
                  接受
                </button>
                <button class="button finish" v-else @click="finishEvent(playerEvent, index)">
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
    <el-dialog class="dialog deck-dialog" v-model="deckDialogVisible" :close-on-click-modal="false" width="79.25rem"
      align-center>
      <div class="deck-list-info">
        <h1 class="deck-list-title">放弃事件惩罚：抽取1次险中求胜卡池</h1>
      </div>

      <div class="deck-list-box">
        <div class="card-item" v-for="(card, index) in dangerDeckList" :key="index" :class="{ flip: cardFlip[index] }"
          @click="addCard(card, index)">
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

    <!-- 个人事件信息版 -->
    <InfoBoard type="right" :show-info-board="infoBoard.gamePlayerEvent">
      <template #close-button>
        <div class="close-button">
          <a @click="infoBoard.gamePlayerEvent = !infoBoard.gamePlayerEvent">{{ infoBoard.gamePlayerEvent ? "关闭" :
            "查看事件说明"
            }}</a>
        </div>
      </template>
      <template #title>
        <h1 class="title">
          个人事件说明
        </h1>
      </template>
      <template #content>
        <div>
          <p>玩家每次抵达遭遇战插旗点时</p>
          <p>都会刷新 1 - 3 个 个人事件</p>
          <p>若获得了事件，则必须立即查看该事件</p>
          <p>个人事件放弃则抽取一次险中求胜</p>
          <p>完成事件后有概率获得 0-1 个单位货币</p>
        </div>
      </template>
    </InfoBoard>

    <!-- 特殊事件模态框 -->
    <el-dialog class="dialog special-dialog" v-model="specialDialogVisible" :close-on-click-modal="false" width="60rem"
      align-center>
      <div class="box">
        <div class="title-box">
          <h1 class="title">{{ specialTitle }}</h1>
          <p class="sub-title">{{ specialDescription }}</p>
        </div>
        <div class="options-box">
          <button type="button" class="button" v-for="option in optionList" :key="option.text"
            @click="option.handler">{{
              option.text }}</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/playerevent';
</style>

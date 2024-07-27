<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useDeckListStore, useUserStore } from '@/stores'
import {
  shuffle,
  getDeckListTypeCount,
  getSafeDeck,
  getDangerDeck,
  getGambitDeck,
  getLuckDeck,
  getDevoteDeck,
  saveCard,
  youCant
} from '@/utils'
import InfoBoard from "@/components/infoboard/IndexView.vue"

// 用户信息仓库
const userStore = useUserStore()
const {
  infoBoard,
  drawCount,
  deckClosed,
  gambler,
  stargazing,
  thirteen
} = storeToRefs(useUserStore())

// 卡牌数量
const {
  microGainCount,
  strongGainCount,
  opportunityCount,
  microDiscomfortCount,
  strongDiscomfortCount,
  unacceptableCount,
  technologyCount,
  supportCount
} = storeToRefs(useDeckListStore());


// 卡池信息框
const deckInfoDialogVisible = ref(false)

// 卡牌抽取框
const deck: any = ref([])
const deckDialogVisible = ref(false)
const deckDialogConfig = ref({
  deckListStyle: Array.from({ length: 5 }, () => false),
  flips: Array.from({ length: 12 }, () => false),
  deckListName: '',
  microGainCount: computed(() => {
    return getDeckListTypeCount(deck.value, 'MicroGain')
  }),
  strongGainCount: computed(() => {
    return getDeckListTypeCount(deck.value, 'StrongGain')
  }),
  opportunityCount: computed(() => {
    return getDeckListTypeCount(deck.value, 'Opportunity')
  }),
  microDiscomfortCount: computed(() => {
    return getDeckListTypeCount(deck.value, 'MicroDiscomfort')
  }),
  strongDiscomfortCount: computed(() => {
    return getDeckListTypeCount(deck.value, 'StrongDiscomfort')
  }),
  unacceptableCount: computed(() => {
    return getDeckListTypeCount(deck.value, 'Unacceptable')
  }),
  technologyCount: computed(() => {
    return getDeckListTypeCount(deck.value, 'Technology')
  }),
  supportCount: computed(() => {
    return getDeckListTypeCount(deck.value, 'Support')
  }),
  canClick: false
})

// 卡池点击事件
const showDeck = (type: string) => {

  // 判断是否有抽卡机会
  if (userStore.drawCount <= 0) {
    ElMessage({
      message: '你没有抽卡机会！',
      grouping: true,
      type: 'error'
    })
    closeDeck()
    return
  }

  // 判断卡组类型
  if (type === 'safe') {
    deckDialogConfig.value.deckListStyle[0] = true
    deckDialogConfig.value.deckListName = '- 稳妥起见 -'
    deck.value = getSafeDeck()
  } else if (type === 'danger') {
    deckDialogConfig.value.deckListStyle[1] = true
    deckDialogConfig.value.deckListName = '- 险中求胜 -'
    deck.value = getDangerDeck()
  } else if (type === 'gambit') {
    deckDialogConfig.value.deckListStyle[2] = true
    deckDialogConfig.value.deckListName = '- 对赌博弈 -'
    deck.value = getGambitDeck()
  } else if (type === 'luck') {
    deckDialogConfig.value.deckListStyle[3] = true
    deckDialogConfig.value.deckListName = '- 时来运转 -'
    deck.value = getLuckDeck()
  } else if (type === 'devote') {
    deckDialogConfig.value.deckListStyle[4] = true
    deckDialogConfig.value.deckListName = '- 身心奉献 -'
    deck.value = getDevoteDeck()
  }

  // 判断卡组列表是否充足
  if (deck.value == undefined || deck.value.length != 12) {
    ElMessage({
      message: '卡牌数量不够无法抽取',
      grouping: true,
      type: 'error'
    })
    closeDeck()
    return
  }

  // 打开模态框
  deckDialogVisible.value = true

  if (stargazing.value) {
    deckDialogConfig.value.flips = Array.from({ length: 12 }, () => true)

    const changeCardState = setTimeout(() => {
      deckDialogConfig.value.flips = Array.from({ length: 12 }, () => false)
      clearTimeout(changeCardState)
    }, 5000)

    const changeCardClick = setTimeout(() => {
      deckDialogConfig.value.canClick = true
      deck.value = shuffle(deck.value)
      clearTimeout(changeCardClick)
    }, 5500)
  }
  else {
    // 打乱卡牌
    deck.value = shuffle(deck.value)
    deckDialogConfig.value.canClick = true
    console.log(deck.value)
  }

}

// 卡池关闭事件
const closeDeck = () => {
  deckDialogVisible.value = false
  const reloadStyle = setTimeout(() => {
    deckDialogConfig.value.deckListStyle = Array.from({ length: 5 }, () => false)
    deckDialogConfig.value.flips = Array.from({ length: 12 }, () => false)
    clearTimeout(reloadStyle)
  }, 300)
}

// 卡牌点击事件
const clickCard = (card: any, index: any) => {

  // 判断是否能点击
  if (!deckDialogConfig.value.canClick) {
    ElMessage({
      message: '当前不能被点击！',
      grouping: true,
      type: 'error'
    })
    return
  }

  // 判断是否有抽卡机会
  if (userStore.drawCount <= 0) {
    ElMessage({
      message: '你没有抽卡机会！',
      grouping: true,
      type: 'error'
    })
    return
  }

  // 判断卡牌是否被抽取过
  if (!deckDialogConfig.value.flips[index]) {
    deckDialogConfig.value.flips[index] = true
    // console.log(card)
    if (userStore.random) {
      youCant()
    }
    else {
      saveCard(card)
    }
    userStore.drawCount -= 1
  }

  // 判断卡牌名称
  if (card.name === 'Thirteen-Orphans' || card.name === 'Quit-Gambling' || card.name === 'Gambler') {
    deckDialogVisible.value = false
  }
}


// 初始化
const initDeck = () => {
  // 戒赌
  if (deckClosed.value) {
    ElMessage({
      message: '您的抽卡系统已被关闭！请前往商店进行清除卡片',
      grouping: true,
      showClose: true,
      type: 'error',
      duration: 0
    })
  }

  // 赌徒
  if (gambler.value) {
    ElMessage({
      message: '你只能抽取对赌博弈卡池',
      grouping: true,
      showClose: true,
      duration: 0
    })
  }

  // 观星
  if (stargazing.value) {
    ElMessage({
      message: '观星效果已启用，每次开启卡池时你有 5 秒的时间观看卡池内容',
      grouping: true,
      showClose: true,
      duration: 0
    })
  }

  // 十三幺
  if (thirteen.value) {
    ElMessage({
      message: '你身上携带了 十三幺，卡牌不消除，则无法抽取卡牌',
      grouping: true,
      showClose: true,
      duration: 0
    })
  }
}
initDeck()
</script>

<template>
  <div id="deck">
    <h1 class="deck-title">您有 {{ drawCount }} 次抽取卡牌的机会</h1>

    <!-- 卡牌抽奖框 -->
    <div class="deck-list">
      <div class="deck" v-show="!gambler">
        <div class="deck-1" id="safe" @click="showDeck('safe')"></div>
        <p class="deck-name">- 稳妥起见 -</p>
      </div>
      <div class="deck" v-show="!gambler">
        <div class="deck-2" id="danger" @click="showDeck('danger')"></div>
        <p class="deck-name">- 险中求胜 -</p>
      </div>
      <div class="deck">
        <div class="deck-3" id="gambit" @click="showDeck('gambit')"></div>
        <p class="deck-name">- 对赌博弈 -</p>
      </div>
      <div class="deck" v-show="!gambler">
        <div class="deck-4" id="luck" @click="showDeck('luck')"></div>
        <p class="deck-name">- 时来运转 -</p>
      </div>
      <div class="deck" v-show="!gambler">
        <div class="deck-5" id="devote" @click="showDeck('devote')"></div>
        <p class="deck-name">- 身心奉献 -</p>
      </div>
    </div>

    <!-- 卡牌数量数量显示 -->
    <p class="deck-count">
      当前卡池数量：
      微弱增益：{{ microGainCount }} 张 |
      强大增益：{{ strongGainCount }} 张 |
      欧皇卡牌：{{ opportunityCount }} 张 |
      微弱不适：{{ microDiscomfortCount }} 张 |
      重度不适：{{ strongDiscomfortCount }} 张 |
      反人类：{{ unacceptableCount }} 张 |
      特殊卡牌：{{ technologyCount }} 张 |
      辅助卡牌：{{ supportCount }} 张
    </p>

    <!-- 卡池信息显示按钮 -->
    <button class="button deck-info" @click="deckInfoDialogVisible = true">卡池信息</button>

    <!-- 卡池信息框 -->
    <el-dialog class="dialog deck-info-dialog" v-model="deckInfoDialogVisible" :close-on-click-modal="false"
      align-center>
      <div class="deck-list-info">
        <h1>卡池信息</h1>
        <p class="deck-type-info safe">
          卡池1 - 稳妥起见 - (7张微弱增益 1张强大增益 4张微弱不适)
        </p>
        <p class="deck-type-info danger">
          卡池2 - 险中求胜 - (5张微弱增益 2张强大增益 1张欧皇增益 1张微弱不适 3张重度不适)
        </p>
        <p class="deck-type-info gambit">
          卡池3 - 对赌博弈 - (5张强大增益 1张欧皇增益 5张重度不适 1张反人类)
        </p>
        <p class="deck-type-info luck">
          卡池4 - 时来运转 - (1张强大增益 1张欧皇增益 1张重度不适 1张反人类 8张特殊卡牌)
        </p>
        <p class="deck-type-info devote">
          卡池5 - 身心奉献 - (6张辅助卡牌 6张重度不适)</p>
        <p class="deck-type-info">
          ------------------------------------------------------------------------------------------
        </p>
        <p class="deck-type-info">
          如果想当平民安逸的度过则可以抽取 稳妥起见，如果想体验刺激的则可以抽取 险中求胜
        </p>
        <p class="deck-type-info">
          如果想当赌狗玩更刺激的则可以抽取 对赌博弈，如果想逆转命运的则可以抽取 时来运转
        </p>
        <p class="deck-type-info">
          如果想为团队当工具人的则可以抽取 身心奉献
        </p>
      </div>
      <div class="deck-confirm-box">
        <button type="button" class="button deck-cancel" @click="deckInfoDialogVisible = false">
          关闭
        </button>
      </div>
    </el-dialog>

    <!-- 卡牌抽奖模态框 -->
    <el-dialog class="dialog deck-dialog" v-model="deckDialogVisible" :close-on-click-modal="false" width="79.25rem"
      align-center>
      <div class="deck-list-info">
        <p class="deck-list-name">
          {{ deckDialogConfig.deckListName }}
        </p>
        <p class="deck-list-draw">您有 {{ drawCount }} 次抽取卡牌的机会</p>
        <p class="deck-list-count">
          当前卡池状态：
          <span v-if="deckDialogConfig.microGainCount !== 0">
            | 微弱增益：{{ deckDialogConfig.microGainCount }} 张 |
          </span>
          <span v-if="deckDialogConfig.strongGainCount !== 0">
            | 强大增益：{{ deckDialogConfig.strongGainCount }} 张 |
          </span>
          <span v-if="deckDialogConfig.opportunityCount !== 0">
            | 欧皇增益：{{ deckDialogConfig.opportunityCount }} 张 |
          </span>
          <span v-if="deckDialogConfig.microDiscomfortCount !== 0">
            | 微弱不适：{{ deckDialogConfig.microDiscomfortCount }} 张 |
          </span>
          <span v-if="deckDialogConfig.strongDiscomfortCount !== 0">
            | 重度不适：{{ deckDialogConfig.strongDiscomfortCount }} 张 |
          </span>
          <span v-if="deckDialogConfig.unacceptableCount !== 0">
            | 反人类：{{ deckDialogConfig.unacceptableCount }} 张 |
          </span>
          <span v-if="deckDialogConfig.technologyCount !== 0">
            | 特殊卡牌：{{ deckDialogConfig.technologyCount }} 张 |
          </span>
          <span v-if="deckDialogConfig.supportCount !== 0">
            | 辅助卡牌：{{ deckDialogConfig.supportCount }} 张 |
          </span>
        </p>
      </div>
      <div class="deck-list-box" :class="{
        'deck-1': deckDialogConfig.deckListStyle[0],
        'deck-2': deckDialogConfig.deckListStyle[1],
        'deck-3': deckDialogConfig.deckListStyle[2],
        'deck-4': deckDialogConfig.deckListStyle[3],
        'deck-5': deckDialogConfig.deckListStyle[4]
      }">
        <div class="card-item" v-for="(card, index) in deck" :key="index" @click="clickCard(card, index)"
          :class="{ flip: deckDialogConfig.flips[index] }">
          <div class="card card-front">
            <div class="card-info">
              <p class="card-id">{{ card.name }}</p>
              <p class="card-name">{{ card.cardName }}</p>
            </div>
          </div>
          <div class="card card-back"></div>
        </div>
      </div>
      <div class="deck-confirm-box">
        <button type="button" class="button deck-cancel" @click="closeDeck">关闭</button>
      </div>
    </el-dialog>

    <!-- 卡池关闭 -->
    <div class="deck-closed" v-if="deckClosed || thirteen"></div>

    <!-- 卡池信息版 -->
    <InfoBoard type="right" :show-info-board="infoBoard.gameDeck">
      <template #close-button>
        <div class="close-button">
          <a @click="infoBoard.gameDeck = !infoBoard.gameDeck">{{ infoBoard.gameDeck ? "关闭" : "查看卡池说明" }}</a>
        </div>
      </template>
      <template #title>
        <h1 class="title">
          卡池说明
        </h1>
      </template>
      <template #content>
        <div>
          <p>每个卡池均有12张牌，每个人的卡池互不干涉</p>
          <p>卡牌分为正面和负面以及特殊卡牌</p>
          <p>正面分为微弱增益和强大增益和欧皇增益</p>
          <p>负面分为微弱不适和重度不适和反人类</p>
          <p>特殊分为特殊卡牌和辅助卡牌</p>
          <hr>
          <p>正面/负面卡牌删除后不会返回原卡池</p>
          <p>稳妥起见若凑不出等量类型的卡牌则无法抽取该卡池</p>
          <p>险中求胜欧皇增益抽完则换成强大增益</p>
          <p>对赌博弈欧皇增益抽完则换成强大增益，反人类抽完则换成重度不适</p>
          <p>时来运转欧皇增益抽完则换成强大增益，反人类抽完则换成重度不适，特殊卡牌抽完则不能继续抽取该卡池</p>
          <p>身心奉献辅助卡牌数量不够则换成微弱增益</p>
          <p>卡牌数量不足以填满卡池时，会随机把剩余在卡池中未抽出的卡牌塞入卡池中</p>
        </div>
      </template>
    </InfoBoard>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/deck';
</style>

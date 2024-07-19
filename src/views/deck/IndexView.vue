<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useDeckListStore, useUserStore } from '@/stores'
import {
  shuffle,
  lottery,
  lotteryByCount,
  getDeckListType,
  getDeckListTypeCount,
  deckType,
  deleteCard,
  checkDeck
} from '@/utils'

// 属性
const drawCardCount = ref(0)
const microGainCount = ref(0)
const strongGainCount = ref(0)
const opportunityCount = ref(0)
const microDiscomfortCount = ref(0)
const strongDiscomfortCount = ref(0)
const unacceptableCount = ref(0)
const technologyCount = ref(0)
const supportCount = ref(0)
const deckClosed = ref(false)
const deckListName = ref('')
const deckListText = ref('')
const microGainCountTemp = ref(0)
const strongGainCountTemp = ref(0)
const opportunityCountTemp = ref(0)
const microDiscomfortCountTemp = ref(0)
const strongDiscomfortCountTemp = ref(0)
const unacceptableCountTemp = ref(0)
const technologyCountTemp = ref(0)
const supportCountTemp = ref(0)
const flips = ref(Array.from({ length: 12 }, () => false))
const deckInfoDialogVisible = ref(false)

// 卡牌抽取框
const deckDialogVisible = ref(false)
const decks = ref(Array.from({ length: 5 }, () => false))

// 卡池点击事件
const deck: any = ref([])
const showDeck = (type: string) => {
  const userStore = useUserStore()

  if (userStore.drawCount <= 0) {
    ElMessage({
      message: '你没有抽卡机会！',
      grouping: true,
      type: 'error'
    })
    closeDeck()
    return
  }

  if (type === 'safe') {
    decks.value[0] = true
    deck.value = getSafeDeck()
    setDeckListCount()
    deckListName.value = '- 稳妥起见 -'
    deckListText.value =
      '微弱增益：' +
      microGainCountTemp.value +
      ' 张 | ' +
      '强大增益：' +
      strongGainCountTemp.value +
      ' 张 | ' +
      '微弱不适：' +
      microDiscomfortCountTemp.value +
      ' 张'
  } else if (type === 'danger') {
    decks.value[1] = true
    deck.value = getDangerDeck()
    setDeckListCount()
    deckListName.value = '- 险中求胜 -'
    deckListText.value =
      '微弱增益：' +
      microGainCountTemp.value +
      ' 张 | ' +
      '强大增益：' +
      strongGainCountTemp.value +
      ' 张 | ' +
      '欧皇增益：' +
      opportunityCountTemp.value +
      ' 张 | ' +
      '微弱不适：' +
      microDiscomfortCountTemp.value +
      ' 张 | ' +
      '重度不适：' +
      strongDiscomfortCountTemp.value +
      ' 张'
  } else if (type === 'gambit') {
    decks.value[2] = true
    deck.value = getGambitDeck()
    setDeckListCount()
    deckListName.value = '- 对赌博弈 -'
    deckListText.value =
      '强大增益：' +
      strongGainCountTemp.value +
      ' 张 | ' +
      '欧皇增益：' +
      opportunityCountTemp.value +
      ' 张 | ' +
      '重度不适：' +
      strongDiscomfortCountTemp.value +
      ' 张 | ' +
      '反人类：' +
      unacceptableCountTemp.value +
      ' 张'
  } else if (type === 'luck') {
    decks.value[3] = true
    deck.value = getLuckDeck()
    setDeckListCount()
    deckListName.value = '- 时来运转 -'
    deckListText.value =
      '强大增益：' +
      strongGainCountTemp.value +
      ' 张 | ' +
      '欧皇增益：' +
      opportunityCountTemp.value +
      ' 张 | ' +
      '重度不适：' +
      strongDiscomfortCountTemp.value +
      ' 张 | ' +
      '反人类：' +
      unacceptableCountTemp.value +
      ' 张 | ' +
      '特殊卡牌：' +
      technologyCountTemp.value +
      ' 张'
  } else if (type === 'devote') {
    decks.value[4] = true
    deck.value = getDevoteDeck()
    setDeckListCount()
    deckListName.value = '- 身心奉献 -'
    deckListText.value =
      '微弱增益：' +
      microGainCountTemp.value +
      ' 张 | ' +
      '辅助卡：' +
      supportCountTemp.value +
      ' 张 | ' +
      '重度不适：' +
      strongDiscomfortCountTemp.value +
      ' 张'
  }

  if (deck.value == undefined || deck.value.length != 12) {
    ElMessage({
      message: '卡牌数量不够无法抽取',
      grouping: true,
      type: 'error'
    })
    closeDeck()
    return
  }

  deckDialogVisible.value = true

  // 存卡
  deck.value = shuffle(deck.value)
  // console.log(deck.value)
}

// 卡池关闭事件
const closeDeck = () => {
  deckDialogVisible.value = false
  setTimeout(() => {
    decks.value = Array.from({ length: 5 }, () => false)
    flips.value = Array.from({ length: 12 }, () => false)
  }, 300)
}

// 获取卡组列表数量
const setDeckListCount = () => {
  microGainCountTemp.value = getDeckListTypeCount(deck.value, 'MicroGain')
  strongGainCountTemp.value = getDeckListTypeCount(deck.value, 'StrongGain')
  opportunityCountTemp.value = getDeckListTypeCount(deck.value, 'Opportunity')
  microDiscomfortCountTemp.value = getDeckListTypeCount(deck.value, 'MicroDiscomfort')
  strongDiscomfortCountTemp.value = getDeckListTypeCount(deck.value, 'StrongDiscomfort')
  unacceptableCountTemp.value = getDeckListTypeCount(deck.value, 'Unacceptable')
  technologyCountTemp.value = getDeckListTypeCount(deck.value, 'Technology')
  supportCountTemp.value = getDeckListTypeCount(deck.value, 'Support')
}

// 卡牌点击事件
const clickCard = (card: any, index: any) => {
  const userStore = useUserStore()

  if (userStore.drawCount <= 0) {
    ElMessage({
      message: '你没有抽卡机会！',
      grouping: true,
      type: 'error'
    })
    return
  }

  if (!flips.value[index]) {
    flips.value[index] = true
    // console.log(card)
    saveDeck(card)
    setCardCount()
  }
}

// 设置卡牌数量
const setCardCount = () => {
  microGainCount.value = getCardCount(deckType[0])
  strongGainCount.value = getCardCount(deckType[1])
  opportunityCount.value = getCardCount(deckType[2])
  microDiscomfortCount.value = getCardCount(deckType[3])
  strongDiscomfortCount.value = getCardCount(deckType[4])
  unacceptableCount.value = getCardCount(deckType[5])
  technologyCount.value = getCardCount(deckType[6])
  supportCount.value = getCardCount(deckType[7])
}

// 稳妥起见
// 卡池1 稳妥起见 safe   7张微弱增益 1张强大增益 4张微弱不适
const getSafeDeck = () => {
  let safeDeck: any = []

  const microGainCount = getCardCount('MicroGain')
  const stringGainCount = getCardCount('StrongGain')
  const microDiscomfortCount = getCardCount('MicroDiscomfort')

  if (microGainCount < 7 || stringGainCount < 1 || microDiscomfortCount < 4) return

  const microGainList = getDeckList('MicroGain', 7)
  const strongGainList = getDeckList('StrongGain', 1)
  const microDiscomfortList = getDeckList('MicroDiscomfort', 4)

  safeDeck = safeDeck.concat(microGainList).concat(strongGainList).concat(microDiscomfortList)

  return safeDeck
}

// 身不由己
// 卡池2 险中求胜 danger 5张微弱增益 2张强大增益 1张欧皇增益 1张微弱不适 3张重度不适
const getDangerDeck = () => {
  let dangerDeck: any = []

  const microGainCount = getCardCount('MicroGain')
  const strongGainCount = getCardCount('StrongGain')
  const opportunityCount = getCardCount('Opportunity')
  const microDiscomfortCount = getCardCount('MicroDiscomfort')
  const strongDiscomfortCount = getCardCount('StrongDiscomfort')

  if (
    microGainCount < 5 ||
    strongGainCount < 2 ||
    microDiscomfortCount < 1 ||
    strongDiscomfortCount < 3
  )
    return

  const microGainList = getDeckList('MicroGain', 5)
  const strongGainList = getDeckList('StrongGain', 2)
  const microDiscomfortList = getDeckList('MicroDiscomfort', 1)
  const strongDiscomfortList = getDeckList('StrongDiscomfort', 3)

  dangerDeck = dangerDeck
    .concat(microGainList)
    .concat(strongGainList)
    .concat(microDiscomfortList)
    .concat(strongDiscomfortList)

  let card
  let deckList

  if (opportunityCount != 0) {
    deckList = getDeckListType('Opportunity')
  } else {
    if (strongGainCount < 3) return
    deckList = getDeckListType('StrongGain')
  }

  while (dangerDeck.length != 12) {
    card = lotteryByCount(deckList)
    if (checkDeck(dangerDeck, card) && card != undefined) {
      dangerDeck.push(card)
    }
  }

  return dangerDeck
}

// 赌徒对弈
// 卡池3 对赌博弈 gambit 5张强大增益 1张欧皇增益 5张重度不适 1张反人类
const getGambitDeck = () => {
  let gambitDeck: any = []

  const strongGainCount = getCardCount('StrongGain')
  const opportunityCount = getCardCount('Opportunity')
  const strongDiscomfortCount = getCardCount('StrongDiscomfort')
  const unacceptableCount = getCardCount('Unacceptable')

  if (strongGainCount < 5 || strongDiscomfortCount < 5) return

  const strongGainList = getDeckList('StrongGain', 5)
  const strongDiscomfortList = getDeckList('StrongDiscomfort', 5)

  gambitDeck = gambitDeck.concat(strongGainList).concat(strongDiscomfortList)

  let card
  let deckList

  if (opportunityCount != 0) {
    deckList = getDeckListType('Opportunity')
  } else {
    if (strongGainCount < 6) return

    deckList = getDeckListType('StrongGain')
  }

  while (gambitDeck.length != 11) {
    card = lotteryByCount(deckList)
    if (checkDeck(gambitDeck, card) && card != undefined) {
      gambitDeck.push(card)
    }
  }

  if (unacceptableCount != 0) {
    deckList = getDeckListType('Unacceptable')
  } else {
    if (strongDiscomfortCount < 6) return

    deckList = getDeckListType('StrongDiscomfort')
  }

  while (gambitDeck.length != 12) {
    card = lotteryByCount(deckList)
    if (checkDeck(gambitDeck, card) && card != undefined) {
      gambitDeck.push(card)
    }
  }

  return gambitDeck
}

// 时来运转
// 卡池4 时来运转 luck   1张强大增益 1张欧皇增益 1张重度不适 1张反人类 8张特殊卡牌
const getLuckDeck = () => {
  let luckDeck: any = []

  const strongGainCount = getCardCount('StrongGain')
  const opportunityCount = getCardCount('Opportunity')
  const strongDiscomfortCount = getCardCount('StrongDiscomfort')
  const unacceptableCount = getCardCount('Unacceptable')
  const technologyCount = getCardCount('Technology')

  if (strongGainCount < 1 || strongDiscomfortCount < 1 || technologyCount < 8) return

  const strongGainList = getDeckList('StrongGain', 1)
  const strongDiscomfortList = getDeckList('StrongDiscomfort', 1)
  const technologyList = getDeckList('Technology', 8)

  luckDeck = luckDeck.concat(strongGainList).concat(strongDiscomfortList).concat(technologyList)

  let card
  let deckList

  if (opportunityCount != 0) {
    deckList = getDeckListType('Opportunity')
  } else {
    if (strongGainCount < 2) return

    deckList = getDeckListType('StrongGain')
  }

  while (luckDeck.length != 11) {
    card = lotteryByCount(deckList)
    if (checkDeck(luckDeck, card) && card != undefined) {
      luckDeck.push(card)
    }
  }

  if (unacceptableCount != 0) {
    deckList = getDeckListType('Unacceptable')
  } else {
    if (strongDiscomfortCount < 2) return

    deckList = getDeckListType('StrongDiscomfort')
  }

  while (luckDeck.length != 12) {
    card = lotteryByCount(deckList)
    if (checkDeck(luckDeck, card) && card != undefined) {
      luckDeck.push(card)
    }
  }

  return luckDeck
}

// 身心奉献
// 卡池5 身心奉献 devote 6张辅助卡牌 6张重度不适
const getDevoteDeck = () => {
  let devoteDeck: any = []

  const microGainCount = getCardCount('MicroGain')
  const StrongDiscomfortCount = getCardCount('StrongDiscomfort')
  const supportCount = getCardCount('Support')

  if (StrongDiscomfortCount < 6) return

  const StrongDiscomfortList = getDeckList('StrongDiscomfort', 6)

  devoteDeck = devoteDeck.concat(StrongDiscomfortList)

  let card
  let deckList
  const deckLength = devoteDeck.length + supportCount - 1

  while (devoteDeck.length != deckLength) {
    deckList = getDeckListType('Support')
    card = lotteryByCount(deckList)
    if (checkDeck(devoteDeck, card) && card != undefined) {
      devoteDeck.push(card)
    }
  }

  if (microGainCount < 7 - supportCount) return

  while (devoteDeck.length != 12) {
    deckList = getDeckListType('MicroGain')
    card = lotteryByCount(deckList)
    if (checkDeck(devoteDeck, card) && card != undefined) {
      devoteDeck.push(card)
    }
  }

  return devoteDeck
}

// 获取卡牌列表
const getDeckList = (type: string, length: number) => {
  const newDeckList: any[] = []
  const deckList = getDeckListType(type)
  let card

  while (newDeckList.length != length) {
    card = lotteryByCount(deckList)
    if (checkDeck(newDeckList, card) && card != undefined) {
      newDeckList.push(card)
    }
  }

  return newDeckList
}

// 手卡
const saveDeck = (card: any) => {
  console.log(card)

  const userStore = useUserStore()
  userStore.deckList[card.type].push(card)

  const deckList = getDeckListType(card.type)

  for (let i = 0; i < deck.value.length; i++) {
    if (deckList[i].id == card.id) {
      deckList[i].count -= 1
      break
    }
  }

  userStore.drawCount -= 1
  drawCardCount.value = userStore.drawCount
  specialCard(card)
  console.log(userStore.deckList)
}

// 随机卡牌
// function getRandomCard() {
//     let card = null;
//
//     while (card == null) {
//         let index = Math.round(Math.random() * (deckType.length - 1));
//         console.log(deckType[index]);
//         card = lotteryByCount(gameConfig.deck[deckType[index]]);
//         console.log(card);
//     }
//
//     return card;
// }

// 获取卡牌总数量
// function getAllCardCount() {
//     let cardCount = 0;
//
//     for (let i = 0; i < deckType.length; i++) {
//         let cardType = deckType[i];
//
//         for (let j = 0; j < gameConfig.deck[cardType].length; j++) {
//             if (gameConfig.deck[cardType][j].count != 0) {
//                 cardCount += 1;
//             }
//         }
//     }
//
//     return cardCount;
// }

// 获取卡牌数量
const getCardCount = (cardType: string) => {
  const deckList = getDeckListType(cardType)
  let cardCount = 0

  for (const tempCard of deckList) {
    if (tempCard.count != 0) {
      cardCount += 1
    }
  }

  return cardCount
}

// 获得卡组剩余数量
const getDeckListAll = (deckType: string) => {
  const deckListStore: any = useDeckListStore()
  const deckList: any[] = []

  deckListStore.deck[deckType].forEach((card: any) => {
    deckList.push(card)
  })

  return deckList
}

// 特殊卡牌处理机制 ↓
const specialCard = (card: any) => {
  const userStore = useUserStore()
  const players = ref([1, 2, 3, 4, 5, 6])
  let str = ''

  // 特殊卡牌
  // ---------------------------------

  // 收过路费
  if (card.name == 'Capitalism') {
    deleteCard(card)
    const roleId = Number(userStore.roleId)
    const player1 = roleId + 2 > 6 ? roleId + 2 - 6 : roleId + 2
    const player2 = roleId - 2 < 1 ? roleId - 2 + 6 : roleId - 2
    str = `获得 ${player1}号 和 ${player2}号 玩家的一半货币`
  }

  // 生财有道
  if (card.name == 'Make-Wealth') {
    deleteCard(card)

    userStore.playerMoney += 6
    str = '货币 +6'
  }

  // 起手换牌
  if (card.name == 'Change-Card') {
    const deckListStore: any = useDeckListStore()
    let cardNum = 0
    let drawsCount = 0

    deckType.forEach((tempType: string) => {
      const deckList = deckListStore[tempType]
      deckList.forEach((card: any) => {
        deleteCard(card)
        cardNum += 1
        drawsCount += 1
      })
    })

    userStore.drawCount += drawsCount
    str = `回收了 ${cardNum} 张卡牌 已兑换成 ${drawsCount} 次抽卡机会`
  }

  // 恶魔契约
  if (card.name == 'Devils-Pact') {
    deleteCard(card)
    userStore.devilspact = 2

    str = '恶魔契约已启用：每在商店购买一次装备就获得一次抽卡机会（至多触发两次）'
  }

  // 上贡
  if (card.name == 'Tribute') {
    deleteCard(card)
    const id = Number(userStore.roleId) != 1 ? 1 : 2
    str = `从你的增益卡牌中挑选一张送给 ${id}号 玩家`
  }

  // 决斗
  if (card.name == 'Duel') {
    deleteCard(card)

    do {
      players.value = shuffle(players.value)
    } while (players.value[0] == userStore.roleId)
    str =
      `你与 ${players.value[0]} 号玩家签订决斗协议，你们立即前往私人熔炉竞技场的生存使用当前拥有的武器技能` +
      '决斗，获得第一个回合胜利的玩家得到失败者的一半货币，不许认输！'
  }

  // 等价交换
  if (card.name == 'Equivalent-Exchange') {
    deleteCard(card)

    do {
      players.value = shuffle(players.value)
    } while (players.value[0] == userStore.roleId)

    str = `你需要和 ${players.value[0]}号 玩家进行所有卡牌交换`
  }

  // 有福同享
  if (card.name == 'Blessed-To-Share') {
    deleteCard(card)

    do {
      players.value = shuffle(players.value)
    } while (players.value[0] == userStore.roleId)

    str = `你需要和 ${players.value[0]}号 玩家进行增益卡牌共享`
  }

  // 有难同当
  if (card.name == 'Share-The-Difficulties') {
    deleteCard(card)

    do {
      players.value = shuffle(players.value)
    } while (players.value[0] == userStore.roleId)

    str = `你需要和 ${players.value[0]}号 玩家进行减益卡牌共享`
  }

  // 十三幺
  if (card.name == 'Thirteen-Orphans') {
    deleteCard(card)
    const userStore = useUserStore()
    userStore.closeDeck = true
    userStore.deckList = {
      MicroGain: [
        {
          id: 'MG15',
          type: 'MicroGain',
          name: 'Osteo-Striga',
          cardName: '尖啸群击',
          description: '获得异域武器枯骨鳞片',
          priority: 'none',
          weight: 0.058823,
          count: 0
        }
      ],
      StrongGain: [
        {
          id: 'SG1',
          type: 'StrongGain',
          name: 'All-Out',
          cardName: '全胜姿态',
          description: '获得所有模组使用权',
          priority: 'none',
          weight: 0.066667,
          count: 0
        },
        {
          id: 'SG2',
          type: 'StrongGain',
          name: 'Darkness-Servant-1',
          cardName: '暗影仆从 · 一',
          description: '获得冰影的全部力量（包括星象与碎片，超能）',
          priority: 'none',
          weight: 0.066667,
          count: 0
        },
        {
          id: 'SG3',
          type: 'StrongGain',
          name: 'Darkness-Servant-2',
          cardName: '暗影仆从 · 二',
          description: '获得缚丝的全部力量（包括星象与碎片，超能）',
          priority: 'none',
          weight: 0.066667,
          count: 0
        },
        {
          id: 'SG4',
          type: 'StrongGain',
          name: 'Light-Bringer-1',
          cardName: '光能使者 · 一',
          description: '获得雷电的全部力量（包括星象与碎片，超能）',
          priority: 'none',
          weight: 0.066667,
          count: 0
        },
        {
          id: 'SG5',
          type: 'StrongGain',
          name: 'Light-Bringer-2',
          cardName: '光能使者 · 二',
          description: '获得烈日的全部力量（包括星象与碎片，超能）',
          priority: 'none',
          weight: 0.066667,
          count: 0
        },
        {
          id: 'SG6',
          type: 'StrongGain',
          name: 'Light-Bringer-3',
          cardName: '光能使者 · 三',
          description: '获得虚空的全部力量（包括星象与碎片，超能）',
          priority: 'none',
          weight: 0.066667,
          count: 0
        },
        {
          id: 'SG15',
          type: 'StrongGain',
          name: 'Paladin',
          cardName: '圣骑士',
          description: '泰坦获得挽歌 / 猎人获得心影 / 术士获得零号世界线',
          priority: 'none',
          weight: 0.066667,
          count: 0
        }
      ],
      Opportunity: [
        {
          id: 'O1',
          type: 'Opportunity',
          name: 'Armory',
          cardName: '自选军火库',
          description:
            '从仓库中调取一把异域武器，一把传说武器，一个异域护甲，并且它们会永远跟随着你，不会因其他效果消失',
          priority: 'none',
          weight: 0.25,
          count: 0
        }
      ],
      MicroDiscomfort: [],
      StrongDiscomfort: [
        {
          id: 'SD2',
          type: 'StrongDiscomfort',
          name: 'Reicher-Playboy',
          cardName: '纨绔子弟',
          description: '商店贩卖所有物品价格+1',
          priority: 'special',
          weight: 0.05,
          count: 0
        },
        {
          id: 'SD3',
          type: 'StrongDiscomfort',
          name: 'Assassin',
          cardName: '暗杀者',
          description: '你需要把一把武器槽设置为弓箭，偃月或者刀剑',
          priority: 'none',
          weight: 0.05,
          count: 0
        },
        {
          id: 'SD13',
          type: 'StrongDiscomfort',
          name: 'Protect-Target',
          cardName: '保护目标',
          description: '你在遭遇战中不能死亡，否则团灭',
          priority: 'none',
          weight: 0.05,
          count: 0
        }
      ],
      Unacceptable: [],
      Technology: [],
      Support: [
        {
          id: 'S5',
          type: 'Support',
          name: 'Weaken',
          cardName: '弱化',
          description: '获得异域武器牵引器火炮',
          priority: 'none',
          weight: 0.142857,
          count: 0
        }
      ]
    }
    str = '你立刻获取十三张卡牌，失去抽取卡牌功能，你需要携带这十三张卡牌完成本次突袭'
  }

  // 欧皇附体
  if (card.name == 'Lucky-Man') {
    deleteCard(card)
    str = '你可以直接从卡池中选取一张欧皇增益'
  }

  // 倒霉蛋
  if (card.name == 'Unlucky-Man') {
    deleteCard(card)

    const deckListStore: any = useDeckListStore()
    const deckList = deckListStore[deckType[4]]
    const tempCard = lottery(deckList)
    console.log(tempCard)
    userStore.deckList[deckType[4]].push(tempCard)

    str = `已添加 ${tempCard.cardName} 卡牌至重度不适中`
  }

  // 暴君
  if (card.name == 'Tyrant') {
    deleteCard(card)
    str = '你可以拿取任意一名玩家的增益卡片'
  }

  // 天使
  if (card.name == 'Angel') {
    deleteCard(card)
    str = '你可以帮助任意一名玩家消除一张减益卡片'
  }

  // 恶魔
  if (card.name == 'Devil') {
    deleteCard(card)
    str = '你可以让任意一名玩家抽取一次对赌博弈'
  }

  // 未来市场
  if (card.name == "Future's-Market") {
    str = '你可以贷款购买武器物品，代价是贷款的钱不能买圣水'
    userStore.market = true
  }

  // 强买强卖
  if (card.name == 'Hard-Sells') {
    deleteCard(card)
    str = '你可以让任意一名队友购买你的异域武器售价为 10 货币'
  }

  // 微弱不适

  // 强烈不适

  // 卧槽我钱包呢
  if (card.name == 'Lost-Wallet') {
    deleteCard(card)

    userStore.playerMoney = 0
    str = '杂鱼~你的货币全没了哦~'
  }

  if (str != '') {
    ElMessage({
      message: str,
      grouping: true,
      showClose: true,
      duration: 0
    })
  }
}

// 初始化
const initDeck = () => {
  // 读取存档
  const userStore = useUserStore()

  drawCardCount.value = userStore.drawCount
  setCardCount()
  deckClosed.value = false
  deckListName.value = ''
  deckListText.value = ''
  microGainCountTemp.value = 0
  strongGainCountTemp.value = 0
  opportunityCountTemp.value = 0
  microDiscomfortCountTemp.value = 0
  strongDiscomfortCountTemp.value = 0
  unacceptableCountTemp.value = 0
  technologyCountTemp.value = 0
  supportCountTemp.value = 0
  flips.value = Array.from({ length: 12 }, () => false)
  deckInfoDialogVisible.value = false
  decks.value = Array.from(Array.from({ length: 5 }, () => false))
  deck.value = []

  // 戒赌
  userStore.deckList[deckType[5]].forEach((card: any) => {
    if (card.name == 'Quit-Gambling') {
      ElMessage({
        message: '您的抽卡系统已被关闭！请前往商店进行清除卡片',
        grouping: true,
        showClose: true,
        type: 'error',
        duration: 0
      })

      deckClosed.value = true
    }
  })

  if (userStore.closeDeck) {
    deckClosed.value = true
  }
}
initDeck()
</script>

<template>
  <div id="deck">
    <h1 class="deck-title">您有 {{ drawCardCount }} 次抽取卡牌的机会</h1>

    <div class="deck-list">
      <div class="deck">
        <div class="deck-1" id="safe" @click="showDeck('safe')"></div>
        <p class="deck-name">- 稳妥起见 -</p>
      </div>
      <div class="deck">
        <div class="deck-2" id="danger" @click="showDeck('danger')"></div>
        <p class="deck-name">- 险中求胜 -</p>
      </div>
      <div class="deck">
        <div class="deck-3" id="gambit" @click="showDeck('gambit')"></div>
        <p class="deck-name">- 对赌博弈 -</p>
      </div>
      <div class="deck">
        <div class="deck-4" id="luck" @click="showDeck('luck')"></div>
        <p class="deck-name">- 时来运转 -</p>
      </div>
      <div class="deck">
        <div class="deck-5" id="devote" @click="showDeck('devote')"></div>
        <p class="deck-name">- 身心奉献 -</p>
      </div>
    </div>

    <p class="deck-count">
      当前卡池数量： 微弱增益：{{ microGainCount }} 张 | 强大增益：{{ strongGainCount }} 张 |
      欧皇卡牌：{{ opportunityCount }} 张 | 微弱不适：{{ microDiscomfortCount }} 张 | 重度不适：{{
        strongDiscomfortCount
      }}
      张 | 反人类：{{ unacceptableCount }} 张 | 特殊卡牌：{{ technologyCount }} 张 | 辅助卡牌：{{
        supportCount
      }}
      张
    </p>

    <button class="button deck-info" @click="deckInfoDialogVisible = true">卡池信息</button>

    <!-- 卡池信息框 -->
    <el-dialog
      class="dialog deck-info-dialog"
      v-model="deckInfoDialogVisible"
      :close-on-click-modal="false"
      width="79.25rem"
      align-center
    >
      <div class="deck-list-info">
        <h1>卡池信息</h1>
        <p class="deck-type-info safe">
          卡池1 稳妥起见 - safe（7张微弱增益 1张强大增益 4张微弱不适）
        </p>
        <p class="deck-type-info danger">
          卡池2 险中求胜 - danger (5张微弱增益 2张强大增益 1张欧皇增益 1张微弱不适 3张重度不适)
        </p>
        <p class="deck-type-info gambit">
          卡池3 对赌博弈 - gambit（5张强大增益 1张欧皇增益 5张重度不适 1张反人类）
        </p>
        <p class="deck-type-info luck">
          卡池4 时来运转 - luck（1张强大增益 1张欧皇增益 1张重度不适 1张反人类 8张特殊卡牌）
        </p>
        <p class="deck-type-info devote">卡池5 身心奉献 - devote（6张辅助卡牌 6张重度不适）</p>
        <p class="deck-type-info">
          如果想玩安逸的则可以抽取 稳妥起见， 如果想体验一点刺激的则可以抽取 险中求胜，
          如果想当赌狗玩更刺激的则可以抽取 对赌博弈， 如果想逆转命运的则可以抽取 时来运转，
          如果想为团队当工具人的则可以抽取 身心奉献
        </p>
      </div>
      <div class="deck-confirm-box">
        <button type="button" class="button deck-cancel" @click="deckInfoDialogVisible = false">
          取消
        </button>
      </div>
    </el-dialog>

    <!-- 卡牌抽奖模态框 -->
    <el-dialog
      class="dialog deck-dialog"
      v-model="deckDialogVisible"
      :close-on-click-modal="false"
      width="79.25rem"
      align-center
    >
      <div class="deck-list-info">
        <p class="deck-list-name">
          {{ deckListName }}
        </p>
        <p class="deck-list-count">卡池说明：{{ deckListText }}</p>
      </div>
      <div
        class="deck-list-box"
        :class="{
          'deck-1': decks[0],
          'deck-2': decks[1],
          'deck-3': decks[2],
          'deck-4': decks[3],
          'deck-5': decks[4]
        }"
      >
        <div
          class="card-item"
          v-for="(card, index) in deck"
          :key="index"
          @click="clickCard(card, index)"
          :class="{ flip: flips[index] }"
        >
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
        <button type="button" class="button deck-cancel" @click="closeDeck">取消</button>
      </div>
    </el-dialog>

    <div class="deck-closed" v-if="deckClosed"></div>
  </div>
</template>

<style lang="scss">
@import '@/assets/styles/deck';
</style>

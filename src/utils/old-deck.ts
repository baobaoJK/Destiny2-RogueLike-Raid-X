import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useDeckListStore, useUserStore } from '@/stores'
import { lotteryByCount, randomNum } from '@/utils'

// 卡组类型表
export const deckType = [
  'MicroGain',
  'StrongGain',
  'Opportunity',
  'MicroDiscomfort',
  'StrongDiscomfort',
  'Unacceptable',
  'Technology',
  'Support'
]

// 卡牌类型名称
export const cardTypeListName = [
  '微弱增益',
  '强大增益',
  '欧皇增益',
  '微弱不适',
  '重度不适',
  '反人类',
  '特殊卡牌',
  '辅助卡牌'
]

// 获取卡牌类型中文名称
export const getCardTypeName = (type: string) => cardTypeListName[deckType.indexOf(type)]

// 获取卡组列表卡牌数量
export const getDeckListCount = (deck: any[]) => {
  const count = deck.reduce((count: number, item: any) => {
    return count + item.count
  }, 0)

  return count
}

// 获取卡牌列表卡牌数量
export const getDeckListTypeCount = (deck: any[], type: string) => {
  let count = 0
  if (deck == undefined) return count

  for (const card of deck) {
    if (card.type == type && card.count != 0) {
      count += 1
    }
  }

  return count
}

// 获取卡组类型
export const getDeckListType = (typeName: string) => {
  const deckList = ref()
  const deckListStore = useDeckListStore()

  switch (typeName) {
    case 'MicroGain':
      deckList.value = deckListStore.microGain
      break
    case 'StrongGain':
      deckList.value = deckListStore.strongGain
      break
    case 'Opportunity':
      deckList.value = deckListStore.opportunity
      break
    case 'MicroDiscomfort':
      deckList.value = deckListStore.microDiscomfort
      break
    case 'StrongDiscomfort':
      deckList.value = deckListStore.strongDiscomfort
      break
    case 'Unacceptable':
      deckList.value = deckListStore.unacceptable
      break
    case 'Technology':
      deckList.value = deckListStore.technology
      break
    case 'Support':
      deckList.value = deckListStore.support
      break
    default:
      break
  }

  return deckList.value
}

// 获取玩家卡组类型
export const getPlayerDeckListType = (typeName: string) => {
  const deckList = ref()
  const userStore = useUserStore()

  switch (typeName) {
    case 'MicroGain':
      deckList.value = userStore.deckList.MicroGain
      break
    case 'StrongGain':
      deckList.value = userStore.deckList.StrongGain
      break
    case 'Opportunity':
      deckList.value = userStore.deckList.Opportunity
      break
    case 'MicroDiscomfort':
      deckList.value = userStore.deckList.MicroDiscomfort
      break
    case 'StrongDiscomfort':
      deckList.value = userStore.deckList.StrongDiscomfort
      break
    case 'Unacceptable':
      deckList.value = userStore.deckList.Unacceptable
      break
    case 'Technology':
      deckList.value = userStore.deckList.Technology
      break
    case 'Support':
      deckList.value = userStore.deckList.Support
      break
    default:
      break
  }

  return deckList.value
}

// 删除亚托克斯卡牌
export const deleteAatroxCard = () => {
  const userStore = useUserStore()
  const deckList = userStore.deckList[deckType[4]]
  const newDeckList = []

  for (let i = 0; i < deckList.length; i++) {
    if (deckList[i].id == 'Aatrox') {
      deckList[i] = null
      break
    }
  }

  for (const card of deckList) {
    if (card != null) {
      newDeckList.push(card)
    }
  }

  userStore.deckList[deckType[4]] = newDeckList

  ElMessage({
    message: '已删除 - 亚托克斯 - 卡牌',
    grouping: true,
    type: 'success'
  })
}

// 获取某种类型的卡牌数量
export const getCardCount = (cardType: string) => {
  const deckList = getDeckListType(cardType)
  let cardCount = 0

  for (const tempCard of deckList) {
    if (tempCard.count != 0) {
      cardCount += 1
    }
  }

  return cardCount
}

// 获取某种卡牌列表
export const getDeckList = (type: string, length: number) => {
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

// 更改卡牌数量
export const changeCardCount = (card: any) => {
  const deckList = getDeckListType(card.type)

  for (let i = 0; i < deckList.length; i++) {
    if (deckList[i].id == card.id) {
      deckList[i].count = 0
      break
    }
  }
}

// 卡牌去重
export const checkDeck = (deck: any[], card: any[]) => {
  for (const tempCard of deck) {
    if (tempCard == card) {
      return false
    }
  }

  return true
}

// 存储卡牌
export const saveCard = (card: any) => {
  const userStore = useUserStore()

  let isExist = false
  userStore.deckList[card.type].forEach((item: any) => {
    if (item.name === card.name) {
      isExist = true
    }
  })

  let str = ''
  let messageType: any = ''

  if (!isExist) {
    // 特殊卡牌处理
    specialCard(card)

    str = `已添加 - ${card.cardName} - 卡牌`
    messageType = 'success'
  } else {
    str = `添加失败，此卡牌已存在`
    messageType = 'error'
  }

  ElMessage({
    message: str,
    grouping: true,
    type: messageType
  })
}

// 删除卡片
export const deleteCard = (card: any) => {
  console.log('删除卡牌机制')
  console.log(card)

  const userStore = useUserStore()
  const deckList = userStore.deckList[card.type]
  console.log(deckList)

  if (card.id == 'Aatrox') {
    deleteAatroxCard()
    return
  }

  for (let i = 0; i < deckList.length; i++) {
    if (deckList[i].id == card.id) {
      deckList[i] = null
      break
    }
  }

  // 卡牌回收机制
  // const tempDeck = gameConfig.deck[card.type];
  //
  // for (let j = 0; j < tempDeck.length; j++) {
  //     if (tempDeck[j].id == card.id) {
  //         gameConfig.deck[card.type][j].count += 1;
  //         break;
  //     }
  // }

  const newDeckList = []

  for (const tempCard of deckList) {
    if (tempCard != null) {
      newDeckList.push(tempCard)
    }
  }

  userStore.deckList[card.type] = newDeckList

  ElMessage({
    message: '你已删除 - ' + card.cardName + ' - 卡牌',
    grouping: true,
    type: 'success'
  })
}

// 稳妥起见
// 卡池1 稳妥起见 safe   7张微弱增益 1张强大增益 4张微弱不适
export const getSafeDeck = () => {
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
export const getDangerDeck = () => {
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
export const getGambitDeck = () => {
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
export const getLuckDeck = () => {
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
export const getDevoteDeck = () => {
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

// 特殊卡牌处理机制 ↓
export const specialCard = (card: any) => {
  const userStore = useUserStore()
  let id = 0
  let str = ''
  let doDelete = false

  // 特殊卡牌
  // ---------------------------------

  // 收过路费
  if (card.name == 'Capitalism') {
    doDelete = true
    const roleId = Number(userStore.roleId)
    const player1 = roleId + 2 > 6 ? roleId + 2 - 6 : roleId + 2
    const player2 = roleId - 2 < 1 ? roleId - 2 + 6 : roleId - 2
    str = `获得 ${player1}号 和 ${player2}号 玩家的一半货币`
  }

  // 生财有道
  if (card.name == 'Make-Wealth') {
    doDelete = true

    userStore.playerMoney += 6
    str = '货币 +6'
  }

  // 起手换牌
  if (card.name == 'Change-Card') {
    doDelete = true
    const playerDeckList = userStore.deckList
    let cardNum = 0
    let drawsCount = 0

    deckType.forEach((cardType: string) => {
      const deckList = playerDeckList[cardType]
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
    doDelete = true
    userStore.devilspact = 2

    str = '恶魔契约已启用：每在商店购买一次装备就获得一次抽卡机会（至多触发两次）'
  }

  // 上贡
  if (card.name == 'Tribute') {
    doDelete = true
    do {
      id = randomNum(1, 6)
    } while (id === userStore.roleId)
    str = `从你的增益卡牌中挑选一张送给 ${id}号 玩家`
  }

  // 决斗
  if (card.name == 'Duel') {
    doDelete = true

    do {
      id = randomNum(1, 6)
    } while (id === userStore.roleId)
    str =
      `你与 ${id} 号玩家签订决斗协议，你们立即前往私人熔炉竞技场的生存使用当前拥有的武器技能` +
      '决斗，获得第一个回合胜利的玩家得到失败者的一半货币，不许认输！'
  }

  // 等价交换
  if (card.name == 'Equivalent-Exchange') {
    doDelete = true

    do {
      id = randomNum(1, 6)
    } while (id === userStore.roleId)

    str = `你需要和 ${id}号 玩家进行所有卡牌交换`
  }

  // 有福同享
  if (card.name == 'Blessed-To-Share') {
    do {
      id = randomNum(1, 6)
    } while (id === userStore.roleId)

    str = `你需要和 ${id}号 玩家进行增益卡牌共享`
    card.description = str
  }

  // 有难同当
  if (card.name == 'Share-The-Difficulties') {
    do {
      id = randomNum(1, 6)
    } while (id === userStore.roleId)

    str = `你需要和 ${id}号 玩家进行减益卡牌共享`
    card.description = str
  }

  // 十三幺
  if (card.name == 'Thirteen-Orphans') {
    doDelete = true
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
    doDelete = true
    str = '你可以直接从卡池中选取一张欧皇增益'
  }

  // 倒霉蛋
  if (card.name == 'Unlucky-Man') {
    doDelete = true

    const deckListStore = useDeckListStore()
    const deckList = deckListStore.strongDiscomfort
    const tempCard = lotteryByCount(deckList)
    console.log(tempCard)
    userStore.deckList.StrongDiscomfort.push(tempCard)

    str = `已添加 ${tempCard.cardName} 卡牌至重度不适中`
  }

  // 暴君
  if (card.name == 'Tyrant') {
    doDelete = true
    str = '你可以拿取任意一名玩家的增益卡片'
  }

  // 天使
  if (card.name == 'Angel') {
    doDelete = true
    str = '你可以帮助任意一名玩家消除一张减益卡片'
  }

  // 恶魔
  if (card.name == 'Devil') {
    doDelete = true
    str = '你可以让任意一名玩家抽取一次对赌博弈'
  }

  // 未来市场
  if (card.name == "Future's-Market") {
    str = '你可以贷款购买武器物品，代价是贷款的钱不能买圣水'
  }

  // 强买强卖
  if (card.name == 'Hard-Sells') {
    doDelete = true
    str = '你可以让任意一名队友购买你的异域武器售价为 10 货币'
  }

  // 卧槽我钱包呢
  if (card.name == 'Lost-Wallet') {
    doDelete = true

    userStore.playerMoney = 0
    str = '杂鱼~你的货币全没了哦~'
  }

  userStore.deckList[card.type].push(card)

  // 更改卡牌数量
  changeCardCount(card)

  if (doDelete) {
    deleteCard(card)
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

// 获得卡组剩余数量
// const getDeckListAll = (deckType: string) => {
//   const deckListStore: any = useDeckListStore()
//   const deckList: any[] = []

//   deckListStore.deck[deckType].forEach((card: any) => {
//     deckList.push(card)
//   })

//   return deckList
// }

import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useDeckListStore, useUserStore } from '@/stores'
import { lottery, lotteryByCount, randomNum, shuffle } from '@/utils'

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

// 十三幺卡牌
const thirteenList = [
  {
    id: 'MG15',
    type: 'MicroGain',
    tag: 'exotic-weapon',
    tagLevel: 1,
    name: 'Osteo-Striga',
    cardName: '尖啸群击',
    description: '获得异域武器枯骨鳞片',
    priority: 'none',
    weight: 0.052631,
    count: 0,
    idea: 'D2RRX'
  },
  {
    id: 'SG1',
    type: 'StrongGain',
    tag: 'modules',
    tagLevel: 3,
    name: 'All-Out',
    cardName: '全胜姿态',
    description: '获得所有模组使用权',
    priority: 'none',
    weight: 0.045454,
    count: 1,
    idea: 'D2RRX'
  },
  {
    id: 'SG2',
    type: 'StrongGain',
    tag: 'darkness',
    tagLevel: 1,
    name: 'Darkness-Servant-1',
    cardName: '暗影仆从 · 一',
    description:
      '获得冰影的全部力量（包括星象与碎片，超能）若你有一暗影仆从和一光能使者则可以解锁对应的棱镜技能',
    priority: 'none',
    weight: 0.045454,
    count: 1,
    idea: 'D2RRX'
  },
  {
    id: 'SG3',
    type: 'StrongGain',
    tag: 'darkness',
    tagLevel: 1,
    name: 'Darkness-Servant-2',
    cardName: '暗影仆从 · 二',
    description:
      '获得缚丝的全部力量（包括星象与碎片，超能）若你有一暗影仆从和一光能使者则可以解锁对应的棱镜技能',
    priority: 'none',
    weight: 0.045454,
    count: 1,
    idea: 'D2RRX'
  },
  {
    id: 'SG4',
    type: 'StrongGain',
    tag: 'light',
    tagLevel: 1,
    name: 'Light-Bringer-1',
    cardName: '光能使者 · 一',
    description:
      '获得雷电的全部力量（包括星象与碎片，超能）若你有一暗影仆从和一光能使者则可以解锁对应的棱镜技能',
    priority: 'none',
    weight: 0.045454,
    count: 1,
    idea: 'D2RRX'
  },
  {
    id: 'SG5',
    type: 'StrongGain',
    tag: 'light',
    tagLevel: 1,
    name: 'Light-Bringer-2',
    cardName: '光能使者 · 二',
    description:
      '获得烈日的全部力量（包括星象与碎片，超能）若你有一暗影仆从和一光能使者则可以解锁对应的棱镜技能',
    priority: 'none',
    weight: 0.045454,
    count: 1,
    idea: 'D2RRX'
  },
  {
    id: 'SG6',
    type: 'StrongGain',
    tag: 'light',
    tagLevel: 1,
    name: 'Light-Bringer-3',
    cardName: '光能使者 · 三',
    description:
      '获得虚空的全部力量（包括星象与碎片，超能）若你有一暗影仆从和一光能使者则可以解锁对应的棱镜技能',
    priority: 'none',
    weight: 0.045454,
    count: 1,
    idea: 'D2RRX'
  },
  {
    id: 'SG15',
    type: 'StrongGain',
    tag: 'exotic-weapon',
    tagLevel: 3,
    name: 'Paladin',
    cardName: '圣骑士',
    description: '泰坦获得挽歌 / 猎人获得心影 / 术士获得零号世界线',
    priority: 'none',
    weight: 0.045454,
    count: 1,
    idea: 'D2RRX'
  },
  {
    id: 'O4',
    type: 'Opportunity',
    tag: 'o',
    tagLevel: 3,
    name: 'Armory',
    cardName: '自选军火库',
    description:
      '从仓库中调取一把异域武器，一把传说武器，一个异域护甲，并且它们会永远跟随着你，不会因其他效果消失',
    priority: 'none',
    weight: 0.2,
    count: 1,
    idea: 'D2RRX'
  },
  {
    id: 'SD16',
    type: 'StrongDiscomfort',
    tag: 'sd',
    tagLevel: 3,
    name: 'Reicher-Playboy',
    cardName: '纨绔子弟',
    description: '商店贩卖所有物品价格+1',
    priority: 'special',
    weight: 0.05,
    count: 1,
    idea: 'D2RRX'
  },
  {
    id: 'SD8',
    type: 'StrongDiscomfort',
    tag: 'sd',
    tagLevel: 2,
    name: 'Assassin',
    cardName: '暗杀者',
    description: '你需要把一把武器槽设置为弓箭，偃月或者刀剑',
    priority: 'none',
    weight: 0.05,
    count: 1,
    idea: 'D2RRX'
  },
  {
    id: 'SD13',
    type: 'StrongDiscomfort',
    tag: 'sd',
    tagLevel: 2,
    name: 'Protect-Target',
    cardName: '保护目标',
    description: '你在遭遇战中不能死亡，否则团灭',
    priority: 'none',
    weight: 0.05,
    count: 1,
    idea: 'D2RRX'
  },
  {
    id: 'S5',
    type: 'Support',
    tag: 's',
    tagLevel: 1,
    name: 'Weaken',
    cardName: '弱化',
    description: '获得异域武器牵引器火炮',
    priority: 'none',
    weight: 0.125,
    count: 1,
    idea: 'D2RRX'
  }
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
export const checkDeck = (deck: any[], card: any) => {
  if (deck.length === 0) return true

  for (const tempCard of deck) {
    if (tempCard.id == card.id) {
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
    str = `添加失败 - ${card.cardName} - 已存在`
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

  // 十三幺
  if (card.name === 'Thirteen-Orphans') {
    thirteenList.forEach((card: any) => {
      deleteCard(card)
    })
  }
}

// 获取当前卡牌列表的标签等级数量
export const getDeckListTagLevelCount = (deckList: any, tagLevel: number) => {
  let count = 0

  deckList.forEach((card: any) => {
    if (card.tagLevel === tagLevel && card.count != 0) count++
  })

  return count
}

// 根据卡牌等级获取卡牌列表
export const getDeckListTagLevelList = (type: string, tagLevel: any) => {
  const tagLevelDeckList = []

  // T1 T2 T3 自适应
  // const microGainTagLevel = [2, 2, 3]
  const t1 = getDeckListTagLevelCount(getDeckListType(type), 1)
  const t2 = getDeckListTagLevelCount(getDeckListType(type), 2)
  const t3 = getDeckListTagLevelCount(getDeckListType(type), 3)

  // 判断数量是否满足
  if (t1 < tagLevel[0]) {
    while (t1 != tagLevel[0] && t2 != tagLevel[1]) {
      tagLevel[1] += 1
      tagLevel[0] -= 1
    }
  }

  if (t2 < tagLevel[1] && t3 > tagLevel[2]) {
    // 判断数量是否满足
    while (t2 != tagLevel[1] && t3 != tagLevel[2]) {
      tagLevel[2] += 1
      tagLevel[1] -= 1
    }
  }

  if (t2 < tagLevel[1] && t1 > tagLevel[0]) {
    // 判断数量是否满足
    while (t2 != tagLevel[1] && t1 != tagLevel[0]) {
      tagLevel[0] += 1
      tagLevel[1] -= 1
    }
  }

  if (t3 < tagLevel[2] && t2 > tagLevel[1]) {
    while (t3 != tagLevel[2] && t2 != tagLevel[1]) {
      tagLevel[1] += 1
      tagLevel[2] -= 1
    }
  }

  if (t3 < tagLevel[2] && t1 > tagLevel[0]) {
    while (t3 != tagLevel[2] && t1 != tagLevel[0]) {
      tagLevel[0] += 1
      tagLevel[2] -= 1
    }
  }

  // console.log('----------------------')
  // console.log(`${type} - T1 - ${t1}`)
  // console.log(`${type} - T2 - ${t2}`)
  // console.log(`${type} - T3 - ${t3}`)
  // console.log('----------------------')
  // console.log(`${type} - T1 - ${tagLevel[0]}`)
  // console.log(`${type} - T2 - ${tagLevel[1]}`)
  // console.log(`${type} - T3 - ${tagLevel[2]}`)
  // console.log('----------------------')

  let tagLevelListCount = 0
  for (let i = 0; i < tagLevel.length; i++) {
    tagLevelListCount += tagLevel[i]

    while (tagLevelDeckList.length !== tagLevelListCount) {
      const card = lotteryByCount(getDeckListType(type))
      if (checkDeck(tagLevelDeckList, card) && card != undefined && card.tagLevel === i + 1) {
        tagLevelDeckList.push(card)
      }
    }
  }

  return tagLevelDeckList
}

// 稳妥起见
// 卡池1 稳妥起见 safe   7张微弱增益 1张强大增益 4张微弱不适
export const getSafeDeck = () => {
  let safeDeck: any = []

  const microGainCount = getCardCount('MicroGain')
  const stringGainCount = getCardCount('StrongGain')
  const microDiscomfortCount = getCardCount('MicroDiscomfort')

  if (microGainCount < 7 || stringGainCount < 1 || microDiscomfortCount < 4) return

  const microGainList = getDeckListTagLevelList('MicroGain', [2, 2, 3])
  const strongGainList = getDeckListTagLevelList('StrongGain', shuffle([0, 0, 1]))
  const microDiscomfortList = getDeckListTagLevelList('MicroDiscomfort', [1, 1, 2])

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

  const microGainList = getDeckListTagLevelList('MicroGain', [1, 2, 2])
  const strongGainList = getDeckListTagLevelList('StrongGain', shuffle([0, 1, 1]))
  const microDiscomfortList = getDeckListTagLevelList('MicroDiscomfort', shuffle([0, 0, 1]))
  const strongDiscomfortList = getDeckListTagLevelList('StrongDiscomfort', [1, 1, 1])

  dangerDeck = dangerDeck
    .concat(microGainList)
    .concat(strongGainList)
    .concat(microDiscomfortList)
    .concat(strongDiscomfortList)

  if (opportunityCount != 0) {
    const opportunityList: any = getDeckListTagLevelList('Opportunity', shuffle([0, 0, 1]))
    dangerDeck = dangerDeck.concat(opportunityList)
  } else {
    if (strongGainCount < 3) return
    const strongGainList: any = getDeckListTagLevelList('StrongGain', shuffle([0, 0, 1]))
    dangerDeck = dangerDeck.concat(strongGainList)
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

  const strongGainList = getDeckListTagLevelList('StrongGain', [1, 2, 2])
  const strongDiscomfortList = getDeckListTagLevelList('StrongDiscomfort', [1, 2, 2])

  gambitDeck = gambitDeck.concat(strongGainList).concat(strongDiscomfortList)

  if (opportunityCount != 0) {
    const opportunityList = getDeckListTagLevelList('Opportunity', shuffle([0, 0, 1]))
    gambitDeck = gambitDeck.concat(opportunityList)
  } else {
    if (strongGainCount < 6) return
    const strongGainList = getDeckListTagLevelList('StrongGain', shuffle([0, 0, 1]))
    gambitDeck = gambitDeck.concat(strongGainList)
  }

  if (unacceptableCount != 0) {
    const unacceptableList = getDeckListTagLevelList('Unacceptable', shuffle([0, 0, 1]))
    gambitDeck = gambitDeck.concat(unacceptableList)
  } else {
    if (strongDiscomfortCount < 6) return
    const strongDiscomfortList = getDeckListTagLevelList('StrongDiscomfort', shuffle([0, 0, 1]))
    gambitDeck = gambitDeck.concat(strongDiscomfortList)
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

  const strongGainList = getDeckListTagLevelList('StrongGain', shuffle([0, 0, 1]))
  const strongDiscomfortList = getDeckListTagLevelList('StrongDiscomfort', shuffle([0, 0, 1]))
  const technologyList = getDeckListTagLevelList('Technology', [8, 0, 0])

  luckDeck = luckDeck.concat(strongGainList).concat(strongDiscomfortList).concat(technologyList)

  if (opportunityCount != 0) {
    const opportunityList = getDeckListTagLevelList('Opportunity', shuffle([0, 0, 1]))
    luckDeck = luckDeck.concat(opportunityList)
  } else {
    if (strongGainCount < 2) return
    const strongGainList = getDeckListTagLevelList('StrongGain', shuffle([0, 0, 1]))
    luckDeck = luckDeck.concat(strongGainList)
  }

  if (unacceptableCount != 0) {
    const unacceptableList = getDeckListTagLevelList('Unacceptable', shuffle([0, 0, 1]))
    luckDeck = luckDeck.concat(unacceptableList)
  } else {
    if (strongDiscomfortCount < 2) return
    const strongDiscomfortList = getDeckListTagLevelList('StrongDiscomfort', shuffle([0, 0, 1]))
    luckDeck = luckDeck.concat(strongDiscomfortList)
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

  const StrongDiscomfortList = getDeckListTagLevelList('StrongDiscomfort', [2, 2, 2])

  devoteDeck = devoteDeck.concat(StrongDiscomfortList)

  let card
  let deckList
  let deckLength = 12

  if (supportCount < 6) {
    deckLength = devoteDeck.length + supportCount
  }

  while (devoteDeck.length != deckLength) {
    deckList = getDeckListType('Support')
    card = lotteryByCount(deckList)
    if (checkDeck(devoteDeck, card) && card != undefined) {
      devoteDeck.push(card)
    }
  }
  console.log(devoteDeck.length)

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
  let str = card.description
  let doDelete = false

  // 特殊效果
  // --------------------------------
  // 不吃这套
  if (userStore.noDeal) {
    if (
      card.type === 'MicroDiscomfort' ||
      card.type === 'StrongDiscomfort' ||
      card.type === 'Unacceptable'
    ) {
      const tempCard = {
        id: 'T33',
        type: 'Technology',
        tag: 't',
        tagLevel: 1,
        name: 'I-Wont-Eat-This',
        cardName: '谢谢，不吃这套',
        description: '抽到的下个减益卡牌可以立即删除',
        priority: 'special',
        weight: 0.028571,
        count: 1,
        idea: 'D2RRX'
      }
      deleteCard(tempCard)

      doDelete = true

      ElMessage({
        message: '因身上携带 谢谢，不吃这套 卡牌，此次的减益卡牌已被消除'
      })
    }
  }

  // 不是哥们
  if (userStore.noBuddy) {
    if (card.type === 'MicroGain' || card.type === 'StrongGain' || card.type === 'Opportunity') {
      const tempCard = {
        id: 'T34',
        type: 'Technology',
        tag: 't',
        tagLevel: 1,
        name: 'No-Buddy',
        cardName: '不是，哥们！',
        description: '你的下个增益卡牌被直接删除',
        priority: 'special',
        weight: 0.028571,
        count: 1,
        idea: 'D2RRX'
      }
      deleteCard(tempCard)

      doDelete = true

      ElMessage({
        message: '因身上携带 不是，哥们！ 卡牌，此次的增益卡牌已被消除'
      })
    }
  }

  // 重度不适
  // ---------------------------------
  // 卧槽我钱包呢
  if (card.name == 'Lost-Wallet') {
    doDelete = true

    userStore.playerMoney = 0
    str = '杂鱼~你的货币全没了哦~'
  }

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
    thirteenList.forEach((card: any) => {
      saveCard(card)
    })
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
  }

  // 天使
  if (card.name == 'Angel') {
    doDelete = true
  }

  // 恶魔
  if (card.name == 'Devil') {
    doDelete = true
  }

  // 强买强卖
  if (card.name == 'Hard-Sells') {
    doDelete = true
  }

  // 你在逗我吗？
  if (card.name == 'Are-You-Kidding-Me') {
    doDelete = true

    let microGainCount = 0
    let strongGainCount = 0
    let microDiscomfortCount = 0
    let strongDiscomfortCount = 0

    const listNumber = [0, 1, 3, 4]

    for (let i = 0; i < listNumber.length; i++) {
      const deckList = userStore.deckList[deckType[listNumber[i]]]
      console.log(userStore.deckList)
      deckList.forEach((card: any) => {
        if (card.type === 'MicroGain') microGainCount++
        if (card.type === 'StrongGain') strongGainCount++
        if (card.type === 'MicroDiscomfort') microDiscomfortCount++
        if (card.type === 'StrongDiscomfort') strongDiscomfortCount++
        deleteCard(card)
      })
    }

    randomCard(microGainCount, 3, true)
    randomCard(strongGainCount, 4, true)
    randomCard(microDiscomfortCount, 0, true)
    randomCard(strongDiscomfortCount, 1, true)

    str =
      `你有 ${microGainCount} 张微弱增益，${strongGainCount} 张强大增益，` +
      `${microDiscomfortCount} 张微弱不适，${strongDiscomfortCount} 张重度不适，` +
      `已替换成 ` +
      `${microDiscomfortCount} 张微弱增益，${strongDiscomfortCount} 张强大增益，` +
      `${microGainCount} 张微弱不适，${strongGainCount} 张重度不适`
  }

  // 忘了就是开了？
  if (card.name == 'Forget') {
    doDelete = true
    str = `抽到此卡牌后，随机生成一张微弱增益替换该卡牌，同时额外获得一次卡牌抽取次数`

    randomCard(1, 0, false)
    userStore.drawCount += 1
  }

  // 光能庇护
  if (card.name == 'Light-Blessing') {
    doDelete = true
    str = `立即清除你身上所有debuff`

    for (let i = 3; i < 6; i++) {
      userStore.deckList[deckType[i]].forEach((card: any) => {
        deleteCard(card)
      })
    }
  }

  // 海马的特殊规则
  if (card.name == 'Special-Rules-For-Seahorses') {
    doDelete = true
  }

  // 人为财死
  if (card.name == 'People-Die-For-Money') {
    doDelete = true
  }

  userStore.deckList[card.type].push(card)

  // 更改卡牌数量
  changeCardCount(card)

  if (doDelete) {
    deleteCard(card)
  }

  if (
    str != '' &&
    (card.type == 'Technology' || card.name == 'Lost-Wallet' || card.name == 'Quit-Gambling')
  ) {
    ElMessage({
      message: str,
      grouping: true,
      showClose: true,
      duration: 0
    })
  }
}

// 获取随机卡牌
export const randomCard = (length: number, listType: number, byCount: boolean) => {
  const userStore = useUserStore()

  for (let i = 0; i < length; ) {
    const card = getRandomCard(listType, byCount)
    if (checkDeck(userStore.deckList[deckType[listType]], card)) {
      saveCard(card)
      i++
    }
  }
}

// 随机卡牌
export const getRandomCard = (listNumber: number, byCount: boolean) => {
  let card = null

  while (card == null) {
    const deckList = getDeckListType(deckType[listNumber])

    if (byCount) {
      card = lotteryByCount(deckList)
    } else {
      card = lottery(deckList)
    }
  }

  // console.log(card)

  return card
}

// 你不能...
export const youCant = () => {
  const num = randomNum(0, 7)

  randomCard(1, num, false)

  ElMessage('你拥有无法控制的卡牌，所以你的卡牌已被替换')
}

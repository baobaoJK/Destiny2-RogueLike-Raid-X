import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useDeckListStore, useUserStore } from '@/stores'

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

// 获取卡牌列表卡牌数量
export const getDeckListTypeCount = (deck: any[], type: string) => {
  let count = 0
  if (deck == undefined) return count

  for (const card of deck) {
    if (card.type == type) {
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

// 卡牌去重
export const checkDeck = (deck: any[], card: any[]) => {
  for (const tempCard of deck) {
    if (tempCard == card) {
      return false
    }
  }

  return true
}

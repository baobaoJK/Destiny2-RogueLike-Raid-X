import { randomCard } from '@/utils'
import { ElMessage } from 'element-plus'
import { useUserStore, useDeckListStore } from '@/stores'

// 赢下所有或一无所有
export const winOrLoss = (type: number) => {
  const userStore = useUserStore()
  const deckListStore = useDeckListStore()

  let str = ''
  const size = 3

  if (type === 20) {
    if (deckListStore.strongGain.length - userStore.deckList.StrongGain.length < size) {
      str = `强大增益列表不足或为空，无法生成`
    } else {
      str = `已为你生成 3 个额外强大增益`
      randomCard(size, 1, false)
    }
  } else if (type === 1) {
    if (deckListStore.strongDiscomfort.length - userStore.deckList.StrongDiscomfort.length < size) {
      str = '重度不适列表不足或为空，无法生成'
    } else {
      str = `已为你生成 3 个额外重度不适`
      randomCard(size, 4, false)
    }
  } else {
    str = `无事发生`
  }

  ElMessage(`${str}`)
}

// 幸运数字
export const luckNumber = (type: number) => {
  const userStore = useUserStore()
  const deckListStore = useDeckListStore()

  let str = ''
  const size = 1

  if (type === 7) {
    if (deckListStore.strongGain.length - userStore.deckList.StrongGain.length < size) {
      str = `强大增益列表不足或为空，无法生成`
    } else {
      str = `已为你生成 1 个额外强大增益`
      randomCard(size, 1, false)
    }
  } else if (type === 2) {
    if (deckListStore.strongDiscomfort.length - userStore.deckList.StrongDiscomfort.length < size) {
      str = `重度不适列表不足或为空，无法生成`
    } else {
      str = `已为你生成 1 个额外重度不适`
      randomCard(size, 4, false)
    }
  } else {
    str = `无事发生`
  }

  ElMessage(`${str}`)
}

// 内鬼
export const spy = (type: number) => {
  const userStore = useUserStore()
  const deckListStore = useDeckListStore()

  let str = ''
  const size = 1
  if (type === 1) {
    if (deckListStore.strongGain.length - userStore.deckList.StrongGain.length < size) {
      str = `强大增益列表不足或为空，无法生成`
    } else {
      str = `已为你生成 1 个额外强大增益`
      randomCard(size, 1, false)
    }
  } else {
    if (deckListStore.microDiscomfort.length - userStore.deckList.MicroDiscomfort.length < size) {
      str = `重度不适列表不足或为空，无法生成`
    } else {
      str = `已为你生成 1 个额外微弱不适`
      randomCard(size, 4, false)
    }
  }

  ElMessage(`${str}`)
}

// 饮鸩止渴
export const drink = () => {
  const size = 1
  randomCard(size, 4, false)
  randomCard(size, 5, false)

  ElMessage(`已为你生成 1 个重度不适和 1 个反人类`)
}

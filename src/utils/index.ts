import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRaidStore } from '@/stores'

// 获取突袭地图图片
export const getRaidMapImg = (mapName: string) => {
  return new URL('/images/maps/raid/' + mapName + '.jpg', import.meta.url).href
}

// 随机生成
export const shuffle = (array: any) => {
  const res: any = ref([])
  let random
  while (array.length > 0) {
    random = Math.floor(Math.random() * array.length)
    res.value.push(array[random])
    array.splice(random, 1)
  }
  return res.value
}

// 检测地图
export const checkRaidMap = () => {
  const raidStore = useRaidStore()
  // 判断突袭地图是否为空
  if (raidStore.map == '' || raidStore.map == null) {
    ElMessage({
      message: '请先选择地图',
      grouping: true,
      type: 'error'
    })

    return true
  }

  return false
}

// 生成随机数
export const randomNum = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

// 列表去重
export const checkList = (list: any, item: any) => {
  for (const element of list) {
    if (element == item) {
      return false
    }
  }
  return true
}
export * from './lottery'
export * from './deck'

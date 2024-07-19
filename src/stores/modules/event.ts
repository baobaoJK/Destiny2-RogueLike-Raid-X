import { getConfigService } from '@/api/config'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEventStore = defineStore(
  'event',
  () => {
    // 个人事件列表
    const playerEventList: any = ref([])
    // 全局事件列表
    const globalEventList: any = ref([])

    // 获取个人事件列表
    const getPlayerEventList = async () => {
      const result = await getConfigService()
      playerEventList.value = result.data.playerEventList
      return playerEventList.value
    }

    // 获取个人事件列表
    const getGlobalEventList = async () => {
      const result = await getConfigService()
      globalEventList.value = result.data.globalEventList
      return globalEventList.value
    }

    // 重置
    const reset = () => {
      playerEventList.value = []
      globalEventList.value = []
    }

    return {
      playerEventList,
      globalEventList,
      getPlayerEventList,
      getGlobalEventList,
      reset
    }
  },
  {
    persist: true
  }
)

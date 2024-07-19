import { getConfigService } from '@/api/config'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBountyStore = defineStore(
  'bounty',
  () => {
    // 赏金列表
    const bounty = ref([])

    // 获取赏金列表
    const getBountyList = async () => {
      if (bounty.value.length == 0) {
        const result = await getConfigService()
        bounty.value = result.data.bounty
      }
      return bounty.value
    }

    // 重置
    const reset = () => {
      bounty.value = []
    }

    return {
      bounty,
      getBountyList,
      reset
    }
  },
  {
    persist: true
  }
)

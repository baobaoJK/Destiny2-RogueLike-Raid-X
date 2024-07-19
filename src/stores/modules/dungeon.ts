import { getConfigService } from '@/api/config'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDungenoStore = defineStore(
  'dungeon',
  () => {
    // 地牢 id
    const dungeonId = ref(0)
    // 地牢名称
    const dungeon = ref('')
    // 地牢列表
    const dungeons = ref([])

    // 获取地牢列表
    const getDungeons = async () => {
      const result = await getConfigService()
      dungeons.value = result.data.dungeons
      return dungeons.value
    }

    // 重置
    const reset = () => {
      dungeonId.value = 0
      dungeon.value = ''
      dungeons.value = []
    }
    return {
      dungeonId,
      dungeon,
      dungeons,
      getDungeons,
      reset
    }
  },
  {
    persist: true
  }
)

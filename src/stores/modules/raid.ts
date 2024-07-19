import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getConfigService } from '@/api/config'
export const useRaidStore = defineStore(
  'raid',
  () => {
    //  地图 ID
    const mapId = ref(0)
    //   地图名称
    const map: any = ref(null)
    //   地图列表
    const maps: any = ref([])
    //   地图关卡
    const level = ref(0)
    // 地图当前关卡
    const levelPoint = ref(0)
    // 地图检查点
    const checkPoint = ref(0)
    // 地图隐藏箱数量
    const chest = ref(0)
    // 地图隐藏箱数量
    const chestPoint = ref(0)

    // 获取地图列表
    const getMaps = async () => {
      const result = await getConfigService()
      maps.value = result.data.maps
      return maps.value
    }

    // 重置
    const reset = () => {
      mapId.value = 0
      map.value = null
      maps.value = []
      level.value = 0
      levelPoint.value = 0
      checkPoint.value = 0
      chest.value = 0
      chestPoint.value = 0
    }
    return {
      mapId,
      map,
      maps,
      level,
      levelPoint,
      checkPoint,
      chest,
      chestPoint,
      getMaps,
      reset
    }
  },
  {
    persist: true
  }
)

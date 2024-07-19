import { getConfigService } from '@/api/config'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useShopStore = defineStore(
  'shop',
  () => {
    // 固定售卖物品
    const fixedItems: any = ref([])
    // 随机售卖物品
    const randomItems: any = ref([])
    // 武器
    const weapons: any = ref([])
    // 护甲
    const armor: any = ref([])

    // 获取商店信息
    const getShopList = async () => {
      const result = await getConfigService()
      fixedItems.value = result.data.shop.fixedItems
      randomItems.value = result.data.shop.randomItems
      weapons.value = result.data.shop.weapons
      armor.value = result.data.shop.armor
    }

    // 重置
    const reset = () => {
      fixedItems.value = []
      randomItems.value = []
      weapons.value = []
      armor.value = []
    }
    return {
      fixedItems,
      randomItems,
      weapons,
      armor,
      getShopList,
      reset
    }
  },
  {
    persist: true
  }
)

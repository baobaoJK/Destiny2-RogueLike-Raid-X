import { getConfigService } from '@/api/config'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from './user'

export const useShopStore = defineStore(
  'shop',
  () => {
    // 固定售卖物品
    const fixedItems: any = ref([])
    // 固定售卖物品图片
    const fixedItemsImg: any = ref([])
    // 随机售卖物品
    const randomItems: any = ref([])
    // 随机售卖物品图片
    const randomItemsImg: any = ref([])
    // 武器
    const weapons: any = ref([])
    // 护甲
    const armor: any = ref([])

    // 获取商店信息
    const getShopList = async () => {
      const result = await getConfigService()
      fixedItems.value = result.data.shop.fixedItems

      fixedItemsImg.value[0] = new URL('/images/shop/water.jpg', import.meta.url).href
      fixedItemsImg.value[1] = new URL('/images/shop/water.jpg', import.meta.url).href
      fixedItemsImg.value[2] = new URL('/images/shop/water.jpg', import.meta.url).href
      fixedItemsImg.value[3] = new URL('/images/shop/water.jpg', import.meta.url).href
      fixedItemsImg.value[4] = new URL('/images/shop/card.png', import.meta.url).href

      randomItems.value = result.data.shop.randomItems

      weapons.value = result.data.shop.weapons
      armor.value = result.data.shop.armor
    }

    // 随机商店物品图片
    const setRandomItemsImg = () => {
      const userStore = useUserStore()

      if (randomItems.value[0].itemName === '空物品') return
      randomItemsImg.value[0] = new URL(
        '/images/shop/weapons1/' + randomItems.value[0].itemName + '.jpg',
        import.meta.url
      ).href
      randomItemsImg.value[1] = new URL(
        '/images/shop/weapons2/' + randomItems.value[1].itemName + '.jpg',
        import.meta.url
      ).href
      randomItemsImg.value[2] = new URL(
        '/images/shop/weapons3/' + randomItems.value[2].itemName + '.jpg',
        import.meta.url
      ).href
      randomItemsImg.value[3] = new URL(
        '/images/shop/exotic/' + randomItems.value[3].itemName + '.jpg',
        import.meta.url
      ).href
      randomItemsImg.value[4] = new URL(
        '/images/shop/' + userStore.role + '/' + randomItems.value[4].itemName + '.jpg',
        import.meta.url
      ).href
    }

    // 重置
    const reset = () => {
      fixedItems.value = []
      fixedItemsImg.value = []
      randomItems.value = []
      randomItemsImg.value = []
      weapons.value = []
      armor.value = []
    }

    return {
      fixedItems,
      fixedItemsImg,
      randomItems,
      randomItemsImg,
      weapons,
      armor,
      getShopList,
      setRandomItemsImg,
      reset
    }
  },
  {
    persist: true
  }
)

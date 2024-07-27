import { getConfigService } from '@/api/config'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getDeckListCount } from '@/utils'

export const useDeckListStore = defineStore(
  'decklist',
  () => {
    // 微弱增益
    const microGain: any = ref([])
    // 微弱增益数量
    const microGainCount = computed(() => getDeckListCount(microGain.value))

    // 强大增益
    const strongGain: any = ref([])
    // 强大增益数量
    const strongGainCount = computed(() => getDeckListCount(strongGain.value))

    // 欧皇增益
    const opportunity: any = ref([])
    // 欧皇增益数量
    const opportunityCount = computed(() => getDeckListCount(opportunity.value))

    // 微弱不适
    const microDiscomfort: any = ref([])
    // 微弱不适数量
    const microDiscomfortCount = computed(() => getDeckListCount(microDiscomfort.value))

    // 重度不适
    const strongDiscomfort: any = ref([])
    // 重度不适数量
    const strongDiscomfortCount = computed(() => getDeckListCount(strongDiscomfort.value))

    // 反人类
    const unacceptable: any = ref([])
    // 反人类数量
    const unacceptableCount = computed(() => getDeckListCount(unacceptable.value))

    // 特殊卡牌
    const technology: any = ref([])
    // 特殊卡牌数量
    const technologyCount = computed(() => getDeckListCount(technology.value))

    // 辅助增益
    const support: any = ref([])
    // 辅助增益数量
    const supportCount = computed(() => getDeckListCount(support.value))

    const getDeckList = async () => {
      const result = await getConfigService()
      microGain.value = result.data.deckList.MicroGain
      strongGain.value = result.data.deckList.StrongGain
      opportunity.value = result.data.deckList.Opportunity
      microDiscomfort.value = result.data.deckList.MicroDiscomfort
      strongDiscomfort.value = result.data.deckList.StrongDiscomfort
      unacceptable.value = result.data.deckList.Unacceptable
      technology.value = result.data.deckList.Technology
      support.value = result.data.deckList.Support
    }

    // 重置
    const reset = () => {
      microGain.value = []
      strongGain.value = []
      opportunity.value = []
      microDiscomfort.value = []
      strongDiscomfort.value = []
      unacceptable.value = []
      technology.value = []
      support.value = []
    }
    return {
      microGain,
      microGainCount,
      strongGain,
      strongGainCount,
      opportunity,
      opportunityCount,
      microDiscomfort,
      microDiscomfortCount,
      strongDiscomfort,
      strongDiscomfortCount,
      unacceptable,
      unacceptableCount,
      technology,
      technologyCount,
      support,
      supportCount,
      getDeckList,
      reset
    }
  },
  {
    persist: true
  }
)

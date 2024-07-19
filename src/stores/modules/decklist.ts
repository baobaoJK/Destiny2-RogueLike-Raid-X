import { getConfigService } from '@/api/config'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDeckListStore = defineStore(
  'decklist',
  () => {
    // 微弱增益
    const microGain: any = ref([])
    // 强大增益
    const strongGain: any = ref([])
    const opportunity: any = ref([])
    const microDiscomfort: any = ref([])
    const strongDiscomfort: any = ref([])
    const unacceptable: any = ref([])
    const technology: any = ref([])
    const support: any = ref([])

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
      strongGain,
      opportunity,
      microDiscomfort,
      strongDiscomfort,
      unacceptable,
      technology,
      support,
      getDeckList,
      reset
    }
  },
  {
    persist: true
  }
)

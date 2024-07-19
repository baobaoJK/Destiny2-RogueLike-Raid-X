import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore(
  'config',
  () => {
    const configInfo = ref({
      version: 'X'
    })

    const getConfigInfo = () => {
      return configInfo
    }
    return {
      configInfo,
      getConfigInfo
    }
  },
  {
    persist: true
  }
)

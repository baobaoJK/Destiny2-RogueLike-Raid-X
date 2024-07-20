import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    // 角色
    const role = ref('')
    // 角色 ID
    const roleId = ref(0)
    // 用户名
    const username = ref('')
    // 是否火力战队队长
    const isCaptain = ref(false)
    // 玩家货币数量
    const playerMoney = ref(0)
    // 玩家抽卡次数
    const drawCount = ref(0)
    //
    const closeDeck = ref(false)
    // 商店刷新次数
    const refreshCount = ref(0)
    // 商店刷新花费
    const refreshMoney = ref(1)
    //
    const devilspact = ref(0)
    //
    const market = ref(false)
    // 玩家背包
    const backpack: any = ref([])
    // 玩家背包物品图片
    const backpackImg: any = ref([])
    // 玩家卡牌列表
    const deckList: any = ref({})
    // 玩家赏金列表
    const bountyList: any = ref([])
    // 玩家个人事件
    const playerEventList: any = ref([])
    // 玩家全局事件
    const globalEventList: any = ref([])

    //  设置用户信息
    const setUserInfo = async (newUserInfo: any) => {
      role.value = newUserInfo.role
      roleId.value = newUserInfo.roleId
      username.value = newUserInfo.username
      isCaptain.value = newUserInfo.isCaptain
      deckList.value = {
        MicroGain: [],
        StrongGain: [],
        Opportunity: [],
        MicroDiscomfort: [],
        StrongDiscomfort: [],
        Unacceptable: [],
        Technology: [],
        Support: []
      }
      bountyList.value = [
        {
          id: 'V0',
          type: 'Value',
          name: '',
          valueName: '当前没有赏金任务',
          description: '请过段时间再来',
          weight: 0,
          count: 1
        },
        {
          id: 'V0',
          type: 'Value',
          name: '',
          valueName: '当前没有赏金任务',
          description: '请过段时间再来',
          weight: 0,
          count: 1
        },
        {
          id: 'V0',
          type: 'Value',
          name: '',
          valueName: '当前没有赏金任务',
          description: '请过段时间再来',
          weight: 0,
          count: 1
        }
      ]
    }

    // 获取用户信息
    const getUserInfo = () => {
      return {
        role,
        roleId,
        username,
        isCaptain,
        playerMoney,
        drawCount,
        closeDeck,
        refreshCount,
        refreshMoney,
        devilspact,
        market,
        backpack,
        backpackImg,
        deckList,
        bountyList,
        playerEventList,
        globalEventList
      }
    }

    // 重置
    const reset = () => {
      role.value = ''
      roleId.value = 0
      username.value = ''
      isCaptain.value = false
      playerMoney.value = 0
      drawCount.value = 0
      closeDeck.value = false
      refreshCount.value = 0
      refreshMoney.value = 1
      devilspact.value = 0
      market.value = false
      backpack.value = []
      backpackImg.value = []
      deckList.value = {}
      bountyList.value = []
      playerEventList.value = []
      globalEventList.value = []
    }

    return {
      role,
      roleId,
      username,
      isCaptain,
      playerMoney,
      drawCount,
      closeDeck,
      refreshCount,
      refreshMoney,
      devilspact,
      market,
      backpack,
      backpackImg,
      deckList,
      bountyList,
      playerEventList,
      globalEventList,
      getUserInfo,
      setUserInfo,
      reset
    }
  },
  {
    persist: true
  }
)

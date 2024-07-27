import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

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
    // 商店刷新次数
    const refreshCount = ref(0)
    // 商店刷新花费
    const refreshMoney = ref(1)
    // 恶魔契约
    const devilspact = ref(0)
    // 未来市场
    const market = computed(() => {
      const card = deckList.value.Technology.find((card: any) => card.name === `Future's-Market`)
      return card !== undefined ? true : false
    })
    // 纨绔子弟
    const profiteer = computed(() => {
      const card = deckList.value.StrongDiscomfort.find(
        (card: any) => card.name === 'Reicher-Playboy'
      )
      return card !== undefined ? true : false
    })
    // 静水监狱
    const shopClosed = computed(() => {
      const card = deckList.value.Unacceptable.find(
        (card: any) => card.name === 'Stillwater-Prison'
      )
      return card !== undefined ? true : false
    })
    // 赌徒
    const gambler = computed(() => {
      const card = deckList.value.Technology.find((card: any) => card.name === 'Gambler')
      return card !== undefined ? true : false
    })
    // 戒赌
    const deckClosed = computed(() => {
      const card = deckList.value.Unacceptable.find((card: any) => card.name === 'Quit-Gambling')
      return card !== undefined ? true : false
    })
    // 免死金牌
    const compensate = computed(() => {
      const card = deckList.value.Opportunity.find((card: any) => card.name === 'The-Medallion')
      return card !== undefined ? false : true
    })
    // 苦肉计
    const torture = computed(() => {
      const card = deckList.value.Technology.find(
        (card: any) => card.name === 'The-Self-Torture-Scheme'
      )
      return card !== undefined ? true : false
    })
    // 不，你不能...
    const random = computed(() => {
      const card = deckList.value.Technology.find((card: any) => card.name === 'You-Cant')
      return card !== undefined ? true : false
    })
    // 卡牌回收计划
    const program = computed(() => {
      const card = deckList.value.Technology.find(
        (card: any) => card.name === 'Card-Recycling-Program'
      )
      return card !== undefined ? true : false
    })
    // 观星
    const stargazing = computed(() => {
      const card = deckList.value.Technology.find((card: any) => card.name === 'Stargazing')
      return card !== undefined ? true : false
    })
    // 不吃这套
    const noDeal = computed(() => {
      const card = deckList.value.Technology.find((card: any) => card.name === 'I-Wont-Eat-This')
      return card !== undefined ? true : false
    })
    // 不是哥们！
    const noBuddy = computed(() => {
      const card = deckList.value.Technology.find((card: any) => card.name === 'No-Buddy')
      return card !== undefined ? true : false
    })
    // 十三幺
    const thirteen = computed(() => {
      const card = deckList.value.Technology.find((card: any) => card.name === 'Thirteen-Orphans')
      return card !== undefined ? true : false
    })
    // 窃取
    const steal = ref(false)
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
    // 信息版配置
    const infoBoard = ref({
      gameMap: false,
      gamePlay: true,
      gameChallenge: true,
      gameDeck: false,
      gameDeckList: false,
      gameBounty: false,
      gamePlayerEvent: false,
      gameGlobalEvent: false,
      gameShop: false
    })

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
        refreshCount,
        refreshMoney,
        devilspact,
        market,
        profiteer,
        shopClosed,
        gambler,
        compensate,
        deckClosed,
        backpack,
        backpackImg,
        deckList,
        bountyList,
        playerEventList,
        globalEventList,
        infoBoard
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
      refreshCount.value = 0
      refreshMoney.value = 1
      devilspact.value = 0
      backpack.value = []
      backpackImg.value = []
      deckList.value = {}
      bountyList.value = []
      playerEventList.value = []
      globalEventList.value = []
      steal.value = false
      infoBoard.value = {
        gameMap: false,
        gamePlay: true,
        gameChallenge: true,
        gameDeck: false,
        gameDeckList: false,
        gameBounty: false,
        gamePlayerEvent: false,
        gameGlobalEvent: false,
        gameShop: false
      }
    }

    return {
      role,
      roleId,
      username,
      isCaptain,
      playerMoney,
      drawCount,
      refreshCount,
      refreshMoney,
      devilspact,
      market,
      profiteer,
      shopClosed,
      gambler,
      compensate,
      torture,
      random,
      program,
      stargazing,
      noDeal,
      noBuddy,
      thirteen,
      steal,
      deckClosed,
      backpack,
      backpackImg,
      deckList,
      bountyList,
      playerEventList,
      globalEventList,
      infoBoard,
      getUserInfo,
      setUserInfo,
      reset
    }
  },
  {
    persist: true
  }
)

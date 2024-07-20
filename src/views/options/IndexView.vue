<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useBountyStore, useEventStore, useRaidStore, useUserStore } from '@/stores'
import {
  getRaidMapImg,
  lottery,
  lotteryByCount,
  shuffle,
  deckType,
  getDeckListTypeCount
} from '@/utils'

// 读取游戏信息
const maps = ref()
const mapName = ref('请选择地图')

// 提示框
const mapDialogVisible = ref(false)
const moneyDialogVisible = ref(false)
const cardDialogVisible = ref(false)

// 输入框
const moneyInputRef = ref('')
const cardInputRef = ref('')

// 按钮
const mapDoorButtonDisabled = ref(false)
const mapNextButtonDisabled = ref(false)
const chestNextButtonDisabled = ref(false)
const flawlessButtonDisabled = ref(false)

// 地图步骤条
// -----------------------------------------------------
// 步骤
const mapSteps = ref(0)
// 步骤数
const mapStepNum = ref(0)
// 步骤条每一步长度
const mapStepWidth = ref(0)

// 隐藏箱进度条
// -----------------------------------------------------
// 步骤
const chestSteps = ref(0)
// 步骤数
const chestStepNum = ref(0)
// 步骤条每一步长度
const chestStepWidth = ref(0)

// 选择地图
const setMap = (map: any) => {
  const raidStore = useRaidStore()
  raidStore.map = map
  raidStore.mapId = map.id
  raidStore.level = map.level
  raidStore.levelPoint = 1
  raidStore.chest = map.chest
  raidStore.chestPoint = 1

  ElMessage({
    message: '您的游戏地图已被设置为 ' + map.name,
    grouping: true,
    type: 'success'
  })

  mapDialogVisible.value = false
  setMapInfo()
}

// 遭遇战插旗点
const mapDoor = () => {
  const userStore = useUserStore()
  const raidStore = useRaidStore()
  if (raidStore.map == '') return

  if (mapStepNum.value > mapSteps.value + 1) return

  // 赏金任务
  const bountyStore = useBountyStore()
  const bountyList = []

  // 循环抽取赏金任务
  while (bountyList.length != 3) {
    let bounty = lottery(bountyStore.bounty)
    if (checkBounty(bountyList, bounty)) {
      bountyList.push(bounty)
    }
  }

  // 设置赏金任务 与 添加抽卡次数
  userStore.bountyList = bountyList
  userStore.drawCount += 2

  // 刷新商店次数
  if (userStore.refreshCount != 1) userStore.refreshCount = 1

  ElMessage({
    message: '已为你添加了新的赏金任务，2次抽卡机会，1次免费刷新商店机会',
    grouping: true,
    type: 'success'
  })

  // 个人事件
  playerEvent()

  // 全局事件
  if (userStore.isCaptain) {
    globalEvent()
  }

  mapDoorButtonDisabled.value = true
  setTimeout(() => {
    mapDoorButtonDisabled.value = false
  }, 3000)
}

// 遭遇战完成按钮
const mapNext = () => {
  const raidStore = useRaidStore()
  if (raidStore.map == '') return

  if (mapStepNum.value <= mapSteps.value) {
    mapStepNum.value += 1

    if (mapStepNum.value == 2) {
      raidStore.levelPoint = mapStepNum.value
      return
    }

    const userStore = useUserStore()
    userStore.playerMoney += 3
    raidStore.levelPoint = mapStepNum.value

    ElMessage({
      message: '已通关遭遇战获得 3 货币',
      grouping: true,
      type: 'success'
    })

    // 判断是否有免死金牌
    let compensate = true
    userStore.deckList[deckType[2]].forEach((card: any) => {
      if (card.name == 'The-Medallion') {
        compensate = false
      }
    })

    // 负面补偿
    if (compensate) {
      // 负面检测
      const debuffTestCount = ref(0)

      const microDiscomfortListCount = getDeckListTypeCount(
        userStore.deckList[deckType[3]],
        deckType[3]
      )
      const strongDiscomfortListCount = getDeckListTypeCount(
        userStore.deckList[deckType[4]],
        deckType[4]
      )
      const unacceptableListCount = getDeckListTypeCount(
        userStore.deckList[deckType[5]],
        deckType[5]
      )

      debuffTestCount.value += microDiscomfortListCount
      debuffTestCount.value += strongDiscomfortListCount * 2
      debuffTestCount.value += unacceptableListCount * 3

      console.log(debuffTestCount.value)

      if (debuffTestCount.value > 0) {
        ElMessage({
          message: '因携带了负面卡牌通过遭遇战，获得 ' + debuffTestCount.value + ' 个货币',
          grouping: true,
          type: 'success'
        })

        userStore.playerMoney += debuffTestCount.value
      }
    }

    mapNextButtonDisabled.value = true
    setTimeout(() => {
      mapNextButtonDisabled.value = false
    }, 3000)
  }
}

// 获取隐藏箱事件
const nextChest = () => {
  const raidStore = useRaidStore()
  if (raidStore.map == '') return

  if (chestStepNum.value <= chestSteps.value) {
    chestStepNum.value += 1

    raidStore.chestPoint = chestStepNum.value

    const userStore = useUserStore()
    userStore.playerMoney += 3

    ElMessage({
      message: '已获取隐藏箱获得 3 货币',
      grouping: true,
      type: 'success'
    })

    chestNextButtonDisabled.value = true
    setTimeout(() => {
      chestNextButtonDisabled.value = false
    }, 3000)
  }
}

// 更改货币数量按钮
const setMoney = () => {
  if (moneyInputRef.value == '') {
    ElMessage({
      message: '请输入货币数量',
      grouping: true,
      type: 'error'
    })
    return
  }

  const userStore = useUserStore()
  userStore.playerMoney = Number(moneyInputRef.value)

  ElMessage({
    message: '已更改货币数量为 ' + moneyInputRef.value,
    grouping: true,
    type: 'success'
  })

  moneyDialogVisible.value = false
  moneyInputRef.value = ''
}

// 更改抽卡次数按钮
const setDrawCount = () => {
  if (cardInputRef.value == '') {
    ElMessage({
      message: '请输入抽卡次数',
      grouping: true,
      type: 'error'
    })
    return
  }

  const userStore = useUserStore()
  userStore.drawCount = Number(cardInputRef.value)

  ElMessage({
    message: '已更改抽卡数量为 ' + cardInputRef.value,
    grouping: true,
    type: 'success'
  })

  cardDialogVisible.value = false
  cardInputRef.value = ''
}

// 无暇按钮
const flawlessButton = () => {
  // 添加货币
  const userStore = useUserStore()
  userStore.playerMoney += 6

  ElMessage({
    message: '已添加 6 货币',
    grouping: true,
    type: 'success'
  })

  flawlessButtonDisabled.value = true
  setTimeout(() => {
    flawlessButtonDisabled.value = false
  }, 3000)
}

// 赏金去重
const checkBounty = (bountyList: any, bounty: any) => {
  for (const element of bountyList) {
    if (element == bounty) {
      return false
    }
  }
  return true
}

// 设置地图信息
const setMapInfo = () => {
  const raidStore = useRaidStore()
  if (raidStore.map != '' && raidStore.map != null) {
    mapName.value = raidStore.map.name
    mapSteps.value = raidStore.map.level
    mapStepNum.value = raidStore.levelPoint
    mapStepWidth.value = 100 / Number(mapSteps.value)
    chestSteps.value = raidStore.chest
    chestStepNum.value = raidStore.chestPoint
    chestStepWidth.value = 100 / Number(chestSteps.value)
  }
}

// 个人事件
const playerEvent = () => {
  const eventStore = useEventStore()

  const eventNumbers = ref([1, 2, 3, 4])
  eventNumbers.value = shuffle(eventNumbers.value)

  // console.log(eventNumbers.value)
  // console.log('----个人事件-----')

  if (eventNumbers.value[0] != 1) {
    const event = lotteryByCount(eventStore.playerEventList)
    for (let i = 0; i < eventStore.playerEventList.length; i++) {
      if (event.id == eventStore.playerEventList[i].id) {
        eventStore.playerEventList[i].count -= 1
        break
      }
    }

    const userStore = useUserStore()
    userStore.playerEventList.push(event)

    ElMessage({
      message: '你有新的个人事件',
      grouping: true,
      type: 'warning'
    })
  }
}

// 全局事件
const globalEvent = () => {
  const eventStore = useEventStore()

  const globalEventNumbers = ref([1, 2, 3, 4])
  globalEventNumbers.value = shuffle(globalEventNumbers.value)

  // console.log('----全局事件-----')
  // console.log(globalEventNumbers.value)

  if (globalEventNumbers.value[0] != 1) {
    const globalEvent = lotteryByCount(eventStore.globalEventList)
    for (let i = 0; i < eventStore.globalEventList.length; i++) {
      if (globalEvent.id == eventStore.globalEventList[i].id) {
        eventStore.globalEventList[i].count -= 1
        break
      }
    }

    const userStore = useUserStore()
    userStore.globalEventList.push(globalEvent)

    ElMessage({
      message: '队伍有新的全局事件',
      grouping: true,
      type: 'warning'
    })
  }
}

// 初始化
const initOptions = async () => {
  const raidStore = useRaidStore()
  maps.value = raidStore.maps
  setMapInfo()
}
initOptions()
</script>
<template>
  <div id="options">
    <div class="map-pane">
      <div class="map-info">
        <div class="map-img">
          <img :src="getRaidMapImg(mapName)" alt="地图" />
        </div>
        <p class="map-text">- {{ mapName }} -</p>
        <button class="button map-button" @click="mapDialogVisible = true">选择地图</button>
      </div>

      <div class="map-level-box">
        <p>遭遇战通关进度</p>
        <div class="map-step-bar">
          <div class="map-bar" :style="{ width: (mapStepNum - 1) * mapStepWidth + '%' }"></div>
          <div class="step map-step" v-for="index in mapSteps + 1" :key="index" :class="{ active: index >= 1 }">
            {{ index - 1 }}
          </div>
        </div>
        <div class="step-options">
          <button class="button" id="map-door" @click="mapDoor" :disabled="mapDoorButtonDisabled">
            抵达遭遇战插旗点（再点这个）
          </button>
          <button class="button" id="map-next" @click="mapNext" :disabled="mapNextButtonDisabled">
            遭遇战完成（先点这个）
          </button>
        </div>
      </div>

      <div class="map-chest-box">
        <p>隐藏箱进度</p>
        <div class="chest-step-bar">
          <div class="chest-bar" :style="{ width: (chestStepNum - 1) * chestStepWidth + '%' }"></div>
          <div class="step map-step" v-for="index in chestSteps + 1" :key="index" :class="{ active: index >= 1 }">
            {{ index - 1 }}
          </div>
        </div>
        <div class="step-options">
          <button class="button" id="chest-next" @click="nextChest" :disabled="chestNextButtonDisabled">
            已获取隐藏箱
          </button>
        </div>
      </div>
    </div>

    <div class="options-pane">
      <button class="button" id="money-button" @click="moneyDialogVisible = true">
        设置货币数量
      </button>
      <button class="button" id="card-button" @click="cardDialogVisible = true">
        设置抽卡次数
      </button>
      <button class="button" id="flawless" @click="flawlessButton" :disabled="flawlessButtonDisabled">
        无暇通关（加 6 货币）
      </button>
    </div>

    <!-- 地图选择模态框 -->
    <el-dialog class="dialog map-dialog" v-model="mapDialogVisible" :close-on-click-modal="false" width="75rem"
      align-center>
      <div class="map-list-box">
        <div class="map-item" v-for="(map, index) in maps" :key="index" @click="setMap(map)">
          <img :src="getRaidMapImg(map.name)" :alt="map.name" />
          <p>{{ map.name }}</p>
        </div>
      </div>
      <div class="map-confirm-box">
        <button type="button" class="button map-cancel" @click="mapDialogVisible = false">
          取消
        </button>
      </div>
    </el-dialog>

    <!-- 更改货币数量模态框 -->
    <el-dialog class="dialog money-dialog" v-model="moneyDialogVisible" :close-on-click-modal="false" width="25rem"
      align-center>
      <div class="money-input-box">
        <label for="money">输入货币数量：</label>
        <el-input type="text" id="money" v-model="moneyInputRef"></el-input>
      </div>
      <div class="buttons">
        <button type="button" class="button money-confirm" @click="setMoney">确认</button>
        <button type="button" class="button money-cancel" @click="moneyDialogVisible = false">
          取消
        </button>
      </div>
    </el-dialog>

    <!-- 更改抽卡次数模态框 -->
    <el-dialog class="dialog card-dialog" v-model="cardDialogVisible" :close-on-click-modal="false" width="25rem"
      align-center>
      <div class="card-input-box">
        <label for="card">输入抽卡次数：</label>
        <el-input type="text" id="card" v-model="cardInputRef"></el-input>
      </div>
      <div class="buttons">
        <button type="button" class="button card-confirm" @click="setDrawCount">确认</button>
        <button type="button" class="button card-cancel" @click="cardDialogVisible = false">
          取消
        </button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss">
@import '@/assets/styles/options';
</style>

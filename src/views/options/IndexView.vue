<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useBountyStore, useEventStore, useRaidStore, useUserStore } from '@/stores'
import {
  getRaidMapImg,
  lottery,
  lotteryByCount,
  shuffle,
  checkRaidMap,
  randomNum,
} from '@/utils'
import ChangeValue from './components/ChangeValue.vue'
import InfoBoard from "@/components/infoboard/IndexView.vue"

// 用户信息
const userStore = useUserStore()
const { infoBoard } = storeToRefs(useUserStore())

// 突袭地图信息
const raidStore = useRaidStore()
const { maps } = storeToRefs(useRaidStore())

// 事件信息
const eventStore = useEventStore()

// 赏金信息
const bountyStore = useBountyStore()


// 游戏挑战信息
const gameChallengeData = ref([
  {
    mapName: '最后一愿',
    level: '普通',
    name: '未来愿望',
    description: '去许愿墙播放《未来愿望》，获得 3 个货币'
  },
  {
    mapName: '救赎花园',
    level: '简单',
    name: '无',
    description: '无'
  },
  {
    mapName: '深岩墓室',
    level: '普通',
    name: '深海派克',
    description: '运送 n 辆派克抵达终点，则获得 n 个货币'
  },
  {
    mapName: '玻璃拱顶',
    level: '简单',
    name: '完美塔防',
    description: '防守区域时，没有任何米诺陶进入区域重置节点时，可以获得 3 个货币'
  },
  {
    mapName: '门徒誓约',
    level: '困难',
    name: '完好无损',
    description: '运送目标时，没有任何人死亡，可以获得 6 个货币'
  },
  {
    mapName: '国王的陨落',
    level: '困难',
    name: '接触暗影',
    description: '开门关时，不破坏黑球的情况下完成开门关，可以获得 6 个货币或单左双右完成开门关，可以获得 3 个货币'
  },
  {
    mapName: '梦魇根源',
    level: '简单',
    name: '无',
    description: '无'
  },
  {
    mapName: '克洛塔的末日',
    level: '普通',
    name: '无',
    description: '无'
  }
])

// 读取游戏信息
const mapName = ref('请选择地图')

// 提示框
const mapDialogVisible = ref(false)
const valueDialog = ref()
const valueDialogTitle = ref('')

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

// 设置地图信息
const setMapInfo = () => {
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

// 遭遇战插旗点
const mapDoor = () => {

  // 检测地图是否为空
  if (checkRaidMap()) return

  // 判断插旗点
  if (mapStepNum.value > mapSteps.value + 1) return

  // 抽取赏金任务
  const bountyList = []
  bountyList.push(lottery(bountyStore.bounty.human))
  bountyList.push(lottery(bountyStore.bounty.guardian))
  bountyList.push(lottery(bountyStore.bounty.killer))

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

  // 更改按钮状态
  mapDoorButtonDisabled.value = true
  const changeButtonState = setTimeout(() => {
    mapDoorButtonDisabled.value = false
    clearInterval(changeButtonState)
  }, 3000)
}

// 遭遇战完成按钮
const mapNext = () => {

  // 判断突袭地图是否非空
  if (checkRaidMap()) return

  // 判断当前进度
  if (mapStepNum.value <= mapSteps.value) {
    mapStepNum.value += 1

    if (mapStepNum.value == 2) {
      raidStore.levelPoint = mapStepNum.value
      return
    }

    // 修改用户信息
    const randomMoney = randomNum(1, 3)
    userStore.playerMoney += randomMoney
    raidStore.levelPoint = mapStepNum.value

    ElMessage({
      message: `已通关遭遇战获得 ${randomMoney} 货币`,
      grouping: true,
      type: 'success'
    })

    // 判断是否有免死金牌
    if (userStore.compensate) {
      // 负面检测
      const debuffTestCount = ref(0)

      // 负面补偿
      const microDiscomfortListCount = computed(() => userStore.deckList.MicroDiscomfort.length)
      const strongDiscomfortListCount = computed(() => userStore.deckList.StrongDiscomfort.length)
      const unacceptableListCount = computed(() => userStore.deckList.Unacceptable.length)

      debuffTestCount.value += microDiscomfortListCount.value
      debuffTestCount.value += strongDiscomfortListCount.value * 2
      debuffTestCount.value += unacceptableListCount.value * 3

      // console.log(debuffTestCount.value)

      if (debuffTestCount.value > 0) {
        ElMessage({
          message: '因携带了负面卡牌通过遭遇战，获得 ' + debuffTestCount.value + ' 个货币',
          grouping: true,
          type: 'success'
        })

        userStore.playerMoney += debuffTestCount.value
      }
    }

    // 更改按钮状态
    mapNextButtonDisabled.value = true
    const changeButtonState = setTimeout(() => {
      mapNextButtonDisabled.value = false
      clearInterval(changeButtonState)
    }, 3000)
  }
}

// 获取隐藏箱事件
const nextChest = () => {
  // 判断突袭地图是否为空
  if (checkRaidMap()) return

  if (chestStepNum.value <= chestSteps.value) {
    chestStepNum.value += 1

    raidStore.chestPoint = chestStepNum.value

    const randomMoney = randomNum(1, 3)
    userStore.playerMoney += randomMoney

    ElMessage({
      message: `已获取隐藏箱获得 ${randomMoney} 货币`,
      grouping: true,
      type: 'success'
    })

    chestNextButtonDisabled.value = true
    const changeButtonState = setTimeout(() => {
      chestNextButtonDisabled.value = false
      clearInterval(changeButtonState)
    }, 3000)
  }
}

// 显示修改数量模态框
const showDialog = (type: string) => {
  // 判断突袭地图是否为空
  if (checkRaidMap()) return

  // 判断是什么类型的模态框
  if (type == 'money') {
    valueDialogTitle.value = '设置货币数量'
  } else if (type == 'draw') {
    valueDialogTitle.value = '设置抽卡次数'
  }

  // 打开模态框
  valueDialog.value.open(type)
}

// 无暇按钮
const flawlessButton = () => {
  // 判断突袭地图是否为空
  if (checkRaidMap()) return
  // 添加货币
  userStore.playerMoney += 6

  ElMessage({
    message: '已为您添加 6 个货币',
    grouping: true,
    type: 'success'
  })

  // 更改按钮状态
  flawlessButtonDisabled.value = true
  const changeButtonState = setTimeout(() => {
    flawlessButtonDisabled.value = false
    clearInterval(changeButtonState)
  }, 3000)
}

// 个人事件
const playerEvent = () => {

  // console.log('----个人事件-----')

  const size = randomNum(1, 3)

  for (let i = 0; i < size; i++) {
    const event = lotteryByCount(eventStore.playerEventList)
    for (let i = 0; i < eventStore.playerEventList.length; i++) {
      if (event.id == eventStore.playerEventList[i].id) {
        eventStore.playerEventList[i].count -= 1
        break
      }
    }

    userStore.playerEventList.push(event)
  }


  ElMessage({
    message: `你有新的个人事件`,
    grouping: true,
    type: 'warning'
  })
}

// 全局事件
const globalEvent = () => {
  // console.log('----全局事件-----')

  const size = randomNum(1, 2)

  for (let i = 0; i < size; i++) {
    const globalEvent = lotteryByCount(eventStore.globalEventList)
    for (let i = 0; i < eventStore.globalEventList.length; i++) {
      if (globalEvent.id == eventStore.globalEventList[i].id) {
        eventStore.globalEventList[i].count -= 1
        break
      }
    }

    userStore.globalEventList.push(globalEvent)
  }


  ElMessage({
    message: '队伍有新的全局事件',
    grouping: true,
    type: 'warning'
  })
}

// 初始化
const initOptions = async () => {
  setMapInfo()
}
initOptions()
</script>
<template>
  <div id="options">
    <div class="map-pane">
      <div class="map-info">
        <div class="map-img" @click="mapDialogVisible = true">
          <img :src="getRaidMapImg(mapName)" alt="地图" />
        </div>
        <p class="map-text">- {{ mapName }} -</p>
        <button class="button map-button" @click="mapDialogVisible = true">选择地图</button>
      </div>

      <div class="map-level-box">
        <p>-遭遇战通关进度-</p>
        <div class="map-step-bar">
          <div class="map-bar" :style="{ width: (mapStepNum - 1) * mapStepWidth + '%' }"></div>
          <div class="step map-step" v-for="index in mapSteps + 1" :key="index"
            :class="{ active: mapStepNum >= index }">
            {{ index - 1 }}
          </div>
        </div>
        <div class="step-options map-options">
          <button class="button" id="map-door" @click="mapDoor" :disabled="mapDoorButtonDisabled">
            抵达遭遇战插旗点（再点这个）
          </button>
          <button class="button" id="map-next" @click="mapNext" :disabled="mapNextButtonDisabled">
            遭遇战完成（先点这个）
          </button>
        </div>
      </div>

      <div class="map-chest-box">
        <p>-隐藏箱进度-</p>
        <div class="chest-step-bar">
          <div class="chest-bar" :style="{ width: (chestStepNum - 1) * chestStepWidth + '%' }"></div>
          <div class="step map-step" v-for="index in chestSteps + 1" :key="index"
            :class="{ active: chestStepNum >= index }">
            {{ index - 1 }}
          </div>
        </div>
        <div class="step-options chest-options">
          <button class="button" id="chest-next" @click="nextChest" :disabled="chestNextButtonDisabled">
            已获取隐藏箱
          </button>
        </div>
      </div>
    </div>

    <div class="options-pane">
      <button class="button" id="money-button" @click="showDialog('money')">
        设置货币数量
      </button>
      <button class="button" id="card-button" @click="showDialog('draw')">
        设置抽卡次数
      </button>
      <button class="button" id="flawless" @click="flawlessButton" :disabled="flawlessButtonDisabled">
        无暇通关（全员无暇 加 6 货币）
      </button>
    </div>

    <!-- 地图选择模态框 -->
    <el-dialog class="dialog map-dialog" v-model="mapDialogVisible" :close-on-click-modal="false" width="75rem"
      align-center>

      <div class="map-title">
        <h1>选择游戏地图</h1>
      </div>

      <div class="map-list-box">
        <div class="map-item" v-for="(map, index) in maps" :key="index" @click="setMap(map)">
          <img :src="getRaidMapImg(map.name)" :alt="map.name" />
          <p>{{ map.name }}</p>
        </div>
      </div>

      <div class="map-confirm-box">
        <button type="button" class="button map-cancel" @click="mapDialogVisible = false">
          关闭
        </button>
      </div>
    </el-dialog>

    <ChangeValue ref="valueDialog" :title="valueDialogTitle"></ChangeValue>

    <!-- 游戏挑战信息版 -->
    <InfoBoard type="left" :show-info-board="infoBoard.gameChallenge">
      <template #close-button>
        <div class="close-button">
          <a @click="infoBoard.gameChallenge = !infoBoard.gameChallenge">{{ infoBoard.gameChallenge ? "关闭" : "查看游戏挑战"
            }}</a>
        </div>
      </template>
      <template #title>
        <h1 class="title">
          游戏挑战
        </h1>
      </template>
      <template #content>
        <div>
          <div v-for="item in gameChallengeData" :key="item.mapName">
            <p class="title">{{ item.mapName }} - {{ item.level }} - {{ item.name }}</p>
            <p class="description">{{ item.description }}</p>
            <hr>
          </div>
        </div>
      </template>
    </InfoBoard>

    <!-- 游戏规则信息版 -->
    <InfoBoard type="right" :show-info-board="infoBoard.gamePlay">
      <template #close-button>
        <div class="close-button">
          <a @click="infoBoard.gamePlay = !infoBoard.gamePlay">{{ infoBoard.gamePlay ? "关闭" : "查看游戏规则" }}</a>
        </div>
      </template>
      <template #title>
        <h1 class="title">
          游戏规则
        </h1>
      </template>
      <template #content>
        <div>
          <p>职业自选 / 分支自选</p>
          <p>玩家每人领取一个号码作为自己标识： 1 2 3 4 5 6</p>
          <p>起始人物限定一身紫色品质护甲，属性不限，无模组（属性模组除外） 无星象碎片</p>
          <p>无法使用 ：1超能 2手雷 3充能近战 （*职业技能可用）</p>
          <p>武器为任意蓝色品质的装备，不限使用，可以随意更换</p>
          <p>赛季神器可以点亮第一排眩晕勇士的模组</p>
          <p>raid本中掉落的武器或护甲可以直接使用，掉落的武器与护甲，不能进行大师升级，但是可以插入模组（掉落的装备为 Raid 装备，可以插 Raid 模组）</p>
          <p>武器可以增加任意模组，护甲可以增加属性模组</p>
          <hr>
          <p>在每次遭遇战（不包含开门关）开始之前</p>
          <p>所有玩家均可在卡池中抽取两张卡牌</p>
          <p>商店免费刷新次数+1</p>
          <p>每开启一个宝箱（含隐藏箱）获得 1-3 个货币，若无暇通过遭遇战额外奖励6单位货币</p>
          <p>无暇的判断条件为：插旗之后通关本次遭遇战无人死亡即可，若出现bug/掉线/没摸子弹等其他情况团灭不计在内，不可以主动进行团灭</p>
          <p>且遭遇战正在进行时，落地死亡的人不能获得无暇奖励</p>
          <hr>
          <p>减益卡牌说明</p>
          <p>每携带一张微弱不适卡牌，每过一关遭遇战则获得 1 货币</p>
          <p>每携带一张重度不适卡牌，每过一关遭遇战则获得 2 货币</p>
          <p>每携带一张反人类卡牌，每过一关遭遇战则获得 3 货币</p>
        </div>
      </template>
    </InfoBoard>

  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/options';
</style>

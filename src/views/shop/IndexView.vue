<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useShopStore, useUserStore } from '@/stores'
import { lotteryByCount, deckType, deleteCard, lightImg } from '@/utils'
import TipsView from '@/components/tips/IndexView.vue'
import InfoBoard from '@/components/infoboard/IndexView.vue'

// 商店仓库
const shopStore = useShopStore()
const {
  fixedItems,
  fixedItemsImg,
  randomItems,
  randomItemsImg
} = storeToRefs(useShopStore())

// 用户仓库
const userStore = useUserStore()
const {
  playerMoney,
  refreshCount,
  refreshMoney,
  backpack,
  backpackImg,
  profiteer,
  infoBoard
} = storeToRefs(useUserStore())

// 圣水提示框
const waterDialogVisible = ref(false)
const waterDeckList: any = ref([])

// 提示框
const tipsRef = ref()
const tooltipShow = ref(false)
const tooltipConfig = ref({
  itemName: '',
  itemKind: '',
  itemRarity: '',
  itemDescription: '',
  sellMoney: ''
})

// 显示提示框
const showTooltip = (item: any) => {
  tooltipShow.value = true

  tooltipConfig.value.itemName = item.itemName
  tooltipConfig.value.itemKind = item.kind
  tooltipConfig.value.itemRarity = item.rarity
  tooltipConfig.value.itemDescription = item.description
  tooltipConfig.value.sellMoney = item.sell

  if (profiteer.value) {
    tooltipConfig.value.sellMoney = item.sell + 1
  }

  tipsRef.value.setToolTips(item)
}
//  关闭提示框
const hideTooltip = () => {
  tooltipShow.value = false
}

// 购买物品
const buyItem = (item: any, index: number) => {
  switch (item.type) {
    case 'water':
      buyWater(item)
      break
    case 'drawCount':
      buyDrawCount(item)
      break
    case 'Weapons':
      buyRandomItem(item, index)
      break
    case 'Armor':
      buyRandomItem(item, index)
      break
    default:
      break
  }
}

// 购买圣水
const buyWater = (item: any) => {
  let sell = item.sell

  if (profiteer.value) {
    sell += 1
  }

  if (userStore.playerMoney < sell) {
    ElMessage({
      message: '货币不足无法购买',
      grouping: true,
      type: 'error'
    })
    return
  }

  const itemName = item.name
  let cardType = ''

  switch (itemName) {
    case 'water1':
      cardType = deckType[3]
      break
    case 'water2':
      cardType = deckType[4]
      break
    case 'water3':
      cardType = deckType[5]
      break
    case 'water7':
      cardType = deckType[6]
      break
    default:
      break
  }

  waterDeckList.value = userStore.deckList[cardType]

  if (waterDeckList.value.length === 0) {
    ElMessage({
      message: '当前没有可以消除的卡牌',
      grouping: true,
      type: 'error'
    })
    return
  }

  waterDialogVisible.value = true
}

// 购买抽卡机会
const buyDrawCount = (item: any) => {
  let sell = item.sell

  if (profiteer.value) {
    sell += 1
  }

  if (userStore.playerMoney < sell) {
    ElMessage({
      message: '货币不足无法购买',
      grouping: true,
      type: 'error'
    })
    return
  }

  userStore.playerMoney -= sell
  userStore.drawCount += 1

  ElMessage({
    message: '您已增加一次抽卡机会',
    grouping: true,
    type: 'success'
  })
}

// 购买物品
const buyRandomItem = (item: any, index: number) => {
  // 售价
  let sell = item.sell

  if (profiteer.value) sell += 1

  // 货币不足
  if (userStore.playerMoney < sell && !userStore.market) {
    ElMessage({
      message: '货币不足无法购买',
      grouping: true,
      type: 'error'
    })
    return
  }

  // 购买成功
  userStore.playerMoney -= sell

  item.count--

  // 恶魔契约
  if (userStore.devilspact != 0) {
    userStore.devilspact -= 1
    userStore.drawCount += 1
  }

  userStore.backpack.push(item)
  userStore.backpackImg.push(randomItemsImg.value[index])

  ElMessage({
    message: '购买 ' + item.itemName + ' 成功',
    grouping: true,
    type: 'success'
  })
}

// 删除卡牌
const deleteCardItem = (card: any, index: number) => {
  let sell = 0

  switch (card.type) {
    case deckType[3]:
      sell = 3
      break
    case deckType[4]:
      sell = 6
      break
    case deckType[5]:
      sell = 12
      break;
    case deckType[6]:
      sell = 7
      break
    default:
      break
  }

  if (profiteer.value) {
    sell += 1
  }

  if (userStore.playerMoney < sell) {
    ElMessage({
      message: '货币不足无法购买',
      grouping: true,
      type: 'error'
    })
    return
  }

  deleteCard(card)
  waterDeckList.value.splice(index, 1)

  userStore.playerMoney -= sell

  if (waterDeckList.value.length === 0) {
    waterDialogVisible.value = false
  }
}

// 刷新商店按钮
const refreshShop = () => {
  const refreshMod = userStore.refreshCount >= 1 ? 'free' : 'pay'

  if (refreshMod === 'free') {
    userStore.refreshCount--
  }
  else if (refreshMod === 'pay') {
    if (userStore.playerMoney - userStore.refreshMoney < 0) {
      ElMessage({
        message: '货币不足',
        grouping: true,
        type: 'error'
      })
      return
    }

    userStore.playerMoney -= userStore.refreshMoney
    userStore.refreshMoney += 1
  }

  refreshShopItem()
}

// 刷新商店
const refreshShopItem = () => {
  shopStore.randomItems[0] = lotteryByCount(shopStore.weapons.weapons1)
  shopStore.randomItems[1] = lotteryByCount(shopStore.weapons.weapons2)
  shopStore.randomItems[2] = lotteryByCount(shopStore.weapons.weapons3)
  shopStore.randomItems[3] = lotteryByCount(shopStore.weapons.exotic)

  // 检测角色类型
  switch (userStore.role) {
    case 'titan':
      shopStore.randomItems[4] = lotteryByCount(shopStore.armor.titanArmor)
      break
    case 'hunter':
      shopStore.randomItems[4] = lotteryByCount(shopStore.armor.hunterArmor)
      break
    case 'warlock':
      shopStore.randomItems[4] = lotteryByCount(shopStore.armor.warlockArmor)
      break
    default:
      break
  }

  shopStore.setRandomItemsImg()

  // 判断是否有窃取
  if (userStore.steal) {
    for (let i = 0; i < 5; i++) {
      userStore.backpack.push(shopStore.randomItems[i])
      userStore.backpackImg.push(randomItemsImg.value[i])
    }

    userStore.steal = false
  }
}

// 开启商店
const openShop = () => {
  const sell = 12

  if (userStore.playerMoney < sell) {
    ElMessage({
      message: '你需要 ' + sell + ' 货币才能解锁商店',
      grouping: true,
      type: 'error'
    })
    return
  }

  userStore.playerMoney -= sell

  const name = 'Stillwater-Prison'
  userStore.deckList[deckType[5]].forEach((card: any) => {
    if (card.name == name) {
      deleteCard(card)

      ElMessage({
        message: '你已重新开启商店系统',
        grouping: true,
        type: 'success'
      })

      return;
    }
  })
}

// 商店初始化
const initShop = () => {

  // 静水监狱
  if (userStore.shopClosed) {
    ElMessage({
      message: '您的商店系统已被关闭！',
      type: 'error',
      duration: 0,
      showClose: true
    })
  }

  // 价格检测
  if (profiteer.value) {
    ElMessage({
      message: '购买任意物品价格提高 1 货币！',
      grouping: true,
      duration: 0,
      showClose: true
    })
  }

  // 恶魔契约检测
  if (userStore.devilspact != 0) {
    ElMessage({
      message: '恶魔契约已启用',
      grouping: true,
      duration: 0,
      showClose: true
    })
  }

  // 未来市场
  if (userStore.market) {
    ElMessage({
      message: '未来市场已启用',
      grouping: true,
      duration: 0,
      showClose: true
    })
  }

  // console.log(shopStore.randomItems)
}
// 初始化
initShop()
</script>

<template>
  <div id="shop" @mousemove="tipsRef.moveTooltip($event)">

    <!-- 提示框 -->
    <TipsView ref="tipsRef" :tooltipShow="tooltipShow">
      <template #header>
        <div class="name">{{ tooltipConfig.itemName }}</div>
        <div class="type">
          <div class="kind">{{ tooltipConfig.itemKind }}</div>
          <div class="rarity">{{ tooltipConfig.itemRarity }}</div>
        </div>
      </template>
      <template #main>
        <div class="description">
          <div class="text">
            <p class="type">{{ tooltipConfig.itemDescription }}</p>
          </div>
        </div>
        <div class="line"></div>
        <div class="monetary">
          <div class="name">
            <img class="light" :src="lightImg" alt="light.png" />
            <p>光尘货币</p>
          </div>
          <div class="info">
            <p class="text">
              <span class="money">{{ playerMoney }}</span> /
              <span class="sell">{{ tooltipConfig.sellMoney }}</span>
            </p>
          </div>
        </div>
      </template>
    </TipsView>

    <div class="shop-list">
      <div class="shop-top">
        <h1 class="shop-title">随机商店</h1>
        <div class="shop-options">
          <button class="button refresh-button" @click="refreshShop">刷新商店</button>
          <p id="refresh-count">免费刷新次数：{{ refreshCount }}</p>
          <p id="pay-count">付费刷新费用：{{ refreshMoney }}</p>
        </div>
        <hr class="shop-line" />
      </div>

      <div class="fixed-list">
        <h2 class="shop-title">固定售卖</h2>
        <hr class="shop-line" />
        <div class="item-list">
          <div v-for="(item, index) in fixedItems" :key="item" class="item" @mousemove="showTooltip(item)"
            @mouseout="hideTooltip()" @click="buyItem(item, index)"
            :style="{ 'background-image': `url(${fixedItemsImg[index]})` }"></div>
        </div>
      </div>

      <div class="random-list">
        <h2 class="shop-title">随机售卖</h2>
        <hr class="shop-line" />
        <div class="item-list">
          <div v-for="(item, index) in randomItems" :key="index" class="item" @mousemove="showTooltip(item)"
            @mouseout="hideTooltip()" @click="buyItem(item, index)"
            :style="{ 'background-image': `url(${randomItemsImg[index]})` }"></div>
        </div>
      </div>
    </div>

    <div class="backpack">
      <div class="backpack-top">
        <h1 class="backpack-title">背包</h1>
        <hr class="backpack-line" />
      </div>

      <div class="item-list" v-if="backpack.length === 0">
        <h1>当前背包无物品</h1>
      </div>
      <div class="item-list" v-else>
        <div v-for="(item, index) in backpack" :key="index" class="item"
          :style="{ 'background-image': `url(${backpackImg[index]})` }"></div>
      </div>
    </div>

    <!-- 圣水提示框 -->
    <el-dialog class="card-dialog" v-model="waterDialogVisible" :close-on-click-modal="false" width="79.25rem"
      align-center>
      <h1 class="title">选择要删除的卡牌</h1>
      <div class="card-list-box">
        <div class="card-item" v-for="(card, index) in waterDeckList" :key="index" @click="deleteCardItem(card, index)">
          <div class="card">
            <div class="card-info">
              <p class="card-id">{{ card.cardName }}</p>
              <p class="card-name">{{ card.name }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="card-confirm-box">
        <button type="button" class="button card-cancel" @click="waterDialogVisible = false">
          取消
        </button>
      </div>
    </el-dialog>

    <!-- 商店关闭模态框 -->
    <div class="shop-closed" v-if="userStore.shopClosed">
      <button class="button open-shop" @click="openShop">开启商店</button>
    </div>

    <!-- 商店信息版 -->
    <InfoBoard type="right" :show-info-board="infoBoard.gameShop">
      <template #close-button>
        <div class="close-button">
          <a @click="infoBoard.gameShop = !infoBoard.gameShop">{{ infoBoard.gameShop ? "关闭" :
            "查看商店说明"
            }}</a>
        </div>
      </template>
      <template #title>
        <h1 class="title">
          商店说明
        </h1>
      </template>
      <template #content>
        <div>
          <p>随机售卖栏不会自己刷新，每轮遭遇战可获得一次免费随机售卖栏刷新机会，不可叠加</p>
          <p>免费刷新使用后可使用货币付费刷新，第一次刷新消耗1单位货币，第二次刷新消耗2单位货币，以此类推，付费刷新消耗不重置</p>
          <p>商店除遭遇战进行中都可以使用，打遭遇战团灭了之后到下一次开打前也可以使用</p>
          <hr>
          <p>固定售卖</p>
          <p>1阶圣水，可消除一张微弱不适卡牌，售价3单位货币</p>
          <p>2阶圣水，可消除一张重度不适卡牌，售价6单位货币</p>
          <p>3阶圣水，可消除一张反人类卡牌，售价12单位货币</p>
          <p>7阶圣水，可消除一张特殊卡牌，售价7单位货币</p>
          <p>卡牌抽取机会一次，售价3单位货币</p>
          <hr>
          <p>随机售卖</p>
          <p>随机售卖栏1：【白弹】自动步枪、斥候、脉冲、手炮、微冲、手枪、弓箭自选（售价1单位货币）</p>
          <p>随机售卖栏2：【绿弹】霰弹、榴弹、聚合、狙击、追踪、偃月自选（售价3单位货币）</p>
          <p>随机售卖栏3：【重弹】刀剑、榴弹、筒子、线融、机枪自选（售价6单位货币）</p>
          <p>随机售卖栏4：异域武器（售价6单位货币）</p>
          <p>随机售卖栏5：异域护甲（售价6单位货币）</p>
        </div>
      </template>
    </InfoBoard>
  </div>
</template>

<style lang="scss">
@import '@/assets/styles/shop';
</style>

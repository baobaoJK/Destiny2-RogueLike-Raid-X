<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useShopStore, useUserStore } from '@/stores'
import { lotteryByCount, deckType, deleteCard } from '@/utils'

const fixedItems = ref()
const randomItems = ref()
const backpackItems = ref()
const backpackImg = ref()
const refreshMoney = ref()
const refreshCount = ref()
const shopClosed = ref()
const lightImg = new URL('/images/light.png', import.meta.url).href
const playerMoney = ref()

// 商店价格提高
const profiteer = ref()

// 圣水提示框
const waterDialogVisible = ref()

// 固定售卖图片
const fixedImg: any = ref([])

// 提示框
const tooltipShow = ref()
const tooltipLocation = ref()
const itemName = ref()
const itemKind = ref()
const itemRarity = ref()
const itemDescription = ref()
const sellMoney = ref()
const wrapper = ref()
const header = ref()
const waterDeckList: any = ref([])
const randomItemsImg: any = ref([])

const moveTooltip = (e: any) => {
  // values: e.clientX, e.clientY, e.pageX, e.pageY
  const x = e.pageX + 8
  const y = e.pageY + 8

  tooltipLocation.value = 'translate(' + x + 'px, ' + y + 'px)'
}
const showTooltip = (item: any) => {
  tooltipShow.value = true
  setToolTips(item)
}
const hideTooltip = () => {
  tooltipShow.value = false
}
// 设置提示信息
const setToolTips = (item: any) => {
  switch (item.rarity) {
    case '异域':
      wrapper.value = '#2A271A'
      header.value = '#CFB444'
      break
    case '传说':
      wrapper.value = '#262727'
      header.value = '#633F60'
      break
    case '稀有':
      wrapper.value = '#262727'
      header.value = '#5F81AB'
      break
    case '罕见':
      wrapper.value = '#262727'
      header.value = '#477B4D'
      break
    case '无':
    default:
      wrapper.value = '#262727'
      header.value = '#C6C0B9'
      break
  }

  itemName.value = item.itemName
  itemKind.value = item.kind
  itemRarity.value = item.rarity
  itemDescription.value = item.description
  sellMoney.value = item.sell

  if (profiteer.value) {
    sellMoney.value = item.sell + 1
  }
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
  const userStore = useUserStore()
  const sell = ref(item.sell)

  if (profiteer.value) {
    sell.value += 1
  }

  if (userStore.playerMoney < sell.value) {
    ElMessage({
      message: '货币不足无法购买',
      grouping: true,
      type: 'error'
    })
    return
  }

  const itemName = item.name
  const cardType = ref('')

  switch (itemName) {
    case 'water1':
      cardType.value = deckType[3]
      break
    case 'water2':
      cardType.value = deckType[4]
      break
    case 'water3':
      cardType.value = deckType[5]
      break
    default:
      break
  }

  waterDeckList.value = userStore.deckList[cardType.value]

  if (waterDeckList.value.length == 0) {
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
  const userStore = useUserStore()
  const sell = item.sell

  if (profiteer.value) {
    sell.value += 1
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
  playerMoney.value = userStore.playerMoney

  ElMessage({
    message: '您已增加一次抽卡机会',
    grouping: true,
    type: 'success'
  })
}

// 购买物品
const buyRandomItem = (item: any, index: number) => {
  const userStore = useUserStore()
  // 货币
  const money = userStore.playerMoney
  let sell = item.sell

  if (profiteer.value) sell += 1
  console.log(userStore.market)

  // 货币不足
  if (money < sell && !userStore.market) {
    ElMessage({
      message: '货币不足无法购买',
      grouping: true,
      type: 'error'
    })
    return
  }

  // 购买成功
  userStore.playerMoney = money - sell
  playerMoney.value = userStore.playerMoney

  item.count--

  // 恶魔契约
  if (userStore.devilspact != 0) {
    userStore.devilspact -= 1
    userStore.drawCount += 1
  }

  userStore.backpack.push(item)
  userStore.backpackImg.push(randomItemsImg.value[index])

  backpackItems.value = userStore.backpack
  backpackImg.value = userStore.backpackImg

  ElMessage({
    message: '购买 ' + item.itemName + ' 成功',
    grouping: true,
    type: 'success'
  })
}

// 删除卡牌
const deleteCardItem = (card: any, index: number) => {
  const userStore = useUserStore()
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
  playerMoney.value = userStore.playerMoney
}

// 刷新商店按钮
const refreshShop = () => {
  const userStore = useUserStore()
  const refreshMod = userStore.refreshCount >= 1 ? 'free' : 'pay'

  if (refreshMod === 'free') {
    refreshCount.value -= 1
    userStore.refreshCount--
  } else if (refreshMod === 'pay') {
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

    refreshMoney.value = userStore.refreshMoney
    playerMoney.value = userStore.playerMoney
  }

  refreshShopItem()
}

// 刷新商店
const refreshShopItem = () => {
  const shopStore = useShopStore()
  shopStore.randomItems[0] = lotteryByCount(shopStore.weapons.weapons1)
  shopStore.randomItems[1] = lotteryByCount(shopStore.weapons.weapons2)
  shopStore.randomItems[2] = lotteryByCount(shopStore.weapons.weapons3)
  shopStore.randomItems[3] = lotteryByCount(shopStore.weapons.exotic)

  // 检测角色类型
  const userStore = useUserStore()
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

  randomItems.value = shopStore.randomItems

  setRandomItemsImg()
}

// 随机商店物品图片
const setRandomItemsImg = () => {
  const shopStore = useShopStore()
  const userStore = useUserStore()

  if (shopStore.randomItems[0].itemName === '空物品') return
  randomItemsImg.value[0] = new URL(
    '/images/shop/weapons1/' + shopStore.randomItems[0].itemName + '.jpg',
    import.meta.url
  ).href
  randomItemsImg.value[1] = new URL(
    '/images/shop/weapons2/' + shopStore.randomItems[1].itemName + '.jpg',
    import.meta.url
  ).href
  randomItemsImg.value[2] = new URL(
    '/images/shop/weapons3/' + shopStore.randomItems[2].itemName + '.jpg',
    import.meta.url
  ).href
  randomItemsImg.value[3] = new URL(
    '/images/shop/exotic/' + shopStore.randomItems[3].itemName + '.jpg',
    import.meta.url
  ).href
  randomItemsImg.value[4] = new URL(
    '/images/shop/' + userStore.role + '/' + shopStore.randomItems[4].itemName + '.jpg',
    import.meta.url
  ).href
}

// 开启商店
const openShop = () => {
  const userStore = useUserStore()
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
    }
  })

  ElMessage({
    message: '你已重新开启商店系统',
    grouping: true,
    type: 'success'
  })
  shopClosed.value = false
}

// 商店初始化
const initShop = () => {
  const shopStore = useShopStore()
  const userStore = useUserStore()

  fixedItems.value = shopStore.fixedItems
  randomItems.value = shopStore.randomItems
  backpackItems.value = userStore.backpack
  backpackImg.value = userStore.backpackImg
  refreshMoney.value = userStore.refreshMoney
  refreshCount.value = userStore.refreshCount
  shopClosed.value = false
  profiteer.value = false
  waterDialogVisible.value = false
  fixedImg.value[0] = new URL('/images/shop/water.jpg', import.meta.url).href
  fixedImg.value[1] = new URL('/images/shop/water.jpg', import.meta.url).href
  fixedImg.value[2] = new URL('/images/shop/water.jpg', import.meta.url).href
  fixedImg.value[3] = new URL('/images/shop/card.png', import.meta.url).href
  tooltipShow.value = false
  tooltipLocation.value = 'translate(0px, 0px)'
  itemName.value = '合成感受器'
  itemKind.value = '臂铠'
  itemRarity.value = '异域'
  itemDescription.value = '这是一个泰坦的臂铠'
  sellMoney.value = 0
  wrapper.value = '#2A271A'
  header.value = '#CFB444'
  playerMoney.value = userStore.playerMoney
  // 商店检测
  userStore.deckList[deckType[5]].forEach((card: any) => {
    if (card.name == 'Stillwater-Prison') {
      ElMessage({
        message: '您的商店系统已被关闭！',
        type: 'error',
        duration: 0,
        showClose: true
      })

      shopClosed.value = true
      return
    }
  })

  // 价格检测
  userStore.deckList[deckType[4]].forEach((card: any) => {
    if (card.name == 'Reicher-Playboy') {
      profiteer.value = true
      ElMessage({
        message: '购买任意物品价格提高 1 货币！',
        grouping: true,
        duration: 0,
        showClose: true
      })
      return
    }
  })

  // 恶魔契约检测
  if (userStore.devilspact != 0) {
    ElMessage({
      message: '恶魔契约已启用',
      grouping: true,
      duration: 0,
      showClose: true
    })
  }

  setRandomItemsImg()
  // console.log(shopStore.randomItems)
}
// 初始化
initShop()
</script>

<template>
  <div id="shop" @mousemove="moveTooltip($event)">
    <div id="tooltip" :class="{ show: tooltipShow }" :style="{ transform: tooltipLocation }">
      <div class="wrapper" :style="{ 'background-color': wrapper }">
        <div class="header" :style="{ 'background-color': header }">
          <div class="name">{{ itemName }}</div>
          <div class="type">
            <div class="kind">{{ itemKind }}</div>
            <div class="rarity">{{ itemRarity }}</div>
          </div>
        </div>
        <div class="main">
          <div class="description">
            <div class="text">
              <p class="type">{{ itemDescription }}</p>
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
                <span class="sell">{{ sellMoney }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

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
            :style="{ 'background-image': `url(${fixedImg[index]})` }"></div>
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

      <div class="item-list">
        <div v-for="(item, index) in backpackItems" :key="index" class="item"
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
    <div class="shop-closed" v-if="shopClosed">
      <button class="button open-shop" @click="openShop">开启商店</button>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/assets/styles/shop';
</style>

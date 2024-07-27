<script lang="ts" setup>
import { useUserStore } from '@/stores'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { lightImg, cardImg } from '@/utils';

const userInfo = ref()
const route: any = ref('')
const routePath = [
  '/map',
  '/options',
  '/deck',
  '/decklist',
  '/bounty',
  '/playerevent',
  '/globalevent',
  '/shop'
]

// 名片
const emblemSpecial = ref('')
const emblemIcon = ref('')

// 导航栏
const activeIndex = ref(2)
// 设置导航栏激活状态
const setActive = (index: number) => {
  activeIndex.value = index
}

const initGamePanel = () => {
  // 设置路由
  route.value = useRoute()
  for (let i = 0; i < routePath.length; i++) {
    const routePathStr = route.value.path
    if (routePathStr == routePath[i]) {
      activeIndex.value = i + 1
    }
  }

  const userStore = useUserStore()
  userInfo.value = userStore.getUserInfo()

  // 设置名片
  if (userInfo.value.username === '和泉纱雾') {
    emblemSpecial.value = new URL('/images/emblem/es-w.jpg', import.meta.url).href
    emblemIcon.value = new URL('/images/emblem/es_icon.png', import.meta.url).href
  }
  // 年糕明名片
  else if (userInfo.value.username === '年糕明') {
    emblemSpecial.value = new URL('/images/emblem/up/ngm/special.jpg', import.meta.url).href
    emblemIcon.value = new URL('/images/emblem/up/ngm/overlay.png', import.meta.url).href
  }
  // 铸币梅eve
  else if (userInfo.value.username === '铸币梅eve') {
    emblemSpecial.value = new URL('/images/emblem/up/zbmeve/special.png', import.meta.url).href
    emblemIcon.value = new URL('/images/emblem/up/zbmeve/overlay.png', import.meta.url).href

  }
  else if (userInfo.value.isCaptain) {
    emblemSpecial.value = new URL('/images/emblem/captain-w.jpg', import.meta.url).href
    emblemIcon.value = new URL('/images/emblem/captain_icon.png', import.meta.url).href
  } else {
    emblemSpecial.value = new URL(
      '/images/emblem/' + userInfo.value.role + '-w.jpg',
      import.meta.url
    ).href
    emblemIcon.value = new URL(
      '/images/emblem/' + userInfo.value.role + '_icon.png',
      import.meta.url
    ).href
  }
}

initGamePanel()
</script>

<template>
  <div id="gamepanel">
    <div class="header">
      <div class="image" :style="{ 'background-image': `url(${emblemSpecial})` }"></div>
      <div class="role">
        <div class="icon" :style="{ 'background-image': `url(${emblemIcon})` }"></div>
        <div class="info">
          <router-link class="emblem" to="home">
            <p class="name">{{ userInfo.username }}</p>
            <div class="sub">
              <p class="number">{{ userInfo.roleId }} 号玩家</p>
              <p class="line">/</p>
              <p class="light">2000</p>
              <p class="line">/</p>
              <p class="money">
                <img class="light" :src="lightImg" alt="light.png" />
                光尘货币：{{ userInfo.playerMoney }}
              </p>
              <p class="line">/</p>
              <p class="draw-count">
                <img class="draw" :src="cardImg" alt="card.png" />
                抽卡次数：{{ userInfo.drawCount }}
              </p>
            </div>
          </router-link>
        </div>
      </div>

      <div class="menu">
        <ul>
          <li v-if="userInfo.isCaptain" class="menu-link" key="1" :class="{ active: activeIndex === 1 }"
            @click="setActive(1)">
            <router-link to="map" target="windows">地图</router-link>
          </li>
          <li class="menu-link" key="2" :class="{ active: activeIndex === 2 }" @click="setActive(2)">
            <router-link to="options" target="windows">操作面板</router-link>
          </li>
          <li class="menu-link" key="3" :class="{ active: activeIndex === 3 }" @click="setActive(3)">
            <router-link to="deck" target="windows">卡牌抽取</router-link>
          </li>
          <li class="menu-link" key="4" :class="{ active: activeIndex === 4 }" @click="setActive(4)">
            <router-link to="decklist" target="windows">持有卡牌</router-link>
          </li>
          <li class="menu-link" key="5" :class="{ active: activeIndex === 5 }" @click="setActive(5)">
            <router-link to="bounty" target="windows">悬赏任务</router-link>
          </li>
          <li class="menu-link" key="6" :class="{ active: activeIndex === 6 }" @click="setActive(6)">
            <router-link to="playerevent" target="windows">个人事件</router-link>
          </li>
          <li v-if="userInfo.isCaptain" class="menu-link" key="7" :class="{ active: activeIndex === 7 }"
            @click="setActive(7)">
            <router-link to="globalevent" target="windows">全局事件</router-link>
          </li>
          <li class="menu-link" key="8" :class="{ active: activeIndex === 8 }" @click="setActive(8)">
            <router-link to="shop" target="windows">商店</router-link>
          </li>
          <!-- <li class="menu-link" key="9" :class="{ active: activeIndex === 9 }" @click="setActive(9)">
            <router-link to="shop" target="windows">记忆水晶</router-link>
          </li> -->
        </ul>
      </div>
    </div>

    <div class="main">
      <router-view key="options"></router-view>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/assets/styles/gamepanel';
</style>

<script lang="ts" setup>
import { ref } from 'vue'
import { lottery, lotteryByCount } from '@/utils/lottery'
import { useRaidStore, useUserStore } from '@/stores'
import { getRaidMapImg } from '@/utils'
import InfoBoard from "@/components/infoboard/IndexView.vue"
import { storeToRefs } from 'pinia'

// 地图仓库
const raidStore = useRaidStore()

// 用户仓库
const { infoBoard } = storeToRefs(useUserStore())

const mapListRef = ref<HTMLStyleElement>()
const mapNameRef = ref<HTMLStyleElement>()

const buttonDisabled = ref()
const opacityValue = ref()
const mapList = ref()

// 抽取地图事件
const rollMap = (
  mapListRef: HTMLStyleElement | undefined,
  mapNameRef: HTMLStyleElement | undefined
) => {
  buttonDisabled.value = true
  setMapList()

  if (mapListRef) {
    mapListRef.style.transform = 'translateX(-2507.875rem)'
    mapListRef.style.transition = 'all 10s cubic-bezier(0.1, 0.4, 0.25, 1)'
  }

  setTimeout(function () {
    if (mapNameRef) {
      opacityValue.value = 1
      mapNameRef.innerText = String(mapList.value[43].name)
    }
  }, 11000)
}

// 设置 地图 信息
const setMapList = () => {

  const maps = raidStore.maps

  // 数量
  const lotteryCount = 50

  // 地图列表
  const tempMapList = []

  // 添加 地图 信息
  for (let i = 0; i < lotteryCount; i++) {
    let map
    if (i == lotteryCount - 7) {
      map = lotteryByCount(maps)
      map.count -= 1

      // 数据操作
      raidStore.map = map
      raidStore.mapId = map.id - 1
      raidStore.level = map.level
      raidStore.levelPoint = 1
      raidStore.chest = map.chest
      raidStore.chestPoint = 1
    } else {
      map = lottery(maps)
    }

    tempMapList.push(map)
  }
  mapList.value = tempMapList
}

const initMap = () => {
  buttonDisabled.value = false
  opacityValue.value = 0
  mapList.value = null
}
initMap()
</script>

<template>
  <div id="map">
    <h1 class="map-title">抽取游玩地图</h1>
    <div class="map-roll-list">
      <div class="map-list" ref="mapListRef">
        <div class="map-img">
          <img :src="getRaidMapImg('请选择地图')" alt="请选择地图.jpg" />
        </div>
        <div class="map-img" v-for="(map, index) in mapList" :key="index">
          <img :src="getRaidMapImg(map.name)" :alt="map.name + '.jpg'" />
        </div>
      </div>
    </div>
    <div class="map-text">
      <h1 ref="mapNameRef" :style="{ opacity: opacityValue, transition: 'opacity 1s' }">

      </h1>
    </div>
    <button class="button" @click="rollMap(mapListRef, mapNameRef)" :disabled="buttonDisabled">
      抽取地图
    </button>

    <!-- 地图信息版 -->
    <InfoBoard type="right" :show-info-board="infoBoard.gameMap">
      <template #close-button>
        <div class="close-button">
          <a @click="infoBoard.gameMap = !infoBoard.gameMap">{{ infoBoard.gameMap ? "关闭" : "查看地图说明" }}</a>
        </div>
      </template>
      <template #title>
        <h1 class="title">
          地图信息
        </h1>
      </template>
      <template #content>
        <div>
          <h2>突袭地图列表</h2>
          <p>最后一愿、救赎花园、深岩墓室、玻璃拱顶、门徒誓约、国王的陨落、梦魇根源、克洛塔的末日、救赎的边缘（后续可能加入）</p>
          <hr>
          <h2>地牢地图列表</h2>
          <p>破碎王座，异端深渊，预言，贪婪之握，二象性，守望者尖塔，全面爆发，冥冥低语</p>
        </div>
      </template>
    </InfoBoard>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/map';
</style>

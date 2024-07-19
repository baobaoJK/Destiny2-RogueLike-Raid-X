<script lang="ts" setup>
import { ref } from 'vue'
import { lottery, lotteryByCount } from '@/utils/lottery'
import { useRaidStore } from '@/stores'
import { getRaidMapImg } from '@/utils'

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
  const raidStore = useRaidStore()

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
          <img :src="getRaidMapImg('国王的陨落')" alt="国王的陨落.jpg" />
        </div>
        <div class="map-img" v-for="(map, index) in mapList" :key="index">
          <img :src="getRaidMapImg(map.name)" :alt="map.name + '.jpg'" />
        </div>
      </div>
    </div>
    <div class="map-text">
      <h1 ref="mapNameRef" :style="{ opacity: opacityValue, transition: 'opacity 1s' }">
        国王的陨落
      </h1>
    </div>
    <button class="map-button" @click="rollMap(mapListRef, mapNameRef)" :disabled="buttonDisabled">
      抽取地图
    </button>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/map';
</style>

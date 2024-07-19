<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'

// 赏金列表
const bountyList = ref()
const flipStage = ref(Array.from({ length: 3 }, () => false))

// 赏金任务完成
const finishBounty = (index: number) => {
  const userStore = useUserStore()
  const nullBounty = {
    id: 'V0',
    type: 'Value',
    name: '',
    valueName: '当前没有赏金任务',
    description: '请过段时间再来',
    weight: 0,
    count: 1
  }

  flipStage.value[index] = false
  userStore.bountyList[index] = nullBounty
  userStore.playerMoney += 3

  ElMessage({
    message: '已完成悬赏，获得 3 货币',
    grouping: true,
    type: 'success'
  })
}

//初始化
const initBounty = () => {
  const userStore = useUserStore()
  bountyList.value = userStore.bountyList

  flipStage.value = []

  setTimeout(() => {
    flipStage.value = Array.from({ length: 3 }, () => true)
  }, 100)
}
initBounty()
</script>

<template>
  <div id="bounty">
    <div class="bounty-list">
      <div class="bounty-box" v-for="(bounty, index) in bountyList" :key="index">
        <div class="bounty-item" :class="{ flip: flipStage[index] }" :id="'bounty-' + (index + 1)">
          <div class="bounty-card bounty-front">
            <div class="bounty-info">
              <div>
                <p class="title">{{ bounty.valueName }}</p>
                <p class="sub-title">{{ bounty.name }}</p>
              </div>
              <p class="text">{{ bounty.description }}</p>
              <button class="button" @click="finishBounty(index)" v-if="bounty.id !== 'V0'">
                已完成
              </button>
            </div>
          </div>
          <div class="bounty-card bounty-back"></div>
        </div>

        <p class="bounty-name">- 赏金任务 -</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/assets/styles/bounty';
</style>

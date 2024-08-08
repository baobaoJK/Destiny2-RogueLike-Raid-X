<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
import { randomNum } from '@/utils';
import { storeToRefs } from 'pinia';
import InfoBoard from "@/components/infoboard/IndexView.vue"

// 用户信息仓库
const userStore = useUserStore()
const { infoBoard } = storeToRefs(useUserStore())

// 赏金列表
const { bountyList } = storeToRefs(useUserStore())
const flipStage = ref(Array.from({ length: 3 }, () => false))

// 赏金任务完成
const finishBounty = () => {
  const nullBounty = {
    id: 'V0',
    type: 'Value',
    tag: '',
    name: '',
    valueName: '当前没有赏金任务',
    description: '请过段时间再来',
    stage: 'none',
    weight: 0,
    count: 1,
    idea: "D2RRX"
  }

  // 清空赏金任务列表
  for (let i = 0; i < 3; i++) {
    flipStage.value[i] = false
    userStore.bountyList[i] = nullBounty
  }

  // 添加货币与抽卡次数
  const money = randomNum(3, 5)
  userStore.playerMoney += money
  userStore.drawCount += 1

  ElMessage({
    message: `已完成悬赏，获得 ${money} 货币，并获得 1 次抽卡机会`,
    grouping: true,
    type: 'success'
  })
}

//初始化
const initBounty = () => {
  const changeButtonState = setTimeout(() => {
    flipStage.value = Array.from({ length: 3 }, () => true)
    clearTimeout(changeButtonState)
  }, 100)
}
initBounty()
</script>

<template>
  <div id="bounty">
    <div class="bounty-title">
      <h1>赏金任务三选一执行，可获得 3-5 个单位货币 + 1 次抽卡机会</h1>
    </div>
    <div class="bounty-list">
      <div class="bounty-box" v-for="(bounty, index) in bountyList" :key="index">
        <div class="bounty-item" :class="{ flip: flipStage[index] }" :id="'bounty-' + (index + 1)">
          <div class="bounty-card bounty-front">
            <div class="bounty-info">
              <div>
                <p class="title">{{ bounty.valueName }}</p>
                <p class="sub-title">{{ bounty.name }}</p>
              </div>
              <div>
                <p class="text">{{ bounty.description }}</p>
                <hr v-if="bounty.idea !== 'D2RRX'">
                <p v-if="bounty.idea !== 'D2RRX'" class="idea">想法来源：{{ bounty.idea }}</p>
              </div>
              <button class="button" @click="finishBounty" v-if="bounty.id !== 'V0'">
                已完成
              </button>
            </div>
          </div>
          <div class="bounty-card bounty-back"></div>
        </div>

        <p class="bounty-name">- 赏金任务 -</p>
      </div>
    </div>

    <!-- 赏金信息版 -->
    <InfoBoard type="right" :show-info-board="infoBoard.gameBounty">
      <template #close-button>
        <div class="close-button">
          <a @click="infoBoard.gameBounty = !infoBoard.gameBounty">{{ infoBoard.gameBounty ? "关闭" : "查看赏金说明"
            }}</a>
        </div>
      </template>
      <template #title>
        <h1 class="title">
          赏金说明
        </h1>
      </template>
      <template #content>
        <div>
          <p>每次抵达遭遇战前，都会刷新三个不同类型的赏金任务</p>
          <hr>
          <p>赏金任务三选一执行，可获得 3-5 个单位货币 +1 次抽卡机会</p>
          <hr>
          <p>悬赏仅可在遭遇战中完成</p>
          <p>悬赏可自由接取，未完成没有惩罚</p>
          <p>悬赏失败后就无法再完成，无法通过团灭重置</p>
          <p>悬赏必须在遭遇战结束后才算完成</p>
          <p>个别悬赏可以瞬间完成，例如 看板 类型悬赏</p>
        </div>
      </template>
    </InfoBoard>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/bounty';
</style>

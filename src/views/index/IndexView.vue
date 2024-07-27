<script lang="ts" setup>
import { ref } from 'vue'
const gameDialogVisible = ref(false)
const gameLogo = new URL('/images/Raid.png', import.meta.url).href // 使用 import.meta.url 动态导入图片
</script>

<template>
  <div id="index">
    <div class="background"></div>
    <!-- <router-link class="start-button" to="home">开始游戏</router-link> -->
    <a class="start-button" @click="gameDialogVisible = true">开始游戏</a>

    <!-- 游戏检测 -->
    <el-dialog class="dialog game-dialog" v-model="gameDialogVisible" :close-on-click-modal="false" align-center>
      <img class="game-logo" :src="gameLogo" alt="Logo" />
      <h1 class="title game-title" style="color: #8ab2ff">游戏开始前请阅读以下信息</h1>
      <div class="box game-box">
        <p class="text game-config">请确认已完整的阅读游戏说明和游戏玩法后进行游戏</p>
        <div class="links">
          <router-link class="link" :to="{ name: 'info', params: { page: 'destiny2' } }">→ 游戏说明 ←</router-link>
          <router-link class="link" :to="{ name: 'info', params: { page: 'gameplay' } }">→ 游戏玩法 ←</router-link>
        </div>
        <p class="text game-save">
          如果你之前有玩过此游戏，请先点击选择角色下方的 <span>清除数据按钮</span> 后再创建角色
        </p>
        <p class="text game-web">
          请使用
          <span class="edge">MicroSoft Edge 浏览器</span>
          或使用
          <span class="chrome">Google Chrome 浏览器</span>
          进行游玩
        </p>
        <p class="text game-time">请确保游玩时间充足，游玩时间约 2-3 小时</p>
      </div>
      <!-- <button type="button" class="button game-confirm" @click="gameDialogVisible = false">
      确认
    </button> -->
      <router-link class="button game-confirm" to="home">开始游戏</router-link>
    </el-dialog>

  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/index';
</style>
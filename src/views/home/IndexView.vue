<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  useUserStore,
  useRaidStore,
  useDungenoStore,
  useBountyStore,
  useEventStore,
  useShopStore,
  useDeckListStore
} from '@/stores/index'

// 角色列表
const roleList = ref([
  {
    role: 'titan',
    name: '泰坦',
    sub: '人类 / 觉醒者 / Exo',
    light: '2000'
  },
  {
    role: 'hunter',
    name: '猎人',
    sub: '人类 / 觉醒者 / Exo',
    light: '2000'
  },
  {
    role: 'warlock',
    name: '术士',
    sub: '人类 / 觉醒者 / Exo',
    light: '2000'
  }
])

// 提示框设置
const roleDialogVisible = ref(false)

// 角色信息
const userInfo = ref({
  role: '',
  roleId: 0,
  username: '',
  isCaptain: false
})

// 设置角色
const setRole = (role: string) => {
  userInfo.value.role = role
  roleDialogVisible.value = true
}

// 设置角色信息
const setRoleInfo = async () => {
  let messageInfo = ''

  // 判断角色信息
  if (userInfo.value.role == '') {
    messageInfo = '请选择游玩角色'
  } else if (userInfo.value.roleId < 1 || userInfo.value.roleId > 6) {
    messageInfo = '请选择游戏编号'
  } else if (userInfo.value.username == '') {
    messageInfo = '请输入游戏名称 / 游戏ID'
  }

  if (messageInfo != '') {
    ElMessage({
      message: messageInfo,
      grouping: true,
      type: 'error'
    })
  } else {

    // 存储信息
    const userStore = useUserStore()
    userStore.setUserInfo(userInfo.value)

    // 获取突袭地图
    const raidStore = useRaidStore()
    await raidStore.getMaps()

    // 获取地牢地图
    const dungenoStore = useDungenoStore()
    await dungenoStore.getDungeons()

    // 获取商店列表
    const shopStore = useShopStore()
    await shopStore.getShopList()

    // 获取卡牌列表
    const deckListStore = useDeckListStore()
    await deckListStore.getDeckList()

    // 获取赏金列表
    const bountyStore = useBountyStore()
    await bountyStore.getBountyList()

    // 获取个人事件列表
    const eventStore = useEventStore()
    await eventStore.getPlayerEventList()

    // 获取全局事件列表
    await eventStore.getGlobalEventList()

    // 跳转游戏面板
    // router.replace('/gamepanel')
    window.location.href = '/gamepanel'
  }
}

// 清除游戏数据
const deleteSave = () => {
  const bountyStore = useBountyStore()
  bountyStore.reset()
  const deckListStore = useDeckListStore()
  deckListStore.reset()
  const dungenoStore = useDungenoStore()
  dungenoStore.reset()
  const eventStore = useEventStore()
  eventStore.reset()
  const raidStore = useRaidStore()
  raidStore.reset()
  const shopStore = useShopStore()
  shopStore.reset()
  const userStore = useUserStore()
  userStore.reset()

  ElMessage({
    message: '清除游戏数据成功',
    grouping: true,
    type: 'success'
  })
}
</script>
<template>
  <div id="home">
    <div class="title">选择游玩角色</div>
    <div class="emblems">
      <a v-for="item in roleList" :key="item.role" class="emblem" @click="setRole(item.role)">
        <div class="role" :class="item.role">
          <div class="description">
            <p class="name">{{ item.name }}</p>
            <p class="sub">{{ item.sub }}</p>
          </div>
          <div class="light">{{ item.light }}</div>
        </div>
      </a>
      <div class="list">
        <div class="link">
          <router-link :to="{ name: 'info', params: { page: 'destiny2' } }">游戏说明</router-link>
          <router-link :to="{ name: 'info', params: { page: 'gameplay' } }">游戏玩法</router-link>
          <router-link :to="{ name: 'info', params: { page: 'update' } }">更新日志</router-link>
          <router-link :to="{ name: 'info', params: { page: 'copyright' } }">版权声明</router-link>
        </div>
        <button class="button" @click="deleteSave()">一键清除游戏数据</button>
      </div>
    </div>
  </div>

  <!-- 角色信息模态框 -->
  <el-dialog class="role-dialog dialog" v-model="roleDialogVisible" width="50rem" :close-on-click-modal="false"
    align-center>
    <h1 class="title role-title">设置游戏角色信息</h1>

    <div class="box role-captain-box">
      <p class="title role-captain-title">是否火力战队队长</p>
      <el-radio-group v-model="userInfo.isCaptain">
        <el-radio :label="true">是</el-radio>
        <el-radio :label="false">否</el-radio>
      </el-radio-group>
    </div>

    <div class="box role-id-box">
      <p class="title role-id-title">选择游戏编号</p>

      <el-radio-group v-model="userInfo.roleId">
        <el-radio v-for="index in 6" :key="index" :label="index">{{ index }} 号 </el-radio>
      </el-radio-group>
    </div>

    <div class="name-box role-name-box">
      <p class="role-name-title">输入你的游戏名称 / 游戏ID</p>
      <el-input v-model="userInfo.username" placeholder="请输入你的游戏名称 / 游戏ID"></el-input>
    </div>

    <div class="role-confirm-box">
      <button type="button" class="button role-confirm" @click="setRoleInfo()">确认</button>
      <button type="button" class="button role-cancel" @click="roleDialogVisible = false">
        取消
      </button>
    </div>
  </el-dialog>

  <!-- 页脚 -->
  <div class="footer">
    <p>
      当前网页版本为 RogueLike Raid Version X | 请完整的阅读 《游戏说明》 与 《游戏玩法》
      后再开始游戏，以免影响游戏体验
    </p>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/home';
</style>

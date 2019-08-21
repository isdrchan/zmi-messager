<template>
  <div class="manage-page">
    <el-row style="height: 100%;">
      <el-col :span="4" style="min-height: 100%;background-color: rgb(84, 92, 100);">
        <el-menu
          :default-active="defaultActive"
          style="min-height: 100%; border: 0;"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router>
          <div class="title">zmi-messager</div>
          <el-menu-item index="details"><i class="el-icon-document"></i>详情</el-menu-item>
          <el-menu-item index="message"><i class="el-icon-message"></i>短信</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20" style="height: 100%; overflow: auto;">
        <el-container direction="vertical">
          <el-header>
            <my-header @logout="logout"></my-header>
          </el-header>
          <el-main>
            <keep-alive>
              <router-view :logout="logout"></router-view>
            </keep-alive>
          </el-main>
        </el-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import myHeader from '@/components/header'
import GLOBALS from '@/utils/globals'
import { removeStore } from '@/utils/utils'

export default {
  mounted () {
    this.$router.push('details')
  },
  computed: {
    defaultActive: function () {
      return this.$route.path.replace('/', '')
    }
  },
  components: {
    myHeader
  },
  methods: {
    logout (msg = '') {
      removeStore(GLOBALS.KEY.realm)
      removeStore(GLOBALS.KEY.nonce)
      removeStore(GLOBALS.KEY.qop)
      removeStore(GLOBALS.KEY.ha1)
      removeStore(GLOBALS.KEY.gnCount)
      this.$router.push('/')
      this.$message({
        type: 'warning',
        message: msg.length === 0 ? '退出登录成功！' : msg
      })
    }
  }
}
</script>

<style scoped>
.manage-page {
  position: fixed;
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #eff2f7;
  color: #333;
  line-height: 60px;
  font-size: 12px;
}
.title {
  line-height: 60px;
  color: #fff;
  text-align: center;
  font-size: 20px;
  background-color: rgb(67, 74, 80);
  font-weight: 100;
  user-select: none;
}
</style>

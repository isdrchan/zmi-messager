<template>
  <div class="manage_page">
    <el-row style="height: 100%;">
      <el-col :span="4" style="min-height: 100%;background-color: rgb(84, 92, 100);">
        <el-menu
          :default-active="defaultActive"
          style="min-height: 100%; border: 0;"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router>
          <el-menu-item index="details"><i class="el-icon-document"></i>详情</el-menu-item>
          <el-menu-item index="message"><i class="el-icon-message"></i>短信</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20" style="height: 100%; overflow: auto;">
        <el-container direction="vertical">
          <el-header>
            <my-header></my-header>
          </el-header>
          <el-main>
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </el-main>
        </el-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import myHeader from '@/components/header'

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
  }
}
</script>

<style>
body {
  padding: 0;
  margin: 0;
}
.manage_page {
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
</style>

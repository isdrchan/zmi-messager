<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{ item }}</el-breadcrumb-item>
      <div class="btn-wrapper">
        <el-button type="text" @click="logout">
          <span class="el-icon-lock"></span> 退出登录
        </el-button>
      </div>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$emit('logout')
    }
  }
}
</script>

<style>
.el-breadcrumb {
  font-size: 14px;
  line-height: 60px;
}
.btn-wrapper {
  text-align: right;
}
</style>

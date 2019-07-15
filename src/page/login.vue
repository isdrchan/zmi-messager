<template>
  <div class="login-page">
    <div class="form-wrapper">
        <el-form class="form-group" ref="form" :model="form" label-width="80px">
            <p class="title">zmi-messager</p>
            <el-form-item label="密码" class="password-wrapper">
              <el-input v-model="form.password" show-password></el-input>
            </el-form-item>
            <el-form-item label="记住密码">
              <el-switch v-model="form.remember"></el-switch>
            </el-form-item>
            <el-form-item class="button-wrapper">
              <el-button type="primary" icon="el-icon-unlock" @click="login">登录</el-button>
              <el-button type="info" icon="el-icon-setting" @click="openSetting">设置</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import { setStore, getStore } from '@/utils/utils'
export default {
  data () {
    return {
      form: {
        password: '',
        remember: false
      },
      gatewayip: ''
    }
  },
  mounted () {
    console.log(Boolean(getStore('remember')))
    this.$set(this.form, 'remember', Boolean(parseInt(getStore('remember'))) || false)
    if (this.form.remember) {
      this.form.password = getStore('password') || ''
    }
    this.gatewayip = getStore('gatewayip') || '192.168.21.1'
  },
  watch: {
    'form.remember': {
      handler (value) {
        setStore('remember', value === true ? 1 : 0)
      }
    }
  },
  methods: {
    openSetting () {
      this.$prompt('路由器网关IP地址', '设置', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^$|^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
        inputErrorMessage: '网关IP地址格式不正确',
        inputPlaceholder: '192.168.21.1',
        inputValue: this.gatewayip || '192.168.21.1'
      }).then(({ value }) => {
        this.gatewayip = value
        setStore('gatewayip', value)
        this.$message({
          type: 'success',
          message: '已保存网关IP地址: ' + value
        })
      })
    }
  }
}
</script>

<style>
body {
  background-color: #f2f2f2;
}
.title {
  font-size: 26px;
  margin-top: 0;
  text-align: center;
}
.login-page {
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form-group {
  border: 1px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 23px 20px 1px 20px;
  border-radius: 10px;
  background-color: #fff;
}
.password-wrapper {
  padding-right: 15px;
}
.form-wrapper {
  width: 400px;
  align-self: center;
}
</style>

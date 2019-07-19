<template>
  <div class="login-page">
    <div class="form-wrapper">
        <el-form class="form-group" ref="form" :model="form" label-width="80px">
            <p class="title">zmi-messager</p>
            <el-form-item label="密码" class="password-wrapper">
              <el-input v-model="form.password" show-password></el-input>
            </el-form-item>
            <el-form-item label="记住密码" size="mini">
              <el-switch v-model="form.remember"></el-switch>
            </el-form-item>
            <el-form-item class="button-wrapper">
              <el-button type="primary" icon="el-icon-key" @click="login" :loading="isLoading">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import { setStore, getStore, removeStore, getValue } from '@/utils/utils'
import { getAuth, doLogin } from '@/api/getData'
import GLOBALS from '@/utils/globals'
import md5 from 'js-md5'

export default {
  data () {
    return {
      form: {
        password: '',
        remember: false
      },
      isLoading: false
    }
  },
  mounted () {
    this.$set(this.form, GLOBALS.KEY.remember, Boolean(parseInt(getStore(GLOBALS.KEY.remember))) || false)
    if (this.form.remember && getStore(GLOBALS.KEY.password)) {
      this.$set(this.form, GLOBALS.KEY.password, window.atob(getStore(GLOBALS.KEY.password)))
    }
    setStore(GLOBALS.KEY.gnCount, '1')
  },
  watch: {
    'form.remember': {
      handler (value) {
        setStore(GLOBALS.KEY.remember, value ? 1 : 0)
        if (!value) {
          removeStore(GLOBALS.KEY.password)
        }
      }
    }
  },
  methods: {
    async login () {
      this.isLoading = true
      const authRes = await getAuth()
      if (authRes.status !== 200) {
        this.$message({
          type: 'warning',
          message: '登录失败！请检查：1. 本机是否和路由器在同一局域网 2. setting.json中的网关地址配置项gatewayip是否正确！'
        })
        this.isLoading = false
        return
      }
      const auth = authRes.headers.get('www-authenticate')
      const authArray = auth.split(' ')
      setStore(GLOBALS.KEY.realm, getValue(authArray[1]))
      setStore(GLOBALS.KEY.nonce, getValue(authArray[2]))
      setStore(GLOBALS.KEY.qop, getValue(authArray[3]))
      setStore(GLOBALS.KEY.ha1, md5(`admin:${getStore(GLOBALS.KEY.realm)}:${this.form.password}`))
      const loginRes = await doLogin()
      console.log(loginRes.url)
      if (loginRes.status === 200) {
        if (this.form.remember) {
          setStore(GLOBALS.KEY.password, window.btoa(this.form.password))
        }
        this.$message({
          type: 'success',
          message: '登录成功！'
        })
        this.$router.push('manage')
      } else {
        this.$message({
          type: 'error',
          message: '密码错误，登录失败！'
        })
      }
      this.isLoading = false
    }
  }
}
</script>

<style>
body {
  padding: 0;
  margin: 0;
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
  background-color: #f2f2f2;
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
.button-wrapper {
  text-align: right;
  margin-right: 130px;
}
</style>

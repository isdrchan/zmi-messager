<template>
  <div>
    <el-row>
      <el-button type="primary">发送短信</el-button>
    </el-row>
    <br>
    <el-row>
      <el-table
      :data="smsArr"
      border
      style="width: 100%">
        <el-table-column
          prop="received.#text"
          label="日期">
        </el-table-column>
        <el-table-column
          prop="from.#text"
          label="发送号码">
        </el-table-column>
        <el-table-column
          prop="subject.#text"
          label="正文">
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import { getSMS } from '@/api/getData'
import { xmlToJson } from '@/utils/utils'

export default {
  props: {
    logout: Function
  },
  data () {
    return {
      status: Number,
      dom: Object,
      xml: '',
      json: Object,
      smsArrOriginal: []
    }
  },
  async mounted () {
    this.initSMS()
  },
  computed: {
    smsArr: () => {
      console.log('aaa')
      return (this.smsArrOriginal || []).map((item, key, arr) => {
        console.log(item.form['#text'])
      })
    }
  },
  methods: {
    async initSMS () {
      const res = await getSMS()
      console.log(res)
      this.status = res.status
      if (res.status === 200) {
        res.text().then((val) => {
          return (new window.DOMParser()).parseFromString(val, 'text/xml')
        }).then((val) => {
          this.dom = val
          console.log(this.dom)
          this.json = xmlToJson(val)
          console.log(this.json)
          this.smsArrOriginal = this.json.RGW.message.get_message.message_list.Item
          console.log(this.json.RGW.message.get_message.message_list.Item)
        }).catch(function (val) {
          console.log(val)
        })
      }
    }
  },
  watch: {
    dom (val) {
      if (val.getElementsByTagName('RGW').length === 0) {
        this.logout('登录信息过期，请重新登录！')
      }
    },
    status (val) {
      if (val !== 200) {
        this.logout('请检查本机是否和路由器在同一局域网！')
      }
    }
  }
}
</script>

<style>
</style>

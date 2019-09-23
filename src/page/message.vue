<template>
  <div>
    <el-row>
      <el-button type="primary">发送短信</el-button>
    </el-row>
    <br>
    <el-row>
      <el-table
      v-loading="isLoading"
      :data="smsArr"
      border>
        <el-table-column
          prop="received.#text"
          width="145"
          label="日期">
        </el-table-column>
        <el-table-column
          prop="from.#text"
          width="130"
          label="发送号码">
        </el-table-column>
        <el-table-column
          prop="subject.#text"
          label="正文">
        </el-table-column>
      </el-table>
    </el-row>
    <br>
    <el-row class="pagination-wrapper">
      <el-pagination
        background
        hide-on-single-page
        layout="prev, pager, next"
        @current-change="currentChange"
        @prev-click="clickPrev"
        @next-click="clickNext"
        :disabled="isLoading"
        :page-count="pageTotal">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import { getSMS } from '@/api/getData'
import { xmlToJson, decode, formatTime, isObject } from '@/utils/utils'

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
      pageNum: 1,
      pageTotal: 0,
      isLoading: false,
      smsArrOriginal: []
    }
  },
  async mounted () {
    this.initSMS()
  },
  computed: {
    smsArr () {
      let smsArrTmp = this.smsArrOriginal
      if (isObject(smsArrTmp)) {
        smsArrTmp = [smsArrTmp]
      }
      return (smsArrTmp || []).map((item, key, arr) => {
        item.received['#text'] = formatTime(item.received['#text'])
        item.from['#text'] = decode(item.from['#text'])
        item.subject['#text'] = decode(item.subject['#text'])
        return item
      })
    }
  },
  methods: {
    async initSMS (pageNum = 1) {
      this.isLoading = true
      const res = await getSMS(pageNum)
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
          // this.pageNum = Number(this.json.RGW.message.get_message.page_number['#text'])
          this.pageTotal = Number(this.json.RGW.message.get_message.total_number['#text'])
        }).catch(function (val) {
          console.log(val)
        })
      }
      this.isLoading = false
    },
    async currentChange (val) {
      this.initSMS(val)
    },
    async clickPrev (val) {
      this.initSMS(val - 1)
    },
    async clickNext (val) {
      this.initSMS(val + 1)
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
.pagination-wrapper {
  text-align: right;
}
</style>

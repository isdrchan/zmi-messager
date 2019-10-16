<template>
  <div>
    <el-row type="flex" class="row-bg" justify="end">
      <el-button type="primary" icon="el-icon-chat-line-round" @click="sendSMSDialogVisible = true">发送短信</el-button>
      <el-button type="success" icon="el-icon-refresh" :loading="isLoading" @click="refreshSMS">刷新</el-button>
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
        <el-table-column
          fixed="right"
          label="操作"
          width="50">
          <template slot-scope="scope">
            <el-button @click="showDelSMSDialog(scope.row.index['#text'])" type="text" size="small">删除</el-button>
          </template>
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
    <el-dialog title="发送短信"
      :model="sendSMSForm"
      :visible.sync="sendSMSDialogVisible"
      :append-to-body="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false">
      <el-form label-width="50px">
        <el-form-item label="号码">
          <el-input v-model="sendSMSForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="内容" style="margin-bottom: 0;">
          <el-input v-model="sendSMSForm.content" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sendSMSDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="isSending" @click="doSendSMS">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="delSMSDialogVisible"
      :append-to-body="true"
      width="30%">
      <span>确定删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delSMSDialogVisible = false">取 消</el-button>
        <el-button type="danger" :loading="isDeleting" @click="doDelSMS">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getSMS, sendSMS, delSMS } from '@/api/getData'
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
      isSending: false,
      isDeleting: false,
      smsArrOriginal: [],
      delSMSId: '',
      sendSMSDialogVisible: false,
      delSMSDialogVisible: false,
      sendSMSForm: {
        phone: '',
        content: ''
      }
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
      console.log(`[第${pageNum}页短信Response]`)
      console.log(res)
      this.status = res.status
      if (res.status === 200) {
        res.text().then((val) => {
          return (new window.DOMParser()).parseFromString(val, 'text/xml')
        }).then((val) => {
          this.dom = val
          console.log(`[第${pageNum}页短信Dom]`)
          console.log(this.dom)
          this.json = xmlToJson(val)
          console.log(`[第${pageNum}页短信Json]`)
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
    async doSendSMS () {
      this.isSending = true
      const res = await sendSMS(this.sendSMSForm.phone, this.sendSMSForm.content)
      console.log('[发送短信Response]')
      console.log(res)
      this.status = res.status
      if (res.status === 200) {
        res.text().then((val) => {
          return (new window.DOMParser()).parseFromString(val, 'text/xml')
        }).then((val) => {
          this.dom = val
          console.log('[发送短信Dom]')
          console.log(this.dom)
          this.json = xmlToJson(val)
          console.log('[发送短信Json]')
          console.log(this.json)
          const smsSendStatus = this.json.RGW.message.flag.sms_cmd_status_result['#text']
          this.$message({
            type: smsSendStatus === '3' ? 'success' : 'error',
            message: smsSendStatus === '3' ? '发送成功' : '发送失败'
          })
          if (this.sendSMSDialogVisible) {
            this.sendSMSDialogVisible = !this.sendSMSDialogVisible
          }
        }).catch(function (val) {
          console.log(val)
        })
      }
      this.isSending = false
    },
    async doDelSMS () {
      this.isDeleting = true
      const res = await delSMS(this.delSMSId)
      console.log(`[删除短信id:${this.delSMSId}]`)
      console.log('[删除短信Response]')
      console.log(res)
      this.status = res.status
      if (res.status === 200) {
        res.text().then((val) => {
          return (new window.DOMParser()).parseFromString(val, 'text/xml')
        }).then((val) => {
          this.dom = val
          console.log('[删除短信Dom]')
          console.log(this.dom)
          this.json = xmlToJson(val)
          console.log('[删除短信Json]')
          console.log(this.json)
          const smsSendStatus = this.json.RGW.message.flag.sms_cmd_status_result['#text']
          this.$message({
            type: smsSendStatus === '3' ? 'success' : 'error',
            message: smsSendStatus === '3' ? '删除成功' : '删除失败'
          })
          if (this.sendSMSDialogVisible) {
            this.sendSMSDialogVisible = !this.sendSMSDialogVisible
          }
        }).catch(function (val) {
          console.log(val)
        })
      }
      this.isDeleting = false
      this.delSMSDialogVisible = false
      this.initSMS(this.pageNum)
    },
    showDelSMSDialog (id) {
      this.delSMSDialogVisible = true
      this.delSMSId = id
    },
    async refreshSMS () {
      this.initSMS(this.pageNum)
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

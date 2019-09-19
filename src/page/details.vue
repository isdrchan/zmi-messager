<template>
    <pre v-highlightjs="code"><code class="xml hljs"></code></pre>
</template>

<script>
import { getDetails } from '@/api/getData'
import vkbeautify from 'vkbeautify'

export default {
  props: {
    logout: Function
  },
  data () {
    return {
      status: Number,
      dom: Object,
      xml: '',
      code: ''
    }
  },
  async mounted () {
    const res = await getDetails()
    console.log(res)
    this.status = res.status
    if (res.status === 200) {
      res.text().then((val) => {
        return (new window.DOMParser()).parseFromString(val, 'text/xml')
      }).then((val) => {
        this.dom = val
        console.log(this.dom)
        this.xml = val.getElementsByTagName('RGW')[0].innerHTML
        this.code = vkbeautify.xml(this.xml)
      }).catch(function (val) {
        console.log(val)
      })
    }
  },
  watch: {
    dom (val) {
      if (val.getElementsByTagName('RGW').length === 0 || val.getElementsByTagName('RGW')[0].children.length === 1) {
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
.hljs {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  background: #FFFFFF;
}

.hljs,
.hljs-subst {
  color: #434f54;
}

.hljs-keyword,
.hljs-attribute,
.hljs-selector-tag,
.hljs-doctag,
.hljs-name {
  color: #d73737;
  font-weight: bold;
}

.hljs-built_in,
.hljs-literal,
.hljs-bullet,
.hljs-code,
.hljs-addition {
  color: #D35400;
}

.hljs-regexp,
.hljs-symbol,
.hljs-variable,
.hljs-template-variable,
.hljs-link,
.hljs-selector-attr,
.hljs-selector-pseudo {
  color: #00979D;
}

.hljs-type,
.hljs-string,
.hljs-selector-id,
.hljs-selector-class,
.hljs-quote,
.hljs-template-tag,
.hljs-deletion {
  color: #005C5F;
}

.hljs-title,
.hljs-section {
  color: #880000;
  font-weight: bold;
}

.hljs-comment {
  color: rgba(149,165,166,.8);
}

.hljs-meta-keyword {
  color: #728E00;
}

.hljs-meta {
  color: #728E00;
  color: #434f54;
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: bold;
}

.hljs-function {
  color: #728E00;
}

.hljs-number {
  color: #8A7B52;
}
</style>

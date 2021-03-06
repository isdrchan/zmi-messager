# zmi-messager / ZMI（紫米）随身路由器网页版短信管理工具

#### 简介

一款ZMI（紫米）随身路由器网页版短信管理工具，支持短信分页查看、短信发送、单条短信删除、设备详细信息。由于平时经常需要用到收发短信的功能，苦于ZMI路由器Web管理页面没有直接提供短信管理模块（不知什么原因被隐藏了），并且Android版随身路由器APP响应慢，常驻后台耗电等问题，遂分析了一下通讯协议，做了一个易用的网页版短信管理工具。

#### 兼容
- [x] MF855

#### 原料
- Vue2
- Element UI

#### 用法
1. 在项目根目录下的 **setting.json** 文件中配置属性 **gatewayip** 的值为路由器的网关IP
2. install
    ```
    npm install
    ```
3. run
    ```
    npm run dev
    ```

#### 截图
- 登录

![登录](https://raw.githubusercontent.com/isdrchan/zmi-messager/master/screenshot/1.png)

- 设备详情

![设备详情](https://raw.githubusercontent.com/isdrchan/zmi-messager/master/screenshot/2.png)

- 短信管理

![短信管理](https://raw.githubusercontent.com/isdrchan/zmi-messager/master/screenshot/3.png)
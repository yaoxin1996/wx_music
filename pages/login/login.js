// pages/login/login.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: '',
        password: ''
    },
    //  输入框
    handleInput (e) {
        console.log(e);
        let type = e.currentTarget.id
        this.setData({
            [type]: e.detail.value
        })
    },
    // 登录按钮
    async login () {
        let { phone, password } = this.data
        if (!phone.trim()) {
            wx.showToast({
              title: '手机号不能为空',
              icon: 'error'
            })
            return
        }
        // 判断是否为正确格式
        let phoneReg = /^1[3-9]\d{9}$/
        if (!phoneReg.test(phone)) {
            wx.showToast({
              title: '手机号格式不正确',
              icon: 'none'
            })
            return
        }
        if (!password.trim()) {
            this.setData({
                password: ''
            })
            wx.showToast({
              title: '密码不能为空',
              icon: 'none'
            })
            return
        }
    

        // 后端验证
        let res = await request('/login/cellphone', {phone, password, isLogin: true})
        if (res.code == 200) {
            wx.showToast({
              title: '登录成功',
            })
            wx.setStorageSync('userInfo', JSON.stringify(res.profile))

            wx.reLaunch({
              url: '/pages/personal/personal'
            })
            return
        } else if (res.code == 400) { // 手机号错误
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
            return
        } else if (res.code == 502) { // 密码错误
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
        } else {
            wx.showToast({
              title: '登录失败，请重试'
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
// pages/personal/personal.js
import request from '../../utils/request'
let pageY = ''
let transtion = ''
Page({
    /**
     * 页面的初始数据
     */
    data: {
        coverTransform: `translateY(0)`,
        coveTransition: ``,
        userInfo: {},
        recentPlayList: []
    },
    // 
    handleTouchStart (e) {
        this.setData({
            coveTransition: ``
        })
        pageY = e.touches[0].pageY
    },
    handleTouchMove (e) {
        let move = e.touches[0].pageY
        transtion = move - pageY
        console.log(transtion);
        if (transtion <= 0) {
            return
        }
        if (transtion >= 80) {
            transtion = 80
        }
        this.setData({
            coverTransform: `translateY(${transtion}rpx)`
        })
    },
    handleTouchEnd (e) {
        this.setData({
            coverTransform: `translateY(0)rpx`,
            coveTransition: `transform linear 1s`
        })
    },
    toLogin () {
        wx.navigateTo({
          url: '/pages/login/login'
        })
        return
    },
    // 退出登录
    quit () {
        wx.showModal({
            title: '确认退出？',
            confirmColor: '#d43c33',
            success: (res) => {
                if (res.confirm) {
                    wx.clearStorageSync()
                    this.setData({
                        userInfo: {},
                        recentPlayList: []
                    })
                }
            }
        })
    },
    // 获取播放记录
    async getRecord () {
        let res = await request('/user/record', {uid: this.data.userInfo.userId, type: 1})
        let recentPlayList = res.weekData.map((item, index) => {
            item.id = index + 1
            return item
        })
        this.setData({
            recentPlayList
        })
    },
    // 获取用户openID
    getOpenId () {
        // 获取登录凭证
        wx.login({
          success: async (res) => {
              console.log(res);
              let code = res.code
              let result = await request('/getOpenId', {code: code})
              console.log(result);
          }
        })
        // 发送给服务器
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取缓存中的数据
        let userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
            this.setData({
                userInfo: JSON.parse(userInfo)
            })
            this.getRecord()
        }

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
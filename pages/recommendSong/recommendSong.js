// pages/recommendSong/recommendSong.js
import PubSub from 'pubsub-js'
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day: '',
        month: '',
        dayList: [],
        index: ''
    },
    // 获取每日推荐列表
    async getList () {
        let res = await request('/recommend/songs')
        this.setData({
            dayList: res.recommend
        })
    },
    // 去详情播放
    gotoDetail (e) {
        const { id, index } = e.currentTarget.dataset
        this.setData({
            index
        })
        wx.navigateTo({
          url: `/pages/songDetail/songDetail?Id=${id}`,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            day: new Date().getDate() > 9 ? new Date().getDate() : '0' + new Date().getDate(),
            month: new Date().getMonth() + 1
        })
        let userInfo = wx.getStorageSync('userInfo')
        if (!userInfo) {
            wx.showToast({
              title: '请先登录',
              icon: 'none',
              success: () => {
                wx.reLaunch({
                  url: '/pages/login/login',
                })
              }
            })
        }
        this.getList()
        // 订阅来自songDetail页面发布的消息
        PubSub.subscribe('switchType', (msg, data) => {
            let { index, dayList } = this.data
            if (data == 'pre') {
                // 上一首
                (index == 0) && (index = dayList.length)
                index -= 1
            } else {
                // 下一首
                (index == dayList.length - 1) && (index = -1)
                index += 1
            }
            this.setData({
                index
            })
            let musicId = dayList[index].id
            // 把Id回传给songDetail
            PubSub.publish('switchId', musicId)
        })
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
// pages/index/index.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
      bannerList: [],
      recommendList: [],
      topList: []
    },
    // 获取轮播图
    async getBannerList () {
      let res = await request('/banner', {type: 2})
      this.setData({
        bannerList: res.banners
      })
    },
    // 获取推荐歌单
    async getRecommendList () {
      let res = await request('/personalized', {limit: 10})
      this.setData({
        recommendList: res.result
      })
    },
    // 获取排行榜
    async getRankList () {
      // 取 前5条数据
      let index = 0
      let arr = []
      while (index < 5) {
        let res = await request('/top/list', {idx: index++})
        // 取前3首歌
        let item = {id: res.playlist.id, name: res.playlist.name, track: res.playlist.tracks.slice(0, 3)}
        arr.push(item)
        // 不需要等待5次请求都结束再更新，但是渲染次数相对较多
        this.setData({
          topList: arr
        })
      }
      // 发送请求过程中页面长时间白屏，用户体验差
      // this.setData({
      //   topList: arr
      // })
    },
    // 每日推荐
    gotoRecommend () {
      wx.navigateTo({
        url: '/pages/recommendSong/recommendSong'
      })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.getBannerList()
      this.getRecommendList()
      this.getRankList()
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
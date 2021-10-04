// pages/search/search.js
let isSend = false
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        keyWord: '',
        hotList: [],
        inputWords: '',
        searchList: [],
        historyList: []
    },
    // 默认搜索关键字
    async getSearchKey () {
        let res = await request('/search/default')
        this.setData({
            keyWord: res.data.showKeyword
        })
    },
    // 热搜榜
    async getHotList () {
        let res = await request('/search/hot/detail')
        this.setData({
            hotList: res.data
        })
    },
    // 表单项内容改变事件
    inputKeyWord (e) { 
        let keyword = e.detail.value.trim()
        this.setData({
            inputWords: keyword
        })
        if (isSend) {
            return
        }
        isSend = true
        this.getSearch(keyword)
        // 函数节流
        setTimeout(() => {
            isSend = false
        }, 300)
    },
    // 取消搜索
    cancel () {
        this.setData({
            searchList: this.data.searchList.length = 0
        })
    },
    // 获取本地存储中的历史
    getHistory () {
        let historyList = wx.getStorageSync('historyList')
        console.log(historyList);
        if (historyList) {
            this.setData({
                historyList
            })
        }
    },
    // 清空搜索内容
    clearSearch () {
        console.log(1212);
        this.setData({
            inputWords: '',
            searchList: []
        })
    },
    // 搜索数据
    async getSearch (keywords) {
        if (keywords) {
            let res = await request('/search', {keywords})
            this.setData({
                searchList: res.result.songs
            })
            // historyList
            let { historyList } = this.data
            console.log(historyList.indexOf(keywords));
            let index = historyList.indexOf(keywords)
            if (index !== -1) {
                historyList.splice(index, 1)
            }
            historyList.unshift(keywords)
            this.setData({
                historyList
            })
            wx.setStorageSync('historyList', historyList)
        } else {
            this.setData({
                searchList: []
            })
        }
    },
    // 清空历史记录
    delHistory () {
        wx.showModal({
            content: '确认删除历史记录？',
            success: (res) => {
                if (res.confirm) {
                    this.setData({
                        historyList: []
                    })
                    wx.removeStorageSync('historyList')
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getSearchKey()
        this.getHotList()
        this.getHistory()
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
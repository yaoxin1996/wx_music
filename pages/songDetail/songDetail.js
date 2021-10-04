// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../utils/request'
let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false,
        song: {},
        musicLink: '',
        currentTime: '00:00',
        durationTime: '00:00',
        currentWidth: 0
    },
    // 点击播放/暂停音乐 回调
    musicPlay () {
        let isPlay = !this.data.isPlay
        let Id = this.data.song.id
        let musicLink = this.data.musicLink
        // this.setData({
        //     isPlay: !this.data.isPlay
        // })
        this.musicControl(isPlay, Id, musicLink)
    },
    
    
    // 点击播放/暂停音乐 功能
    async musicControl (isPlay, Id, musicLink) {
        if (isPlay) {
            if (!musicLink) {
                // 播放
                let res = await request('/song/url', {id: Id})
                musicLink = res.data[0].url
                this.setData({
                    musicLink
                })
            }
            this.bgMusic.src = musicLink
            this.bgMusic.title = this.data.song.name
        } else {
            // 暂停
            this.bgMusic.pause()
        }
    },
    // 获取音乐详情
    async getSongDetail (Id) {
        let res = await request('/song/detail', { ids: Id })
        let durationTime = moment(res.songs[0].dt).format('mm:ss')
        this.setData({
            song: res.songs[0],
            durationTime
        })
        wx.setNavigationBarTitle({
          title: res.songs[0].name,
        })
    },
    // 修改播放状态
    changePlayState (isPlay) {
        this.setData({
            isPlay
        })
        app.appData.isMusicPlay = isPlay
    },
    // 上一首/下一首切换
    handleSwitch (e) {
        let type = e.currentTarget.id
        this.bgMusic.stop()
        // 接收上个页面传递回来的ID
        PubSub.subscribe('switchId', (msg, Id) => {
            this.getSongDetail(Id)
            // 自动播放
            this.musicControl(true, Id)
            // 取消订阅
            PubSub.unsubscribe('switchId')
        })
        // 发布
        PubSub.publish('switchType', type)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getSongDetail(options.Id)
        // 判断当前页面是否在播放
        if (app.appData.isMusicPlay && app.appData.musicId == options.Id) {
            this.setData({
                isPlay: true
            })
        }
        // 创建控制音乐播放的实例
        this.bgMusic = wx.getBackgroundAudioManager()
        this.bgMusic.onPlay(() => {
           this.changePlayState(true)
           app.appData.musicId = this.data.song.id
        })
        this.bgMusic.onPause(() => {
            this.changePlayState(false)
        })
        this.bgMusic.onStop(() => {
            this.changePlayState(false)
        })
        // 监听音乐播放自然结束
        this.bgMusic.onEnded(() => {
            // 自动播放下一首 
            PubSub.publish('switchType', 'next')
            this.bgMusic.stop()
            // 接收上个页面传递回来的ID
            PubSub.subscribe('switchId', (msg, Id) => {
                this.getSongDetail(Id)
                // 自动播放
                this.musicControl(true, Id)
                // 取消订阅
                PubSub.unsubscribe('switchId')
            })
            // 进度条长度设为0
            this.setData({
                currentWidth: 0,
                currentTime: '00:00'
            })
        })
        
        // 监听音乐播放进度
        this.bgMusic.onTimeUpdate(() => {
             let currentTime = moment(this.bgMusic.currentTime * 1000).format('mm:ss')
             let currentWidth = this.bgMusic.currentTime / this.bgMusic.duration * 450
             this.setData({
                 currentTime,
                 currentWidth
             })
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
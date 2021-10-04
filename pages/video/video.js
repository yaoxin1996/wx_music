// pages/video/video.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navList: [],
        id: '',
        videoList: [],
        v_height: '',
        videoId: '',
        timeList: [],
        isTrigger: false
    },
    // 获取视频标签列表
    async getGroupList () {
        let res = await request('/video/group/list')
        this.setData({
            navList: res.data.slice(0, 20),
            id: res.data.slice(0, 20)[0].id
        })
        this.getVideo(this.data.id)
    },
    clickNav (e) {
        console.log(e);
        // >>> 右移 | <<< 左移 先将目标数据转为二进制，在移动指定位数
        // let num = 3  console.log(num >>> 2)  0
        // 3的二进制              0000 0001
        // 右移2位，其余用0补齐    000000 00
        // 右移0位会将非number数据强制转化为number
        let id = e.currentTarget.dataset.id
        this.setData({
            id
        })
        this.getVideo(id)
    },
    // 获取标签下的视频数据
    async getVideo (id) {
        if (!id) {
            return
        }
        this.setData({
            videoList: []
        })
        let res = await request('/video/group', {id})
        let videoList = res.datas
        videoList.forEach ((item, index) => {
            item.id = index+1
            return item
        })
        this.setData({
            videoList: res.datas,
            isTrigger: false
        })
    },
    // 视频播放事件
    handlePlay (e) {
        let vid = e.currentTarget.id
        // 点击当前视频时  将上一个视频暂停
        // 第一次进来时 this.context 没有值
        // 第二次点击时 this.context 的值是上一次点击播放的视频 此时调用stop() 暂停
        // 需要判断vid 是否和上一次点击视频的vid相同
        // 如果不是同一个 就暂停上一个  如果是同一个 就播放
        this.vid != vid && this.context && this.context.stop()
        this.vid = vid
        // 获取视频对象 赋值 
        this.context = wx.createVideoContext(vid)

        // 判断当前视频是否播放过 播放过直接跳转上次播放位置
        let item = this.data.timeList.find(item => item.vid == vid)
        if (item) {
            this.context.seek(item.time)
        }
    },
    // 图片点击事件
    bindPlay (e) {
        this.setData({
            videoId: e.currentTarget.id
        })
    },
    // 视频播放进度变化事件
    handleUpdate (e) {
        let obj = {time: e.detail.currentTime, vid: e.target.id}
        // // 找当前数组中有没有 要存的这个vid 
        // // 如果有就改变time值 没有就添加
        // //  find 方法 有返回符合条件的项 没有 返回undefined
        let item = this.data.timeList.find(item => item.vid == obj.vid)
        if (item) {
            item.time = obj.time
        } else {
            this.data.timeList.push(obj)
        }
        this.setData({
            timeList: this.data.timeList
        })
    },
    // 播放结束
    handleEnd (e) {
        console.log(e);
        let vid = e.currentTarget.id
        let idx = this.data.timeList.findIndex(item => item.vid == vid)
        console.log(idx);
        // 播放完 从timeList中移除
        this.data.timeList.splice(idx, 1)
        this.setData({
            timeList: this.data.timeList
        })
    },
    // 下拉刷新
    handleRefresh () {
        this.getVideo(this.data.id)
    },
    // 上拉加载
    handleToLower () {
        console.log('上拉加载');
    },
    // 跳转至搜索页面
    goToSearch () {
        wx.navigateTo({
          url: '/pages/search/search',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getGroupList()
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
        // var query = wx.createSelectorQuery()
        // query.select('.video').boundingClientRect()
        // query.select('.nav_scroll').boundingClientRect()
        // query.select('.header').boundingClientRect()
        // query.exec((res) => {
        //     console.log(res);
        //     this.setData({
        //         v_height: (res[0].height - res[1].height - res[2].height) * 2
        //     })
            
        // })
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
    onShareAppMessage: function ({from}) {
        console.log(from);
        if (from == 'menu') {
            return {
                title: '通过menu转发',
                path: 'pages/video/video',
                imageUrl: '../../static/images/personal/bgImg.jpg'
            }
        } else {
            return {
                title: '通过button转发',
                path: 'pages/video/video',
                imageUrl: '../../static/images/personal/bgImg2.jpg'
            }
        }
    }
})
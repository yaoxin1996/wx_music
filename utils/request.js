import config from './config'
// 发送ajax请求
/* 1. 封装功能函数 */
export default (path, data = {}, method = "GET") => {
    // 初始化promise
    return new Promise((resolve, reject) => {
        wx.showLoading({
            title: '正在加载'
        })
        wx.request({
            url: config.host + path,
            data,
            method,
            header: {
                cookie: wx.getStorageSync('cookies').length > 0 ?  wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') != -1) : ''
            },
            success: (res) => {
                if (data.isLogin) {
                    wx.setStorage({
                        key: 'cookies',
                        data: res.cookies
                    })
                }
                wx.hideLoading()
                // 修改promise的状态为成功状态resolved
                resolve(res.data)
            },
            fail: (err) => {
                // 修改promise的状态为失败状态reject
                reject(err)
            }
        })
    })
}

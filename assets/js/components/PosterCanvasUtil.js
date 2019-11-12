import ConfigUtil from '../ConfigUtil';
import TipUtil from '../TipUtil';
import PathUtil from '../PathUtil';
import DownloadUtil from '../DownloadUtil';
import CommonUtil from '../CommonUtil';
import CreateUtil from './poster/CreateUtil';
import MusicUtil from './poster/MusicUtil';
import StudyUtil from './poster/StudyUtil';
import FreestyleUtil from './poster/FreestyleUtil';

let PosterCanvasUtil = {
  // type：beat music video article freestyle
  draw(_this, data, type = 'beat') {
    let posterId = 'poster-canvas';

    if (type == 'freestyle') {
      posterId = 'freestyle-poster-canvas';
    }

    let context = wx.createCanvasContext(posterId),
    id = data.id,
    paramMap = {
      // nothing=1为了构建场景值
      beat: 'path=pages/create/beatList/index&nothing=1',
      music: `path=pages/study/studyList/index&type=music&id=${id}`
    },
    param;

    if (type == 'video') {
      param = 'path=pages/study/studyList/index&t=video&id=' + data.groupId;

      if (data.sectionId) {
        param += '&sId=' + data.sectionId;
      }
    } else if (type == 'article') {
      param = 'path=pages/study/studyList/index&t=article&id=' + id;
    } else if (type == 'freestyle') {
      param = 'path=pages/freestyle/index/index&id=' + id + '&userId=' + data.user.id;
    } else {
      param = paramMap[type];
    }

    // 首先下载二维码
    wx.downloadFile({
      url: PathUtil.getPath('utils/qrcode-unlimited') + '?' + param,
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: (res) => {
        let qrCodePath = res.tempFilePath;

        if (['freestyle'].indexOf(type) != -1) {
          context.setFillStyle('#fff');
          context.fillRect(0, 0, 750, 1334);
          FreestyleUtil.draw(context, data, qrCodePath);
        } else {
          context.setFillStyle('#fff');
          context.fillRect(0, 0, 610, 661);

          if (['beat'].indexOf(type) != -1) {
            CreateUtil.draw(context, data, type, '/assets/imgs/logo.png', qrCodePath);
          } else if (['music'].indexOf(type) != -1) {
            MusicUtil.draw(context, posterId, data, qrCodePath);
          } else if (['article', 'video'].indexOf(type) != -1) {
            StudyUtil.draw(context, data, type, qrCodePath);
          }
        }

        context.draw(false, (res) => {
          wx.canvasToTempFilePath({
            canvasId: posterId,
            fileType: 'jpg',
            quality: 0.92,
            success: (res) => {
              let path = res.tempFilePath;

              // _this.setData({
              //   posterUrl: url
              // });

              // 下载海报
              DownloadUtil.authorize(path, () => {
                // 下载海报到本地后，再显示
                _this.setData({
                  posterUrl: path
                });
              });

              // 获取到本地图片路径后，需要先上传服务器转换为网络图片才能download成功
              // PosterCanvasUtil.uploadToOss(path, (url) => {
              //   // 下载海报
              //   DownloadUtil.authorize(url, () => {
              //     // 下载海报到本地后，再显示
              //     _this.setData({
              //       posterUrl: url
              //     });
              //   });
              // });
            },
            fail(res) {
              // console.log(res)
              TipUtil.message('服务器繁忙，请稍后重试');
            },
            complete: (res) => {
              if (ConfigUtil.isDev()) {
                // console.log(res);
                // TipUtil.message(JSON.stringify(res), 10000);
              }
            }
          });
        });
      },
      fail: (res) => {
        // console.log(res);
        TipUtil.message('服务器繁忙，请稍后重试');
      },
      complete: (res) => {
        if (ConfigUtil.isDev()) {
          // console.log(res);
          // TipUtil.message(JSON.stringify(res), 10000);
        }
      }
    });
  },
  uploadToOss(path, callback) {
    CommonUtil.getPolicyParam((data) => {
      let key = data.getKey('poster', path),
      host = data.host;

      // 上传
      wx.uploadFile({
        url: host,
        // 本地文件路径
        filePath: path,
        name: 'file',
        formData: {
          OSSAccessKeyId: data.OSSAccessKeyId,
          policy: data.policy,
          signature: data.signature,
          key,
          success_action_status: '200'
        },
        success: (res) => {
          callback(host + '/' + key);
        },
        fail: (res) => {
          if (ConfigUtil.isDev()) {
            return;
            // console.log(res);
            TipUtil.message(JSON.stringify(res), 10000);
          } else if (ConfigUtil.isProd()) {
            TipUtil.message('服务器繁忙，请稍后重试');
          }
        }
      });
    });
  }
};

export default PosterCanvasUtil;
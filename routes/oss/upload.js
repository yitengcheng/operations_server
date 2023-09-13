/**
 * 上传文件
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const koaBody = require('koa-body');
const path = require('path');
const qiniu = require('qiniu');
const fs = require('fs');

const fileUpload = (file) => {
  return new Promise((resolve, reject) => {
    let accessKey = 'AdYOTLCiyOcuiD4Iv5-heua4OWG-EOKaCvObb4SO';
    let secretKey = 'g9tQu5UiGnGr6o8p9lAyViKGgNLvwhhfo0rxwbB9';
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    let putPolicy = new qiniu.rs.PutPolicy({ scope: 'cdxsnew1' });
    let uploadToken = putPolicy.uploadToken(mac);
    let config = new qiniu.conf.Config();
    // 空间对应的机房
    config.zone = qiniu.zone.Zone_z2;
    let formUploader = new qiniu.form_up.FormUploader(config);
    let putExtra = new qiniu.form_up.PutExtra();
    formUploader.putFile(uploadToken, file.name, file.path, putExtra, (respErr, respBody, respInfo) => {
      if (respErr) {
        reject(respErr);
      }
      if (respInfo.statusCode == 200) {
        resolve(respBody.key);
      } else {
        reject(respBody);
      }
    });
  });
};

router.post(
  '/oss/upload',
  koaBody({
    // 支持文件格式
    multipart: true,
    formidable: {
      // 上传目录
      uploadDir: path.join(__dirname, '../../public/upload'),
      // 保留文件扩展名
      keepExtensions: true,
      maxFileSize: 52428800,
    },
  }),
  async (ctx) => {
    try {
      const { file } = ctx.request.files;
      // const url = await fileUpload(file);
      // fs.unlinkSync(file.path);
      let fileExtension = file.path.substring(file.path.lastIndexOf('/'));
      ctx.body = util.success({ url: fileExtension });
    } catch (error) {
      ctx.body = util.fail(error.stack);
    }
  },
);

module.exports = router;

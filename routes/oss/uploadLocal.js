/**
 * 上传文件
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const koaBody = require('koa-body');
const path = require('path');

router.post(
  '/oss/uploadLocal',
  koaBody({
    // 支持文件格式
    multipart: true,
    formidable: {
      // 上传目录
      uploadDir: path.join(__dirname, '../../public/uploadLocal'),
      // 保留文件扩展名
      keepExtensions: true,
      maxFileSize: 52428800,
    },
  }),
  async (ctx) => {
    try {
      ctx.body = util.success({ success: true });
    } catch (error) {
      console.log('----', error);
    }
  },
);

module.exports = router;

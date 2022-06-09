/**
 * 上传文件
 */
const router = require("koa-router")();
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const koaBody = require("koa-body");
const path = require("path");
const qiniu = require("qiniu");
const fs = require("fs");

router.post(
  "/oss/uploadLocal",
  koaBody({
    // 支持文件格式
    multipart: true,
    formidable: {
      // 上传目录
      uploadDir: path.join(__dirname, "../../public/uploadLocal"),
      // 保留文件扩展名
      keepExtensions: true,
      maxFileSize: 52428800,
    },
  }),
  async (ctx) => {
    try {
      const file = ctx.request.files.file;
      ctx.body = util.success({ success: true });
    } catch (error) {
      console.log("----", error);
    }
  }
);

module.exports = router;

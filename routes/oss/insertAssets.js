/**
 * 批量录入资产
 */
const router = require("koa-router")();
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const koaBody = require("koa-body");
const path = require("path");
const qiniu = require("qiniu");
const fs = require("fs");
const xlsx = require("xlsx");
const _ = require("lodash");
const CompanyTemplate = require("../../models/companyTemplateSchema");
const { default: mongoose } = require("mongoose");
const config = require("../../config");

router.post(
  "/upload/insertAsstes",
  koaBody({
    // 支持文件格式
    multipart: true,
    formidable: {
      // 上传目录
      uploadDir: path.join(__dirname, "../../public/upload"),
      // 保留文件扩展名
      keepExtensions: true,
      maxFileSize: 52428800,
    },
  }),
  async (ctx) => {
    try {
      const file = ctx.request.files.file;
      const { user } = ctx.state;
      const companyTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: "1" });
      if (!companyTemplate) {
        ctx.body = util.fail("", "请先设置公司资产模板");
        return;
      }
      let schema = await util.schemaProperty(companyTemplate.content);
      const db = mongoose.createConnection(config.URL);
      let assetsModule = db.model(companyTemplate.moduleName, schema, companyTemplate.moduleName);
      const workbook = xlsx.readFile(file.path);
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      const res = await assetsModule.insertMany(data);
      fs.unlinkSync(file.path);
      ctx.body = util.success({}, `成功插入${res.length}条`);
    } catch (error) {
      ctx.body = util.fail(error.stack);
    }
  }
);

module.exports = router;

/**
 * 故障列表接口
 */
const router = require("koa-router")();
const CompanyTemplate = require("../../models/companyTemplateSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const mongoose = require("mongoose");
const config = require("../../config");

router.post("/fault/list", async (ctx) => {
  try {
    const { type } = ctx.request.body; // 1 由我创建的工单 2 待我处理 3 抄送我的 4 已处理工单 5 工单总列表 6 待处理总列表 7 已处理完成总列表
    const { page, skipIndex } = util.pager(ctx.request.body);
    const { user } = ctx.state;
    const companyTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: "2" });
    if (!companyTemplate) {
      ctx.body = util.fail("", "请先设置公司故障模板");
      return;
    }
    let schema = await util.guzhangSchemaProperty(companyTemplate.content);
    const db = mongoose.createConnection(config.URL);
    let faultModule = db.model(companyTemplate.moduleName, schema, companyTemplate.moduleName);
    let params;
    if (type == 1) {
      // 由我创建的工单
      params = { reportUser: new mongoose.Types.ObjectId(user._id) };
    } else if (type == 2) {
      // 待我处理
      params = { dispose: new mongoose.Types.ObjectId(user._id), status: 1 };
    } else if (type == 3) {
      // 抄送我的
      params = { cc: new mongoose.Types.ObjectId(user._id) };
    } else if (type == 4) {
      // 已处理工单
      params = { dispose: new mongoose.Types.ObjectId(user._id), status: { $gt: 1 } };
    } else if (type == 5) {
      // 工单总列表
      params = {};
    } else if (type == 6) {
      // 待处理总列表
      params = { status: 1 };
    } else if (type == 7) {
      // 已处理完成总列表
      params = { status: 2 };
    }
    const list = await faultModule.find(params).skip(skipIndex).limit(page.pageSize);
    const total = await faultModule.countDocuments(params);
    ctx.body = util.success({ total, list });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;

/**
 * 获取属于我的故障工单统计
 */
const router = require("koa-router")();
const CompanyTemplate = require("../../models/companyTemplateSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const mongoose = require("mongoose");
const config = require("../../config");
const dayjs = require("dayjs");

router.post("/fault/myreport", async (ctx) => {
  try {
    const { user } = ctx.state;
    const companyTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: "2" });
    if (!companyTemplate) {
      ctx.body = util.success({ cc: 0, create: 0, handle: 0 });
      return;
    }
    let schema = await util.guzhangSchemaProperty(companyTemplate.content);
    const db = mongoose.createConnection(config.URL);
    let faultModule = db.model(companyTemplate.moduleName, schema, companyTemplate.moduleName);
    const cc = await faultModule.countDocuments({ cc: user._id, status: 1 });
    const create = await faultModule.countDocuments({ reportUser: user._id, status: 1 });
    const handle = await faultModule.countDocuments({ dispose: user._id, status: 1 });
    ctx.body = util.success({ cc, create, handle });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;

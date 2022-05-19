/**
 * 故障统计接口
 */
const router = require("koa-router")();
const CompanyTemplate = require("../../models/companyTemplateSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const mongoose = require("mongoose");
const config = require("../../config");
const _ = require("lodash");

router.post("/statistical/total/fault", async (ctx) => {
  try {
    const { user } = ctx.state; // type 1 待处理 2 处理成功 3 拒绝处理
    const { type } = ctx.request.body;
    const faultTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: "2" });
    let faultSchema = await util.guzhangSchemaProperty(faultTemplate.content);
    let faultFields = await util.schemaProperty(faultTemplate.content);
    const db = mongoose.createConnection(config.URL);
    let faultModule = db.model(faultTemplate.moduleName, faultSchema, faultTemplate.moduleName);
    const params = typeof type === "undefined" ? {} : { status: type };
    const data = await faultModule.find(params);
    const fields = _.keys(faultFields);
    ctx.body = util.success({ data, fields });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;

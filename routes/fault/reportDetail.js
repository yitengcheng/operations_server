/**
 * 故障详情接口
 */
const router = require("koa-router")();
const CompanyTemplate = require("../../models/companyTemplateSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const mongoose = require("mongoose");
const config = require("../../config");
const dayjs = require("dayjs");
const { CODE } = require("../../utils/util");

router.post("/fault/detail", async (ctx) => {
  try {
    const { faultId } = ctx.request.body;
    const { user } = ctx.state;
    if (!faultId) {
      ctx.body = util.fail("", "缺少工单id", CODE.PARAM_ERROR);
      return;
    }
    const faultTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: "2" });
    const assetTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: "1" });
    if (!faultTemplate) {
      ctx.body = util.fail("", "请先设置公司故障模板");
      return;
    }
    if (!assetTemplate) {
      ctx.body = util.fail("", "请先设置公司资产模板");
      return;
    }
    let guzhangSchema = await util.guzhangSchemaProperty(faultTemplate.content);
    let assetSchema = await util.schemaProperty(assetTemplate.content);
    const db = mongoose.createConnection(config.URL);
    let faultModule = db.model(faultTemplate.moduleName, guzhangSchema, faultTemplate.moduleName);
    let assetModule = db.model(assetTemplate.moduleName, assetSchema, assetTemplate.moduleName);
    const fault = await faultModule.findById(faultId);
    const asset = await assetModule.findById(fault.assetsId);
    ctx.body = util.success({ fault, asset });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;

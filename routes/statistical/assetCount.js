/**
 * 资产总数接口
 */
const router = require("koa-router")();
const CompanyTemplate = require("../../models/companyTemplateSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const mongoose = require("mongoose");
const config = require("../../config");

router.post("/assets/count", async (ctx) => {
  try {
    const { user } = ctx.state;
    const companyTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: "1" });
    if (!companyTemplate) {
      ctx.body = util.fail("", "请先设置公司资产模板");
      return;
    }
    let schema = await util.schemaProperty(companyTemplate.content);
    const db = mongoose.createConnection(config.URL);
    let assetsModule = db.model(companyTemplate.moduleName, schema, companyTemplate.moduleName);
    const total = await assetsModule.countDocuments();
    ctx.body = util.success({ assetTotal: total });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;

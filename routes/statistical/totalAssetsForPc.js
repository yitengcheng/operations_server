/**
 * 资产统计接口
 */
const router = require("koa-router")();
const CompanyTemplate = require("../../models/companyTemplateSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const mongoose = require("mongoose");
const config = require("../../config");
const _ = require("lodash");

router.post("/statistical/total/assets", async (ctx) => {
  try {
    const { user } = ctx.state;
    const assetsTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: "1" });
    let assetsSchema = await util.schemaProperty(assetsTemplate.content);
    const db = mongoose.createConnection(config.URL);
    let assetsModule = db.model(assetsTemplate.moduleName, assetsSchema, assetsTemplate.moduleName);
    const data = await assetsModule.find();
    const fields = _.keys(assetsSchema);
    ctx.body = util.success({ data, fields });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;

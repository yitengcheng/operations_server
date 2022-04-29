/**
 * 资产列表接口
 */
const router = require("koa-router")();
const CompanyTemplate = require("../../models/companyTemplateSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const mongoose = require("mongoose");
const config = require("../../config");

router.post("/assets/list", async (ctx) => {
  try {
    const { keyword } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    const { user } = ctx.state;
    const companyTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: "1" });
    if (!companyTemplate) {
      ctx.body = util.fail("", "请先设置公司资产模板");
      return;
    }
    let schema = await util.schemaProperty(companyTemplate.content);
    let select = await util.schemaSelect(companyTemplate.content);
    const db = mongoose.createConnection(config.URL);
    let assetsModule = db.model(companyTemplate.moduleName, schema, companyTemplate.moduleName);
    const fuzzyQuery = util.fuzzyQuery(Object.keys(schema), keyword);
    const list = await assetsModule
      .find({ ...fuzzyQuery }, select)
      .skip(skipIndex)
      .limit(page.pageSize);
    const total = await assetsModule.countDocuments({ ...fuzzyQuery });
    ctx.body = util.success({ total, list });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;

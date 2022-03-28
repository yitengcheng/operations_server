/**
 * 删除资产接口
 */
const router = require("koa-router")();
const CompanyTemplate = require("../../models/companyTemplateSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const mongoose = require("mongoose");
const config = require("../../config");

router.post("/assets/del", async (ctx) => {
  try {
    const { id } = ctx.request.body;
    const { user } = ctx.state;
    const companyTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: "1" });
    if (!companyTemplate) {
      ctx.body = util.fail("", "请先设置公司资产模板");
      return;
    }
    let schema = await util.schemaProperty(companyTemplate.content);
    const db = mongoose.createConnection(config.URL);
    let assetsModule = db.model(companyTemplate.moduleName, schema, companyTemplate.moduleName);
    const res = await assetsModule.remove({ _id: id });
    if (res.deletedCount > 0) {
      ctx.body = util.success({}, "删除成功");
    } else {
      ctx.body = util.fail("", "删除失败");
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;

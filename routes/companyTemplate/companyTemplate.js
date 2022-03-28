/**
 * 公司模板信息接口
 */
const router = require("koa-router")();
const CompanyTemplate = require("../../models/companyTemplateSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");

router.post("/template", async (ctx) => {
  try {
    const { type } = ctx.request.body;
    const { user } = ctx.state;
    const res = await CompanyTemplate.findOne({ companyId: user.companyId, type });
    ctx.body = util.success(res ?? {});
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;

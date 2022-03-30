/**
 * 小程序获取公司故障模板信息接口
 */
const router = require("koa-router")();
const CompanyTemplate = require("../../models/companyTemplateSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const { default: mongoose } = require("mongoose");

router.post("/applet/template", async (ctx) => {
  try {
    const { companyId = "" } = ctx.request.body;
    const res = await CompanyTemplate.findOne({ companyId: new mongoose.Types.ObjectId(companyId), type: "2" });
    ctx.body = util.success(res ?? {});
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;

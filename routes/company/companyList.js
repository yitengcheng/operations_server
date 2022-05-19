/**
 * 获取公司列表（分页）
 */
const router = require("koa-router")();
const Company = require("../../models/companySchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");

router.post("/company/list", async (ctx) => {
  try {
    const { keyword } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    const fuzzyQuery = util.fuzzyQuery(["companyName", "legalPersonName", "contactPhone"], keyword);
    const list = await Company.find({ ...fuzzyQuery })
      .skip(skipIndex)
      .limit(page.pageSize);
    const total = await Company.countDocuments({ ...fuzzyQuery });
    ctx.body = util.success({ total, list });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;

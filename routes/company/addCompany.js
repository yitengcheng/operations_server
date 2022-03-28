/**
 * 添加公司接口
 */
const router = require("koa-router")();
const Company = require("../../models/companySchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");

router.post("/addCompany", async (ctx) => {
  try {
    const { companyName, legalPersonName, contactPhone } = ctx.request.body;
    const res = await Company.findOne({ companyName });
    const company = res?._doc;
    if (company) {
      ctx.body = util.fail("", "已有同样名称的公司了");
    } else {
      const addCompany = new Company({
        companyName,
        legalPersonName,
        contactPhone,
      });
      addCompany.save();
      ctx.body = util.success({}, "添加成功");
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;

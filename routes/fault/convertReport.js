/**
 * 故障转单接口
 */
const router = require("koa-router")();
const CompanyTemplate = require("../../models/companyTemplateSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const mongoose = require("mongoose");
const config = require("../../config");
const dayjs = require("dayjs");

router.post("/fault/convert", async (ctx) => {
  const db = mongoose.createConnection(config.URL);
  try {
    const { receiveUser, id, remark } = ctx.request.body;
    const { user } = ctx.state;
    const companyTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: "2" });
    if (!companyTemplate) {
      ctx.body = util.fail("", "请先设置公司故障模板");
      return;
    }
    let schema = await util.guzhangSchemaProperty(companyTemplate.content);
    let faultModule = db.model(companyTemplate.moduleName, schema, companyTemplate.moduleName);
    const fault = await faultModule.findById(id);
    const res = await faultModule.updateOne(
      { _id: id },
      { $set: { oldDispose: [...fault.oldDispose, fault.dispose], dispose: receiveUser, remark } }
    );
    if (res.modifiedCount > 0) {
      ctx.body = util.success({}, "转单成功");
    } else {
      ctx.body = util.fail("", "转单失败");
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  } finally {
    db.close();
  }
});

module.exports = router;

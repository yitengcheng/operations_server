/**
 * 小程序上报故障接口
 */
const router = require('koa-router')();
const CompanyTemplate = require('../../models/companyTemplateSchema');
const Scheduling = require('../../models/schedulingSchema');
const User = require('../../models/userSchema');
const Role = require('../../models/roleSchema');
const util = require('../../utils/util');
const mongoose = require('mongoose');
const config = require('../../config');
const dayjs = require('dayjs');
const sendSMS = require('../../utils/sms');

router.post('/applet/reportFault', async (ctx) => {
  const db = mongoose.createConnection(config.URL);
  try {
    const { data, templateId, assetsId, code } = ctx.request.body;
    const companyTemplate = await CompanyTemplate.findById(templateId);
    if (!companyTemplate) {
      ctx.body = util.fail('', '请先设置公司故障模板');
      return;
    }
    let schema = await util.guzhangSchemaProperty(companyTemplate.content);
    let faultModule = db.model(companyTemplate.moduleName, schema, companyTemplate.moduleName);
    const phoneNumber = await util.getAppletPhonenumber(code);
    const scheduling = await Scheduling.findOne({
      companyId: companyTemplate.companyId,
      dateOnDuty: dayjs().format('YYYY-MM-DD'),
    });
    let staff;
    let staffCount = 0;
    scheduling?.staffIds?.forEach(async (staff, index) => {
      const count = await faultModule.countDocuments({ createTime: { $lte: dayjs().toDate() }, dispose: staff });
      if (index === 0) {
        staffCount = count;
        staff = await User.findById(staff);
        return;
      }
      if (count < staffCount) {
        staff = await User.findById(staff);
      }
    });
    if (!staff) {
      const role = await Role.findOne({ name: '运维公司' });
      staff = await User.findOne({ companyId: companyTemplate.companyId, roleId: role._id });
    }
    if (staff?.phonenumber) {
      sendSMS(staff?.phonenumber);
    }
    await faultModule.create({
      ...data,
      assetsId,
      dispose: new mongoose.Types.ObjectId(staff._id),
      status: 1,
      createTime: Date.now(),
      designateTime: Date.now(),
      phoneNumber,
    });
    ctx.body = util.success({}, '上报成功');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  } finally {
    db.close();
  }
});

module.exports = router;

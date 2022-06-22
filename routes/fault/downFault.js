/**
 * PC端下载工单接口
 */
const router = require('koa-router')();
const CompanyTemplate = require('../../models/companyTemplateSchema');
const Company = require('../../models/companySchema');
const User = require('../../models/userSchema');
const util = require('../../utils/util');
const config = require('../../config');
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');
const _ = require('lodash');
const dayjs = require('dayjs');
const quarterOfYear = require('dayjs/plugin/quarterOfYear');
dayjs.extend(quarterOfYear);

router.post('/fault/downFault', async (ctx) => {
  const db = mongoose.createConnection(config.URL);
  try {
    const { user } = ctx.state;
    const { dateType } = ctx.request.body;
    const company = await Company.findById(user.companyId);
    const companyTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: '2' });
    if (!companyTemplate) {
      ctx.body = util.fail('', '请先设置公司故障模板');
      return;
    }
    let schema = await util.guzhangSchemaProperty(companyTemplate.content);
    let faultModule = db.model(companyTemplate.moduleName, schema, companyTemplate.moduleName);
    let createTimeParams = {};
    if (dateType === 1) {
      createTimeParams = {
        createTime: { $gte: dayjs(dayjs().startOf('month')).toDate(), $lte: dayjs(dayjs().endOf('month')).toDate() },
      };
    } else if (dateType === 2) {
      createTimeParams = {
        createTime: {
          $gte: dayjs(dayjs().startOf('quarter')).toDate(),
          $lte: dayjs(dayjs().endOf('quarter')).toDate(),
        },
      };
    } else if (dateType === 3) {
      createTimeParams = {
        createTime: { $gte: dayjs(dayjs().startOf('year')).toDate(), $lte: dayjs(dayjs().endOf('year')).toDate() },
      };
    }
    const faults = await faultModule.find(createTimeParams, {
      _id: 0,
      __v: 0,
      assetsId: 0,
      oldDispose: 0,
      conclusionPhoto: 0,
    });
    const wb = xlsx.utils.book_new();
    let data = [];
    let faultDocs = _.map(faults, '_doc');
    for (const fault of faultDocs) {
      let reportUser = await User.findOne({ _id: fault.reportUser }, { nickName: 1 });
      let assistUser = await User.findOne({ _id: fault.assistUser }, { nickName: 1 });
      let cc = await User.findOne({ _id: fault.cc }, { nickName: 1 });
      let dispose = await User.findOne({ _id: fault.dispose }, { nickName: 1 });
      let item = {
        上报人: reportUser?.nickName ?? '暂无',
        协助人: assistUser?.nickName ?? '暂无',
        抄送人: cc?.nickName ?? '暂无',
        状态: fault.status === 1 ? '待处理' : fault.status === 2 ? '处理成功' : '拒绝处理',
        处理人: dispose?.nickName ?? '暂无',
        创建时间: dayjs(fault.createTime).format('YYYY-MM-DD'),
        指派时间: dayjs(fault.designateTime).format('YYYY-MM-DD'),
        联系方式: fault?.phoneNumber ?? '暂无',
        转单备注: fault?.remark ?? '暂无',
        处理情况: fault?.conclusion ?? '暂无',
      };
      delete fault.reportUser;
      delete fault.assistUser;
      delete fault.cc;
      delete fault.status;
      delete fault.dispose;
      delete fault.createTime;
      delete fault.designateTime;
      delete fault.phoneNumber;
      delete fault.remark;
      delete fault.conclusion;
      data.push({ ...fault, ...item });
    }
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, '工单');
    await xlsx.writeFile(wb, path.join(`${__dirname}../../../public/zip/${company.companyName}工单.xlsx`));
    ctx.body = util.success({ url: `zip/${company.companyName}工单.xlsx` });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  } finally {
    db.close();
  }
});

module.exports = router;

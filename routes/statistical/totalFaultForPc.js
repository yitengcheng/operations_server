/**
 * 故障统计接口
 */
const router = require('koa-router')();
const CompanyTemplate = require('../../models/companyTemplateSchema');
const util = require('../../utils/util');
const mongoose = require('mongoose');
const config = require('../../config');
const _ = require('lodash');
const dayjs = require('dayjs');
const quarterOfYear = require('dayjs/plugin/quarterOfYear');
dayjs.extend(quarterOfYear);

router.post('/statistical/total/fault', async (ctx) => {
  const db = mongoose.createConnection(config.URL);
  try {
    const { user } = ctx.state;
    const { type, dateType } = ctx.request.body; // type 1 待处理 2 处理成功 3 拒绝处理
    let createTimeParams = {};
    if (dateType === 1) {
      createTimeParams = {
        createTime: {
          $gte: dayjs(dayjs().startOf('month')).toDate(),
          $lte: dayjs(dayjs().endOf('month')).toDate(),
        },
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
        createTime: {
          $gte: dayjs(dayjs().startOf('year')).toDate(),
          $lte: dayjs(dayjs().endOf('year')).toDate(),
        },
      };
    }
    const faultTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: '2' });
    let faultSchema = await util.guzhangSchemaProperty(faultTemplate.content);
    let faultFields = await util.schemaProperty(faultTemplate.content);
    let faultModule = db.model(faultTemplate.moduleName, faultSchema, faultTemplate.moduleName);
    const params = typeof type === 'undefined' ? {} : { status: type };
    const data = await faultModule.find({ ...params, ...createTimeParams });
    const fields = _.keys(faultFields);
    ctx.body = util.success({ data, fields });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  } finally {
    db.close();
  }
});

module.exports = router;

/**
 * PC端下载巡检接口
 */
const router = require('koa-router')();
const InspectionReport = require('../../models/inspectionReportSchema');
const Company = require('../../models/companySchema');
const util = require('../../utils/util');
const xlsx = require('xlsx');
const path = require('path');
const _ = require('lodash');
const dayjs = require('dayjs');
const quarterOfYear = require('dayjs/plugin/quarterOfYear');
dayjs.extend(quarterOfYear);

router.post('/patrol/address/downInspectionReport', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { dateType } = ctx.request.body;
    const company = await Company.findById(user.companyId);
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
    const inspectionReports = await InspectionReport.find(
      { companyId: user.companyId, ...createTimeParams },
      {
        _id: 0,
        __v: 0,
        companyId: 0,
        remarkPhoto: 0,
      },
    ).populate([
      { path: 'parentId', select: { office: 1 } },
      { path: 'childrenId', select: { office: 1 } },
      { path: 'reportUser', select: { nickName: 1 } },
      { path: 'headUser', select: { nickName: 1 } },
    ]);
    const wb = xlsx.utils.book_new();
    let data = [];
    let inspectionReportsDocs = _.map(inspectionReports, '_doc');
    for (const inspectionReport of inspectionReportsDocs) {
      let item = {
        巡检点: inspectionReport?.parentId?.office ?? '暂无',
        办公点: inspectionReport?.childrenId?.office ?? '暂无',
        上报人: inspectionReport?.reportUser?.nickName ?? '暂无',
        巡检负责人: inspectionReport?.headUser?.nickName ?? '暂无',
        状态: inspectionReport.status === 1 ? '完成' : inspectionReport.status === 2 ? '维修中' : '暂无',
        创建时间: dayjs(inspectionReport.createTime).format('YYYY-MM-DD'),
        维修时间: dayjs(inspectionReport.serviceTime).format('YYYY-MM-DD'),
        完成时间: dayjs(inspectionReport.completeTime).format('YYYY-MM-DD'),
        备注: inspectionReport?.remark ?? '暂无',
      };
      delete inspectionReport.parentId;
      delete inspectionReport.childrenId;
      delete inspectionReport.reportUser;
      delete inspectionReport.headUser;
      delete inspectionReport.status;
      delete inspectionReport.createTime;
      delete inspectionReport.serviceTime;
      delete inspectionReport.completeTime;
      delete inspectionReport.remark;
      data.push({ ...inspectionReport, ...item });
    }
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, '工单');
    await xlsx.writeFile(wb, path.join(`${__dirname}../../../public/zip/${company.companyName}巡检.xlsx`));
    ctx.body = util.success({ url: `zip/${company.companyName}巡检.xlsx` });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;

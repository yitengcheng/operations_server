/**
 * 获取巡检记录
 */
const router = require('koa-router')();
const InspectionReport = require('../../models/inspectionReportSchema');
const Role = require('../../models/roleSchema');
const util = require('../../utils/util');
const dayjs = require('dayjs');
const { default: mongoose } = require('mongoose');

router.post('/patrol/list', async (ctx) => {
  try {
    const { remark, createTime, status, parentId, childrenId } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    const { user } = ctx.state;
    const fuzzyQuery = util.fuzzyQuery(['remark'], remark);
    let parentParams = {};
    if (parentId) {
      parentParams = { parentId };
    }
    let childrenParams = {};
    if (childrenId) {
      childrenParams = { childrenId };
    }
    let statusParams = {};
    if (status) {
      statusParams = { status };
    }
    let createTimeParams = {};
    if (createTime && createTime !== '0') {
      createTimeParams = {
        createTime: {
          $gte: dayjs(dayjs(createTime).startOf('day')).toDate(),
          $lte: dayjs(dayjs(createTime).endOf('day')).toDate(),
        },
      };
    }
    let customer = {};
    if (!user?.roleId) {
      customer = { customerId: mongoose.Types.ObjectId(user?._id) };
    }
    let params = {
      companyId: user.companyId,
      ...createTimeParams,
      ...statusParams,
      ...fuzzyQuery,
      ...customer,
      ...parentParams,
      ...childrenParams,
    };
    const role = await Role.findById(user?.roleId);
    if (role?.name === '运维工人') {
      params['$or'] = [{ reportUser: user._id }, { headUser: user._id }];
    }
    const query = InspectionReport.find(params).populate([
      { path: 'parentId', select: { office: 1 } },
      { path: 'childrenId', select: { office: 1 } },
      { path: 'reportUser', select: { nickName: 1 } },
      { path: 'headUser', select: { nickName: 1 } },
      { path: 'customerId', select: { name: 1 } },
    ]);
    const list = await query.skip(skipIndex).limit(page.pageSize).sort({ createTime: 1 });
    const total = await InspectionReport.countDocuments(params);
    ctx.body = util.success({ total, list });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;

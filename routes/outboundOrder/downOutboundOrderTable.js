/**
 * 下载出库单列表接口
 */
const router = require('koa-router')();
const outboundOrderSchema = require('../../models/outboundOrderSchema');
const util = require('../../utils/util');
const lodash = require('lodash');
const xlsx = require('xlsx');
const path = require('path');
const dayjs = require('dayjs');
const { OUTBOUNDORDER_TYPE } = require('../../utils/constant');

router.post('/outboundOrder/downOutboundOrderTable', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { params } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    const timeParams = util.timeQuery(params?.outboundTime, 'outboundTime');
    delete params?.outboundTime;
    const res = await outboundOrderSchema
      .find({ ...timeParams, ...params, belongs: user?.belongs ?? user._id, delFlag: false })
      .skip(skipIndex)
      .limit(page.pageSize)
      .populate([
        { path: 'outboundType' },
        { path: 'receiveUser' },
        { path: 'outboundTime' },
        { path: 'outboundItems', populate: [{ path: 'goodId', populate: ['unit'] }] },
      ]);
    let excel = [];
    lodash.map(res, (item) => {
      excel.push({
        出库单号: item?.orderNo ?? '暂无',
        物品名称: lodash.map(lodash.map(item?.outboundItems, 'goodId'), 'name').join(',') || '暂无',
        数量合计: item?.numberTotal ?? '暂无',
        金额合计: item?.amountTotal ?? '暂无',
        出库类型: item?.outboundType?.name ?? '暂无',
        出库时间: item?.outboundTime ? dayjs(item?.outboundTime).format('YYYY年MM月DD日') : '暂无',
        状态: item?.status ? util.showOption(OUTBOUNDORDER_TYPE, item?.status) : '暂无',
        备注: item?.remark ?? '暂无',
      });
    });
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(excel);
    xlsx.utils.book_append_sheet(wb, ws, '出库单汇总');
    let fileName = `出库单汇总${dayjs().format('YYYYMMDDHHmmss')}.xlsx`;
    await xlsx.writeFile(wb, path.join(`${__dirname}../../../public/zip/${fileName}`));
    ctx.body = util.success({ url: `zip/${fileName}` });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;

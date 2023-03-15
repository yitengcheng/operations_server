/**
 * 下载入库单列表接口
 */
const router = require('koa-router')();
const godownEntrySchema = require('../../models/godownEntrySchema');
const util = require('../../utils/util');
const lodash = require('lodash');
const xlsx = require('xlsx');
const path = require('path');
const dayjs = require('dayjs');
const { GODOWNENTRY_TYPE } = require('../../utils/constant');

router.post('/godownEntry/downGodownEntryTable', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { params } = ctx.request.body;
    const timeParams = util.timeQuery(params?.storageTime, 'storageTime');
    delete params?.storageTime;
    const res = await godownEntrySchema
      .find({ ...timeParams, ...params, belongs: user?.belongs ?? user._id, delFlag: false })
      .populate([{ path: 'storageType' }, { path: 'storageTime' }, { path: 'godownEntryIds', populate: ['goodId'] }]);
    let excel = [];
    lodash.map(res, (item) => {
      excel.push({
        入库单号: item?.orderNo ?? '暂无',
        物品名称: lodash.map(lodash.map(item?.godownEntryIds, 'goodId'), 'name').join(',') || '暂无',
        数量合计: item?.numberTotal ?? '暂无',
        金额合计: item?.amountTotal ?? '暂无',
        出库类型: item?.storageType?.name ?? '暂无',
        出库时间: item?.storageTime ? dayjs(item?.storageTime).format('YYYY年MM月DD日') : '暂无',
        状态: item?.status ? util.showOption(GODOWNENTRY_TYPE, item?.status) : '暂无',
        备注: item?.remark ?? '暂无',
      });
    });
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(excel);
    xlsx.utils.book_append_sheet(wb, ws, '入库单汇总');
    let fileName = `入库单汇总${dayjs().format('YYYYMMDDHHmmss')}.xlsx`;
    await xlsx.writeFile(wb, path.join(`${__dirname}../../../public/zip/${fileName}`));
    ctx.body = util.success({ url: `zip/${fileName}` });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;

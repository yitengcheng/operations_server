/**
 * 下载商家供货列表接口
 */
const router = require('koa-router')();
const godownEntrySchema = require('../../models/godownEntrySchema');
const godownEntryItemSchema = require('../../models/godownEntryItemSchema');
const util = require('../../utils/util');
const xlsx = require('xlsx');
const path = require('path');
const dayjs = require('dayjs');
const lodash = require('lodash');

router.post('/godownEntry/downGodownSupplierTable', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { params } = ctx.request.body;
    const timeParams = util.timeQuery(params?.storageTime, 'storageTime');
    delete params?.storageTime;
    const godownEntrys = await godownEntrySchema.find({
      ...timeParams,
      ...params,
      belongs: user?.belongs ?? user._id,
      delFlag: false,
      status: 1,
    });
    const godownEntryIds = lodash.map(godownEntrys, '_id');
    const res = await godownEntryItemSchema
      .find({ belongs: user?.belongs ?? user._id, delFlag: false, godownEntryId: { $in: godownEntryIds } })
      .populate([{ path: 'goodId', populate: ['unit', 'classification'] }, { path: 'godownEntryId' }]);

    let excel = [];
    lodash.map(res, (item) => {
      excel.push({
        日期: item?.godownEntryId?.storageTime
          ? dayjs(item?.godownEntryId?.storageTime).format('YYYY年MM月DD日')
          : '暂无',
        物品名称: item?.goodId?.name ?? '暂无',
        规格: item?.goodId?.models ?? '暂无',
        单位: item?.goodId?.unit?.name ?? '暂无',
        数量: item?.goodNum ?? '暂无',
        物品分类: item?.goodId?.classification?.name ?? '暂无',
        备注: item?.remark ?? '暂无',
      });
    });
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(excel);
    xlsx.utils.book_append_sheet(wb, ws, '商家供货汇总表');
    let fileName = `商家供货汇总表${dayjs().format('YYYYMMDDHHmmss')}.xlsx`;
    await xlsx.writeFile(wb, path.join(`${__dirname}../../../public/zip/${fileName}`));
    ctx.body = util.success({ url: `zip/${fileName}` });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;

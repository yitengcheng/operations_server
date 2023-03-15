/**
 * 下载库存变动列表接口
 */
const router = require('koa-router')();
const goodsSchema = require('../../models/goodsSchema');
const util = require('../../utils/util');
const outboundOrderItemSchema = require('../../models/outboundOrderItemSchema');
const godownEntryItemSchema = require('../../models/godownEntryItemSchema');
const xlsx = require('xlsx');
const path = require('path');
const dayjs = require('dayjs');
const lodash = require('lodash');

router.post('/goods/downGoodChangeTable', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { time } = ctx.request.body;
    const outboundTimeParams = util.timeQuery(time, 'outboundTime');
    const godownEntryTimeParams = util.timeQuery(time, 'storageTime');

    const goods = await goodsSchema.find({ belongs: user?.belongs ?? user._id, delFlag: false });
    const goodIds = lodash.map(goods, '_id');
    const outboundItemsList = await outboundOrderItemSchema
      .find({
        belongs: user?.belongs ?? user._id,
        delFlag: false,
        goodId: { $in: goodIds },
      })
      .populate([
        { path: 'outboundOrderId', match: { status: 4, ...outboundTimeParams } },
        { path: 'goodId', populate: ['unit'] },
      ]);
    const godownEntryItemsList = await godownEntryItemSchema
      .find({
        belongs: user?.belongs ?? user._id,
        delFlag: false,
        goodId: { $in: goodIds },
      })
      .populate([
        { path: 'godownEntryId', match: { status: 1, ...godownEntryTimeParams } },
        { path: 'goodId', populate: ['unit'] },
      ]);
    let list = [];

    lodash.map(
      lodash.concat(
        lodash.map(outboundItemsList, (o) => {
          return { ...o?._doc, goodNum: o?.goodNum * -1 };
        }),
        godownEntryItemsList,
      ),
      (item) => {
        if (item) {
          list.push({
            key: item?._id,
            date: item?.outboundOrderId?.outboundTime ?? item?.godownEntryId?.storageTime,
            orderNo: item?.outboundOrderId?.orderNo ?? item?.godownEntryId?.orderNo,
            goodName: item?.goodId?.name,
            goodModels: item?.goodId?.models,
            goodUnit: item?.goodId?.unit?.name,
            goodNum: item?.goodNum,
            goodPrice: item?.goodId?.price,
            goodAmount: item?.goodId?.price * item?.goodNum,
          });
        }
      },
    );
    let tmp = lodash.sortBy(
      lodash.filter(list, (o) => {
        return o?.orderNo;
      }),
      'date',
    );
    let excel = [];
    lodash.map(tmp, (item) => {
      excel.push({
        发生时间: item?.date ? dayjs(item?.date).format('YYYY年MM月DD日') : '暂无',
        单据编号: item?.orderNo ?? '暂无',
        物品名称: item?.goodName ?? '暂无',
        规格: item?.goodModels ?? '暂无',
        单位: item?.goodUnit ?? '暂无',
        数量: item?.goodNum ?? '暂无',
      });
    });
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(excel);
    xlsx.utils.book_append_sheet(wb, ws, '库存变动汇总表');
    let fileName = `库存变动汇总表${dayjs().format('YYYYMMDDHHmmss')}.xlsx`;
    await xlsx.writeFile(wb, path.join(`${__dirname}../../../public/zip/${fileName}`));
    ctx.body = util.success({ url: `zip/${fileName}` });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;

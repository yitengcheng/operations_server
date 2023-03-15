/**
 * 批量录入入库单
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const koaBody = require('koa-body');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const config = require('../../config');
const dayjs = require('dayjs');
const godownEntrySchema = require('../../models/godownEntrySchema');
const optionSchema = require('../../models/optionSchema');
const employeesSchema = require('../../models/employeesSchema');
const supplierSchema = require('../../models/supplierSchema');
const godownEntryItemSchema = require('../../models/godownEntryItemSchema');
const goodsSchema = require('../../models/goodsSchema');

router.post(
  '/upload/inserGodownEntry',
  koaBody({
    // 支持文件格式
    multipart: true,
    formidable: {
      // 上传目录
      uploadDir: path.join(__dirname, '../../public/upload'),
      // 保留文件扩展名
      keepExtensions: true,
      maxFileSize: 52428800,
    },
  }),
  async (ctx) => {
    try {
      const { file } = ctx.request.files;
      const { user } = ctx.state;
      const workbook = xlsx.readFile(file.path);
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      for (const item of data) {
        let storageType = await optionSchema.findOne({
          belongs: user?.belongs ?? user._id,
          delFlag: false,
          name: item?.['入库类型'],
          type: 1,
        });
        const employee = await employeesSchema.findOne({
          belongs: user?.belongs ?? user._id,
          delFlag: false,
          account: item?.['经手人账号'],
        });
        const supplier = await supplierSchema.findOne({
          belongs: user?.belongs ?? user._id,
          delFlag: false,
          name: item?.['供应商'],
        });
        const newGodownEntry = await godownEntrySchema.create({
          storageTime: item?.['入库时间'],
          orderNo: `RK${dayjs().format('YYYYMMDDHHmmssSSS')}`,
          storageType: storageType?._id,
          supplierId: supplier?._id,
          handleUser: employee?._id,
          voucherUser: user._id,
          belongs: user?.belongs ?? user._id,
          delFlag: false,
        });
        let godownEntryIds = [];
        let good = await goodsSchema.findOne({
          belongs: user?.belongs ?? user._id,
          delFlag: false,
          name: item?.['物品名称'],
        });
        const godownEntryItem = await godownEntryItemSchema.create({
          belongs: user?.belongs ?? user._id,
          delFlag: false,
          godownEntryId: newGodownEntry._id,
          remark: item?.['备注'],
          goodId: good?._id,
          goodNum: item?.['入库数量'],
        });
        await goodsSchema.findByIdAndUpdate(good?._id, { $inc: { inventoryNumber: item?.['入库数量'] } });
        godownEntryIds.push(godownEntryItem._id);
        await godownEntrySchema.updateOne(
          { _id: newGodownEntry._id },
          {
            godownEntryIds: godownEntryIds,
            numberTotal: item?.['入库数量'],
            amountTotal: item?.['入库数量'] * good?.price,
          },
        );
      }
      fs.unlinkSync(file.path);
      ctx.body = util.success({}, `批量导入完成，请注意核查`);
    } catch (error) {
      ctx.body = util.fail(error.stack);
    }
  },
);

module.exports = router;

/**
 * 批量录入物品
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const koaBody = require('koa-body');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const config = require('../../config');
const goodsSchema = require('../../models/goodsSchema');
const optionSchema = require('../../models/optionSchema');
const supplierSchema = require('../../models/supplierSchema');

router.post(
  '/upload/insertGoods',
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
      let result = [];
      for (const item of data) {
        let unit = await optionSchema.findOne({
          belongs: user?.belongs ?? user._id,
          delFlag: false,
          name: item?.['单位'],
          type: 3,
        });
        let supplierId = await supplierSchema.findOne({
          belongs: user?.belongs ?? user._id,
          delFlag: false,
          name: item?.['供应商'],
        });
        let classification = await optionSchema.findOne({
          belongs: user?.belongs ?? user._id,
          delFlag: false,
          name: item?.['物品分类'],
          type: 4,
        });
        let tmp = {
          belongs: user?.belongs ?? user._id,
          name: item?.['物品名称'],
          models: item?.['规格型号'],
          unit: unit?._id,
          supplierId: supplierId?._id,
          classification: classification?._id,
          hasFixed: item?.['是否为固定资产'] === '是' ? true : false,
          fixedNumber: item?.['固定资产编号'],
          brand: item?.['品牌'],
          price: item?.['单价'],
          inventoryNumber: item?.['库存数量'],
          inventoryMax: item?.['库存上限'],
          inventoryMin: item?.['库存下限'],
          remark: item?.['备注'],
        };
        result.push(tmp);
      }
      fs.unlinkSync(file.path);
      const res = await goodsSchema.insertMany(result);
      ctx.body = util.success({}, `成功插入${res?.length ?? '0'}条`);
    } catch (error) {
      ctx.body = util.fail(error.stack);
    }
  },
);

module.exports = router;

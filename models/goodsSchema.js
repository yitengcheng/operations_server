/**
 * 物品实体
 */
const mongoose = require('mongoose');

const schema = mongoose.Schema({
  delFlag: { type: Boolean, default: false }, // 删除标识
  belongs: { type: mongoose.Types.ObjectId, ref: 'customers' }, // 所属
  name: String, // 物品名称
  models: String, // 规格型号
  unit: { type: mongoose.Types.ObjectId, ref: 'options' }, // 计量单位
  classification: { type: mongoose.Types.ObjectId, ref: 'options' }, // 物品分类
  price: Number, // 单价
  inventoryNumber: Number, // 库存数量
  inventoryMax: Number, // 库存上限
  inventoryMin: Number, // 库存下限
  supplierId: { type: mongoose.Types.ObjectId, ref: 'suppliers' }, // 供应商
  remark: String, // 备注
  hasFixed: Boolean, // 是否为固定资产
  brand: String, // 品牌
  fixedNumber: String, //固定资产编号
});

module.exports = mongoose.model('goods', schema, 'goods'); // 模型名 schema 数据库集合名

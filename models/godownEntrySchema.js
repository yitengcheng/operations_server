/**
 * 入库单实体
 */
const mongoose = require('mongoose');

const schema = mongoose.Schema({
  delFlag: { type: Boolean, default: false }, // 删除标识
  belongs: { type: mongoose.Types.ObjectId, ref: 'customers' }, // 所属
  storageTime: { type: Date, default: new Date() }, // 入库时间
  orderNo: String, // 单号
  storageType: { type: mongoose.Types.ObjectId, ref: 'options' }, // 入库类型
  supplierId: { type: mongoose.Types.ObjectId, ref: 'suppliers' }, // 供应商
  handleUser: { type: mongoose.Types.ObjectId, ref: 'employees' }, // 经手人
  voucherUser: { type: mongoose.Types.ObjectId, ref: 'employees' }, // 制单人
  remark: String, // 备注
  godownEntryIds: [{ type: mongoose.Types.ObjectId, ref: 'godownEntryItems' }], // 子项列表
  numberTotal: Number, // 数量合计
  amountTotal: Number, // 金额合计
  status: { type: Number, default: 1 }, // 状态 1正常 2作废
});

module.exports = mongoose.model('godownEntrys', schema, 'godownEntrys'); // 模型名 schema 数据库集合名

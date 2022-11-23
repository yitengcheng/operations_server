/**
 * 部门定额实体
 */
const mongoose = require('mongoose');

const schema = mongoose.Schema({
  delFlag: { type: Boolean, default: false }, // 删除标识
  belongs: { type: mongoose.Types.ObjectId, ref: 'customers' }, // 所属
  departmentId: { type: mongoose.Types.ObjectId, ref: 'departments' }, // 部门
  goodId: { type: mongoose.Types.ObjectId, ref: 'goods' }, // 物品
  jan: Number, // 一月
  feb: Number, // 二月
  mar: Number, // 三月
  apr: Number, // 四月
  may: Number, // 五月
  jun: Number, // 六月
  jul: Number, // 七月
  aug: Number, // 八月
  sep: Number, // 九月
  oct: Number, // 十月
  nov: Number, // 十一月
  dec: Number, // 十二月
});

module.exports = mongoose.model('branchQutas', schema, 'branchQutas'); // 模型名 schema 数据库集合名

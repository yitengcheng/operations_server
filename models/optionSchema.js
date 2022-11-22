/**
 * 选项实体
 */
const mongoose = require('mongoose');

const schema = mongoose.Schema({
  delFlag: { type: Boolean, default: false }, // 删除标识
  belongs: { type: mongoose.Types.ObjectId, ref: 'customers' }, // 所属
  name: String, // 名称
  type: Number, // 选项类型 1 入库类型 2 出库类型 3计量单位 4物品类型
  remark: String, // 备注
});

module.exports = mongoose.model('options', schema, 'options'); // 模型名 schema 数据库集合名

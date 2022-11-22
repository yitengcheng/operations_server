/**
 * 供应商实体
 */
const mongoose = require('mongoose');

const schema = mongoose.Schema({
  delFlag: { type: Boolean, default: false }, // 删除标识
  name: String, // 供应商名
  headerUser: String, // 负责人姓名
  phone: String, // 联系电话
  wechat: String, // 微信
  email: String, // 电子邮箱
  address: String, // 地址
  remark: String, // 备注
  belongs: { type: mongoose.Types.ObjectId, ref: 'customers' }, // 所属
});

module.exports = mongoose.model('suppliers', schema, 'suppliers'); // 模型名 schema 数据库集合名

/**
 * 事项实体
 */
const mongoose = require('mongoose');

const schema = mongoose.Schema({
  delFlag: { type: Boolean, default: false }, // 删除标识
  belongs: { type: mongoose.Types.ObjectId, ref: 'customers' }, // 所属
  recordUser: { type: mongoose.Types.ObjectId, ref: 'employees' }, // 记录人
  content: String, // 内容
  recordTime: Date, // 记录时间
  type: Number, // 类型 普通事项 紧急事项
});

module.exports = mongoose.model('matters', schema, 'matters'); // 模型名 schema 数据库集合名

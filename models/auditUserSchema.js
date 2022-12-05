/**
 * 审核人员实体
 */
const mongoose = require('mongoose');

const schema = mongoose.Schema({
  delFlag: { type: Boolean, default: false }, // 删除标识
  belongs: { type: mongoose.Types.ObjectId, ref: 'customers' }, // 所属
  auditUserList: [{ type: mongoose.Types.ObjectId, ref: 'employees' }], // 审核人列表
});

module.exports = mongoose.model('auditUsers', schema, 'auditUsers'); // 模型名 schema 数据库集合名

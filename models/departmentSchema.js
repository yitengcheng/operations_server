/**
 * 部门实体
 */
const mongoose = require('mongoose');

const schema = mongoose.Schema({
  departmentName: String, // 部门名
  parentId: { type: mongoose.Types.ObjectId, ref: 'departments' }, // 父级部门id
  belongs: { type: mongoose.Types.ObjectId, ref: 'customers' }, // 所属
  delFlag: { type: Boolean, default: false }, // 删除标识
});

module.exports = mongoose.model('departments', schema, 'departments'); // 模型名 schema 数据库集合名

/**
 * 客户下属员工实体
 */
const mongoose = require('mongoose');

const schema = mongoose.Schema({
  delFlag: { type: Boolean, default: false }, // 删除标识
  departmentId: { type: mongoose.Types.ObjectId, ref: 'departments' }, // 所属部门
  belongs: { type: mongoose.Types.ObjectId, ref: 'customers' }, // 所属
  name: String, // 姓名
  account: String, // 登录账号
  phone: String, // 联系电话
  password: String, // 登录密码
  type: Number, // 员工类型： 1 管理者 2 普通员工
  remark: String, // 备注
});

module.exports = mongoose.model('employees', schema, 'employees'); // 模型名 schema 数据库集合名

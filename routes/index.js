const users = require('./users');
const fault = require('./fault');
const menu = require('./menu');
const oss = require('./oss');
const company = require('./company');
const scheduling = require('./scheduling');
const inspection = require('./inspection');
const companyTemplate = require('./companyTemplate');
const asset = require('./asset');
const statistical = require('./statistical');
const texus = require('./texus');
const taintedChicken = require('./taintedChicken');
const customers = require('./customers');
const department = require('./department');
const employees = require('./employees');
const suppliers = require('./suppliers');
const options = require('./options');
const goods = require('./goods');
const branchQutas = require('./branchQutas');

const routers = {
  ...users,
  ...fault,
  ...menu,
  ...oss,
  ...company,
  ...scheduling,
  ...inspection,
  ...companyTemplate,
  ...asset,
  ...statistical,
  ...texus,
  ...taintedChicken,
  ...customers,
  ...department,
  ...employees,
  ...suppliers,
  ...options,
  ...goods,
  ...branchQutas,
};

module.exports = routers;

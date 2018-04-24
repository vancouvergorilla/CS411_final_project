'use strict';

const Promise = require('bluebird');

const db = require('../../config/db');
  // console.log("fk111");
module.exports = (param) => {
  console.log("param = "+param);

  const username = param.username;
  const password = param.password;
  const gender = param.gender;
  const name = param.name;
  const region = param.region;
  const petName = param.petName;
  const petKind = param.petKind;
  const petBreed = param.petBreed;
  const petGender = param.petGender;

  return Promise.using(db(), conn => {
    // const sql = "INSERT INTO "
//     UPDATE Customers
// SET ContactName = 'Alfred Schmidt', City= 'Frankfurt'
// WHERE CustomerID = 1;
console.log(username)
    const sql = 'UPDATE User SET password=?, gender=?, name=?,'+
    'region=?, petName=?, petKind=?, petBreed=?, petGender=? WHERE username = ?'
    // const sql = `update todo set done=? where id=?`;
    console.log(sql)
    return conn.queryAsync(sql, [password,gender,name,region,petName,petKind,petBreed,petGender,username]);
  });
};

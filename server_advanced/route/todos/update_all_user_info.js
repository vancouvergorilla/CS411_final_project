'use strict';

const Promise = require('bluebird');

const todoDao = require('../../model/todo');
const sendError = require('../../helper/sendError');

module.exports = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const gender = req.body.gender;
  const name = req.body.name;
  const region = req.body.region;
  const petName = req.body.petName;
  const petKind =req.body.petKind;
  const petBreed = req.body.petBreed;
  const petGender = req.body.petGender;
  // const following = ""; //这边要改
console.log(username)
  Promise.resolve()
  // .then(() => {
  //   return get_result(username);
  // })
  // .then((data) => {
  //   if(!data[0]){
  //     return true;
  //   }
  //   if(data[0].password){
  //     res.status(404).send({
  //         message: 'username already exsits'
  //     })
  //   }
  // })
  .then(() => {
    return update_all_user_info(username,password,gender,name,region,petName,petKind,petBreed,petGender);
  })
  .then((data) => {
    res.status(200).send({
          message: 'update success'
    })
  })
  .catch(err => {
    sendError(res, err);
  });
};

function update_all_user_info(username,password,gender,name,region,petName,petKind,petBreed,petGender) {

  return todoDao.update_all_user_info({
    username: username,
    password: password,
    gender: gender,
    name: name,
    region: region,
    petName: petName,
    petKind: petKind,
    petBreed: petBreed,
    petGender: petGender,
  })
}

/*
 action creators模块：用来创建action对象的工厂函数模块
 - 同步action creator： 返回值是action对象
 - 异步action creator： 返回值是一个回调函数
 */

import {reqLogin, reqRegister, reqUpdateUserInfo} from '../api';
import {ERR_MSG, AUTH_SUCCESS,UPDATE_USER, RESET_USER} from './action-types';

 //同步action  注册成功  action-types有几个值，action中就有几个同步action
 export const authSuccess = user => ({type: AUTH_SUCCESS, data: user});
 //同步action 注册失败
 export const errMsg = msg => ({type: ERR_MSG, data: msg});

//同步action  更新用户信息数据成功
export const updateUser = user => ({type: UPDATE_USER, data: user});
//同步action  更新用户信息数据失败
export const resetUser = msg => ({type: RESET_USER, data: msg});

//注册的异步的action
 export const register = data => {
   //data 用户提交的请求参数
   //表单验证，同步方式
   const {username,password,rePassword,type} = data;
   if (!username) {
     return errMsg({username, password, msg:'请输入用户名'});
   } else if (!password) {
     return errMsg({username, password, msg:'请输入密码'});
   } else if (password !== rePassword) {
     return errMsg({username, password, msg:'两次输入密码不相同'});
   } else if (!type) {
     return errMsg({username, password, msg:'请选择账号类型'});

   }
   //异步方法
   return dispath => {
     //发送ajsx
     reqRegister(data)
         .then(res => {
           // 请求成功
           const result = res.data;
           if (result.code === 0) {
             //注册成功
             dispath(authSuccess(result.data));
           } else {
             console.log(result.msg);
             //注册失败
             dispath(errMsg({msg: result.msg, username: data.username, type:data.type}));
           }
         })
         .catch (err => {
           //请求失败
           //注册失败
           dispath(errMsg({msg:'网络不稳定，请重新试试',username: data.username, type: data.type}));
         })
   }
 };

 //更新用户表单数据的异步action
export const updateUserInfo = data => {

  const {header, post, company, salary, info} = data;
  if (!header) {
    return resetUser({msg: '请选择头像'})
  } else if (!post) {
    return resetUser({msg: '请输入招聘职位'})
  } else if (!company) {
    return resetUser({msg: '请输入公司名称'})
  } else if (!salary) {
    return resetUser({msg:'请输入薪资范围'})
  } else if (!info ) {
    return resetUser({msg:'请输入公司简介'})
  }

  //异步的方法
  return dispatch => {
    //发送ajax
    reqUpdateUserInfo(data)
        .then(res => {
          //请求成功
          const result = res.data;
          if (result.code === 0) {
            //注册成功
            dispatch(updateUser(result.data))
          } else {
            //注册失败
            dispatch(resetUser({msg:result.msg}))
          }
        })
        .catch(err => {
          //请求失败，注册失败
          dispatch(resetUser({msg:'网络不稳定，请重新试试'}))
        })
  }

}


 /*
 修改步骤：
 1.action  / action-type
 2.reducers
  3. 容器组件
  4. 入口文件
  5. UI组件

 * */
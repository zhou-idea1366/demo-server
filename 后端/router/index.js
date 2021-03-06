//引入express模块
const express = require ('express');
//引入md5加密 下载：  yarn add blueimp-md5
const md5 = require('blueimp-md5');
//引入cookie-parser
const cookieParser = require('cookie-parser');
//引入users
const Users = require('../models/users');

//获取Router
const Router = express.Router;
//创建路由器对象
const router = new Router();


//解析请求体的数据
router.use(express.urlencoded({extends:true}));

//解析cookie
router.use(cookieParser());

const filter = {__v:0, password:0};

//登录
router.post('/login',async(req, res) => {
  //1.收集用户提交信息
  const {username,password} =req.body;
  //2.判断用户输入是否合法
  if (!username || !password) {
    //说明有数据不合法啊
    res.json ({
      "code":2,
      "msg":"用户输入不合法"
    });
    return;
  }
  //3.去数据库中查找是否有指定用户名和密码
  try {
    const data = await Users.findOne({username,password:md5(password)},filter);
    if(data) {
      //说明用户找到了，登录成功，返回成功响应
      //返回cookie
      res.cookie('userid', data.id, {maxAge: 1000 * 3600 * 24 * 7});
      res.json ({
        "code":0,
        data

      })
    } else {
      //说明用户名或密码错误，返回失败的响应
      res.json ({
        "code":1,
        "msg":"用户名或密码错误"
      })
    }
  } catch (e) {
    res.json ({
      "code":3,
      "msg":"网络不稳定，请重新试试"
    })
  }
})

//注册
router.post('/register',async(req, res) => {
  //1.收集用户提交的信息
  const {username, password, type} = req.body;
  console.log(username,password,type);
  //2.判断用户输入的是否合法
  if (!username || !password || !type) {
    //说明有数据不合法
    res.json({
      "code":2,
      "msg":"用户输入不合法"
    });
    return;
  }
  try {
    const data = await Users.findOne({username});
    if (data) {
      //返回错误
      res.json ({
        "code":1,
        "msg":"用户名已存在"
      });
    } else {
      const data = await Users.create({username,password:md5(password),type});
      //返回成功的响应
      res.cookie('userid', data.id, {maxAge: 1000 * 3600 * 24 * 7});

      res.json({
        code:0,
        data:{
          _id:data.id,
          username:data.username,
          type:data.type
        }
      })
    }
  } catch (e) {
    //说明findOne/create 方法出错了
    //返回失败响应
    res.json({
      "code":3,
      "msg":"网络不稳定，请重新试试"
    })
  }
})

//更新用户信息的路由
router.post('/update', (req, res) => {
  //从请求的cookie得到userid
  const userid = req.cookies.userid;
  if (!userid) {
    return res.json({code:1,msg:'请先登录'});
  }
  //存在，根据userid更新对应的user文档数据
  //得到提交的用户数据
  const user = req.body;
  User.findByIdAndUpdate({_id: userid}, {$set:user})
      .then(oldUser => {
        if(!oldUser) {
          //更新数据失败
          //通知浏览器删除userid cookie
          res.clearCookie('userid');
          //返回一个提示信息
          res.json({code: 1, msg: '请先登录'});
        } else {
          //更新数据成功
          //准备一个返回的user数据对象
          const {__id,username, type} = oldUser;
          const data = Object.assign({_id, username,type}, user)
          //返回成功的响应
          res.json({code:0, data})
        }
      })
      .catch(error => {
        res.send({code: 3, msg: '网络不稳定，请重新试试'})
      })
})


// 获取用户信息的路由(根据cookie中的userid)
router.get('/user', (req, res) => {
  // 从请求的cookie得到userid
  const userid = req.cookies.userid
  // 如果不存在, 直接返回一个提示信息
  if (!userid) {
    return res.send({code: 1, msg: '请先登陆'})
  }
  // 根据userid查询对应的user
  Users.findOne({_id: userid}, filter)
      .then(user => {
        if (user) {
          res.send({code: 0, data: user})
        } else {
          // 通知浏览器删除userid cookie
          res.clearCookie('userid')
          res.send({code: 1, msg: '请先登陆'})
        }
      })
      .catch(error => {
        console.error('获取用户异常', error)
        res.send({code: 3, msg: '网络不稳定，请重新试试~'})
      })
})

// 获取用户列表(根据类型)
router.get('/userlist', (req, res) => {
  const {type} = req.query
  Users.find({type}, filter)
      .then(users => {
        res.send({code: 0, data: users})
      })
      .catch(error => {
        console.error('获取用户列表异常', error)
        res.send({code: 1, msg: '获取用户列表异常, 请重新尝试'})
      })
})


//暴露出去
module.exports = router;
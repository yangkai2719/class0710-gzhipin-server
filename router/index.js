const express = require('express');

const md5 = require('blueimp-md5');


const cookieParser = require('cookie-parser');

const Users = require('../models/users');

const Messages = require('../models/messages');

const Router = express.Router;


const router = new Router();


router.use(express.urlencoded({extend: true}));

router.use(cookieParser());

const filter = {__v: 0, password: 0};

router.post('/login', async (req, res) => {
  const {username, password} = req.body;
  if (!username || !password) {
    res.json({
      "code": 2,
      "msg": "用户输入不合法"
    });
    retrun;
  }
  try {
    const data = await Users.findOne({username, password: md5(password)}, filter);
    if (data) {
      res.cookie('userid', data.id, {maxAge: 1000 * 3600 * 24 * 7});
      res.json({
        "code": 0,
        data
      })
    } else {
      res.json({
        "code": 1,
        "msg": "用户名或密码错误"
      })
      
      
    }
  } catch (e) {
    res.json({
      "code": 3,
      "msg": "网络不稳定,请重新试试~"
    })
    
  }
  
  
})
router.post('/register', async (req, res) => {
  
  const {username, password, type} = req.body;
  
  console.log(username, password, type);
  if (!username || !password || !type) {
    res.json({
      "code": 2,
      "msg": "用户输入不合法"
    });
    retrun;
  }
  /*  Users.findOne({username})
   .then(data => {
   
   console.log(data);
   if (data) {
   
   return Promise.reject({
   "code": 1,
   "msg": "用户名已存在"
   
   });
   } else {
   console.log('111111111');
   return Users.create({username, password: md5(password), type})
   }
   })
   .catch(err => {
   if (!err.code) {
   err={
   "code": 3,
   "msg": "网络不稳定,请重新试试~"
   
   }
   }
   return Promise.reject(err)
   
   })
   .then(data => {
   data.json({
   code: 0,
   data: {
   _id: data.id,
   username: data.username,
   type: data.type
   }
   })
   
   })
   .catch(err => {
   if (!err.code) {
   err = {
   "code": 3,
   "msg": "网络不稳定,请重新试试"
   }
   }
   res.json(err);
   })*/
  
  try {
    const data = await Users.findOne({username});
    if (data) {
      
      res.json({
        "code": 1,
        "msg": "用户名已存在"
        
      });
    } else {
      
      const data = await  Users.create({username, password: md5(password), type})
      
      res.cookie('userid', data.id, {maxAge: 1000 * 3600 * 24 * 7})
      
      res.json({
        code: 0,
        data: {
          _id: data.id,
          username: data.username,
          type: data.type
        }
      })
      
      
    }
  } catch (e) {
    res.json({
      "code": 3,
      "msg": "网络不稳定,请重新试试"
    })
  }
})

// 更新用户信息的路由
router.post('/update', (req, res) => {
  // 从请求的cookie得到userid
  const userid = req.cookies.userid
  // 如果不存在, 直接返回一个提示信息
  if (!userid) {
    return res.json({code: 1, msg: '请先登陆'})
  }
  // 存在, 根据userid更新对应的user文档数据
  // 得到提交的用户数据
  const user = req.body // 没有_id
  Users.findByIdAndUpdate({_id: userid}, {$set: user})
    .then(oldUser => {
      if (!oldUser) {
        // 通知浏览器删除userid cookie
        res.clearCookie('userid')
        // 返回返回一个提示信息
        res.send({code: 1, msg: '请先登陆'})
      } else {
        // 准备一个返回的user数据对象
        const {_id, username, type} = oldUser
        const data = Object.assign({_id, username, type}, user)
        // 返回
        res.json({code: 0, data})
      }
    })
    .catch(error => {
      // console.error('登陆异常', error)
      res.send({code: 3, msg: '网络不稳定, 请重新尝试'})
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
  UserModel.findOne({_id: userid}, filter)
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
      res.send({code: 3, msg: '网络不稳定, 请重新试试'})
    })
})
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

router.get('/msglist', async (req, res) => {
  // 从请求的cookie得到userid
  const {userid} = req.cookies;
  // 如果不存在, 直接返回一个提示信息
  if (!userid) {
    return res.json({code: 1, msg: '请先登陆'})
  }
  try {
    const chatMsgs = await Messages.find({$or: [{from: userid}, {to: userid}]}, {__v: 0});
    const result = await Users.find();
    let users = {};
    result.forEach(item => {
      
      users[item._id] = {
        usersname: item.username,
        header: item.header
        
      }
    })
    
    res.json({code: 0, data: {chatMsgs, users}});
  }
  catch (e) {
    res.json({"code": 3, "msg": "网络不稳定,请重新试试"});
  }
})
router.post('/redmsg',(req,res)=>{
  const from=req.body.from
const to=req.cookies.userid
  Messages.update({from,to,read:false},{$set:{read:true}},{multi:true})
    .then(doc=>{
      console.log('/readmsg',doc)
      res.send({code:0,data:doc.nModified})
  
    })
  
    .catch(error=>{
      console.error('查看消息列表异常',error)
      res.send({code:1,msg:'查看消息列表异常,请重新尝试'})
    })
  
})
module.exports = router;
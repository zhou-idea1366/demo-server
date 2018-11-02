/*
 用户登陆的路由组件
 */

import React,{Component} from 'react';
import {NavBar,Button,List,InputItem,WingBlank,WhiteSpace} from 'antd-mobile';

import Logo from '../logo';

import {reqLogin} from '../../api';

class Login extends Component {
  state = {
    username:'',
    password :'',
  };

  handleChange = (name,val) => {
    //更新状态
    this.setState ({
      [name]:val
    })
  };

  login = async () => {
    //获取表单数据
    const {username,password} = this.state;
    //发送ajax请求
    const data = await reqLogin({username,password});
    console.log(data);

  };

  goRegister = () => {
    //跳转到注册页面，编程式导航
    this.props.history.replace('/register');

  };

  render () {
     return(
         <div>
           <NavBar>硅谷直聘</NavBar>
           <Logo />
           <WingBlank>
             <List >
               <WhiteSpace size="lg" />
               <InputItem placeholder="请输入用户名" onChange={val => this.handleChange('username',val)}>用户名：</InputItem>
               <WhiteSpace size="lg" />
               <InputItem placeholder="请输入密码" type="password" onChange={val => this.handleChange('password',val)}>密&nbsp;&nbsp;&nbsp;码：</InputItem>
               <WhiteSpace size="lg" />

               <Button type="primary" onClick={this.login}>登录</Button>
               <WhiteSpace size="lg" />
               <Button onClick={this.goRegister}>还没有账户</Button>

             </List>

           </WingBlank>
         </div>
     )
  }
}
export default Login;
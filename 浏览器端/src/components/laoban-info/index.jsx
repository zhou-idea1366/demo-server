import React,{Component} from 'react';
import {NavBar,InputItem,TextareaItem,Button} from 'antd-mobile';
import PropTypes from 'prop-types';

import HeaderSelector from '../header-selector';

class LaobanInfo extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    updateUserInfo: PropTypes.func.isRequired
  }
  state = {
    header:'',
    info:'',
    post:'',
    salary:'',
    company:''
  }

  handleChange = (name,val) => {
    this.setState ({
      [name]:val
    })
  }

  setHeader = header => {
    this.setState ({
      header
    })
  }

  saveUserInfo = () => {
    this.props.updateUserInfo(this.state);
  }

  render () {
    const {msg} = this.props.user;
    return (
        <div>
          <NavBar>老板信息完善</NavBar>
          <HeaderSelector setHeader={this.setHeader}/>
          {msg ? <p className="err-msg">{msg}</p> : ''}
          <InputItem oncChange={val => this.handleChange('post',val)}>招聘职位:</InputItem>
          <InputItem oncChange={val => this.handleChange('company',val)}>公司名称:</InputItem>
          <InputItem oncChange={val => this.handleChange('salary',val)}>职位薪资:</InputItem>
          <TextareaItem title="职位要求" rows={3} oncChange={val => this.handleChange('info',val)}/>
          <Button type="primary" onClick={this.saveUserInfo}>保 存</Button>
        </div>
    )
  }
}

export default LaobanInfo;
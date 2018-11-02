import React,{Component} from 'react';
import {Grid, List} from 'antd-mobile';
import PropTypes from 'prop-types';

class HeaderSelector extends Component {
  static propTypes = {
    setHeader:PropTypes.func.isRequired
  }

  state = {
    icon:null
  }

  setHeader = ({icon, text}) => {
    //更新自身组件的状态
    this.setState ({
      icon
    })
    //更新父组件的状态
    this.props.setHeader(text);
  }

  render () {
    const {icon} = this.state;

    const headerUI = icon ? <div>新头像<img src={icon}/></div> : '请选择头像';

    const data = Array.from(new Array(20)).map((item,index) => ({
      //通过require 将图片资源动态加载进来
      icon:require(`./avatars/头像${index + 1}.png`),
      text:`头像${index + 1}`
    }));

    return (
        <List renderHeader={() => headerUI}>
          <Grid data={data} columnNum={5} onClick={this.setHeader}/>
        </List>
    )
  }
}
export default HeaderSelector;
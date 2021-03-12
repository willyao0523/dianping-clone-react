import React, { Component } from 'react';
import SearchBox from './components/SearchBox'
import PopularSearch from './components/PopularSearch'
import SearchHistory from './components/SearchHistory'
import {
  actions as searchActions,
  getPopularKeywords,
  getRelatedKeywords,
  getInputText,
  getHistoryKeywords
} from '../../redux/modules/search'
import {connect} from 'react-redux'
import {bindActionCreators} from "redux"

class Search extends Component {
  render() {
    const {inputText, relatedKeywords, popularKeywords,historyKeywords} = this.props
    return (
      <div>
        <SearchBox 
          inputText={inputText} 
          relatedKeywords={relatedKeywords} 
          onChange={this.handleChangeInput}
          onClear={this.handleClearInput}
          onCancel={this.handleCancel}
          onClickItem={this.handleClickItem}
        />
        <PopularSearch
          data={popularKeywords}
          onClickItem={this.handleClickItem}
        />
        <SearchHistory 
          data = {historyKeywords}
          onClickItem = {this.handleClickItem}
          onClear = {this.handleClearHistory}
        />
      </div>
    );
  }

  componentDidMount() {
    const {loadPopularKeywords} = this.props.searchActions
    loadPopularKeywords()
  }
  componentWillUnmount() {
    const {clearInputText} = this.props.searchActions
    clearInputText()
  }

  // 搜索框发生变化
  handleChangeInput = text => {
    
    const {setInputText, loadRelatedKeywords} = this.props.searchActions
    setInputText(text)
    loadRelatedKeywords(text)
  }

  // 清楚搜索框文本
  handleClearInput = () => {
    const {clearInputText} = this.props.searchActions
    clearInputText()
  }

  // 取消搜索
  handleCancel = () => {
    this.handleClearInput()
    this.props.history.goBack()
  }

  // 处理关键词的逻辑
  handleClickItem = (item) => {
    const {setInputText, addHistoryKeywords, loadRelatedShops} = this.props.searchActions
    setInputText(item.keyword)
    addHistoryKeywords(item.id)
    loadRelatedShops(item.id)
    // 跳转到搜索页面逻辑
    this.props.history.push("/search_result")
  }

  // 清楚历史记录
  handleClearHistory = () => {
    const {clearHistoryKeywords} =  this.props.searchActions
    clearHistoryKeywords()
  }

}

const mapStateToProps = (state, props) => {
  return {
    relatedKeywords: getRelatedKeywords(state),
    inputText: getInputText(state),
    popularKeywords: getPopularKeywords(state),
    historyKeywords: getHistoryKeywords(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    searchActions: bindActionCreators(searchActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
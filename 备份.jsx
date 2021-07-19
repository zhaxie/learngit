/* eslint-disable class-methods-use-this */
import React from 'react'
import { Tabs, Tooltip, Icon } from 'antd'
import classname from 'classnames'
// import permissionsHandler from '@component/permissions'
import { getQueryParamsBySearch } from '@util/function'
// import BreadcrumbList from '../../../../component/breadcrumb/breadcrumb'
import RouterBreadcrumb from '@platform/priceManage/components/breadcrumb/main'
import AdjustByCinema from './components/adjustByCinema'
import AdjustByCity from './components/adjustByCity'
import './app.less'

// import PriceRulesModal from '../priceDetails/components/priceRulesModal/index.jsx'

const { TabPane } = Tabs

const StatEnum = {
  ADJUSTBYCITY: '1', // 按城市调价
  ADJUSTBYCINEMA: '2', // 按影院调价
}

const StatLabel = {
  ADJUSTBYCITY: '按城市调价',
  ADJUSTBYCINEMA: '按影院调价',
}

// @permissionsHandler
class PriceRules extends React.Component {
  constructor(props) {
    super(props)

    const state = {
      type: StatEnum.ADJUSTBYCITY,
      visible: false, //  modal-test
      operatorId: getQueryParamsBySearch(props.location.search, 'operatorId'),
      ruleType:
        Number(getQueryParamsBySearch(props.location.search, 'ruleType')) || 0,
      businessType: Number(
        getQueryParamsBySearch(props.location.search, 'businessType')
      ),
    }

    const breadcrumbBaseList = this.getBreadcrumbBaseList(state) // 基础面包屑（前面的几个）
    const finalBreadCrumbList = this.getFinalBreadCrumbListByType(state.type) // 最后一个面包屑（会根据tab变化）

    state.breadcrumbList = [...breadcrumbBaseList, ...finalBreadCrumbList]

    this.state = state
    this.breadcrumbBaseList = breadcrumbBaseList
  }

  onChange(key) {
    this.setState({
      type: key,
      breadcrumbList: [
        ...this.breadcrumbBaseList,
        ...this.getFinalBreadCrumbListByType(key),
      ],
    })
  }

  // 获取基础的面包屑导航
  getBreadcrumbBaseList = (state) => {
    const { ruleType, businessType } = state

    return [
      {
        name: '价格管理',
      },
      {
        name: ['通用规则设置', '专用规则设置'][ruleType],
      },
      {
        name: ['', '新增订座票', '新增电子票'][businessType],
      },
    ]
  }

  // 最后一个面包屑
  getFinalBreadCrumbListByType = (type) => {
    const finalBreadCrumb =
      type === StatEnum.ADJUSTBYCITY
        ? {
            name: '按城市调价',
          }
        : {
            name: '按影院调价',
          }

    return [finalBreadCrumb]
  }

  render() {
    const { operatorId, ruleType, businessType, breadcrumbList } = this.state // modal-test

    return (
      <div className={classname('price-rules')}>
        {/* 面包屑导航 */}
        <RouterBreadcrumb list={breadcrumbList}></RouterBreadcrumb>
        <div className="price-rules-tabs">
          {/*  */}
          <Tabs activeKey={this.state.type} onChange={this.onChange.bind(this)}>
            <TabPane
              tab={
                <>
                  <span>{StatLabel.ADJUSTBYCITY}</span>
                  <Tooltip title="按城市定价，若城市有新增影院，则自动沿用所属城市的定价规则">
                    <Icon
                      type="info-circle"
                      theme="filled"
                      style={{ marginLeft: '5px' }}
                    />
                  </Tooltip>
                </>
              }
              key={StatEnum.ADJUSTBYCITY}
            ></TabPane>
            <TabPane
              tab={StatLabel.ADJUSTBYCINEMA}
              key={StatEnum.ADJUSTBYCINEMA}
            ></TabPane>
          </Tabs>
          {/*  */}
          {this.state.type === StatEnum.ADJUSTBYCITY && (
            <AdjustByCity
              operatorId={operatorId}
              ruleType={ruleType}
              businessType={businessType}
            />
          )}
          {this.state.type === StatEnum.ADJUSTBYCINEMA && (
            <AdjustByCinema
              operatorId={operatorId}
              ruleType={ruleType}
              businessType={businessType}
            />
          )}
        </div>
      </div>
    )
  }
}

export default PriceRules

import React, { Children, Component } from 'react'
import { TreeData } from '../types/tree'
import TreeNode from './TreeNode'
import { getChildren } from '../api'
import './index.less'

type Props = {
  data: TreeData
}

type State = {
  data: TreeData
}

type KeyToNodeMap = {
  [key: string]: TreeData
}

export default class Tree extends Component<Props, State> {
  data: TreeData
  keyToNodeMap: KeyToNodeMap
  constructor(props: Props) {
    super(props)
    this.data = props.data
    this.state = { data: props.data }
  }

  componentDidMount() {
    this.buildKeyMap()
  }

  buildKeyMap = () => {
    let data = this.data
    this.keyToNodeMap = {}
    this.keyToNodeMap[data.key] = data
    if (data.children && data.children.length > 0) {
      this.walk(data.children, data)
    }
  }

  walk = (children: Array<TreeData>, parent: TreeData): void => {
    children.map((item: TreeData) => {
      item.parent = parent
      this.keyToNodeMap[item.key] = item
      if (item.children && item.children.length > 0) {
        this.walk(item.children, item)
      }
    })
  }

  onCollapse = async (key: string) => {
    const data = this.keyToNodeMap[key]
      // 1. 利用对象的引用地址特性更新data
      // 2. 进而会更新到state.data
      // 3. 然后setState，从而达到更新视图的目的
    this.setState({ data: this.state.data })
    if(data) {
      const { children } = data
      if(children) {
        data.collapsed = !data.collapsed
        this.setState({ data: this.state.data });
      } else {
        data.loading = true
        this.setState({ data: this.state.data })
        try {
          const result = await getChildren(data)
          if(result.code === 0) {
            data.children = result.data
            data.collapsed = false
            data.loading = false
            this.buildKeyMap()
            this.setState({ data: this.state.data })
          }
        } catch (e) {
          alert('请求数据出错')
          data.loading = false
          this.setState({ data: this.state.data })
        }
      }
    }
  }

  onCheck = (key: string) => {
    const data = this.keyToNodeMap[key]
    if(data) {
      data.checked = !data.checked
      this.checkChildren(data.children, data.checked)
      this.checkParent(data.parent, data.checked)
      this.setState({data: this.state.data})
    }
  }

  checkChildren = (children: Array<TreeData>, checked: boolean) => {
    if(children) {
      children?.forEach((item: TreeData) => {
        item.checked = checked
        if(item.children && item.children.length > 0) {
          this.checkChildren(item.children, checked)
        }
      })
    }
  }

  checkParent = (parent: TreeData, checked: boolean) => {
    while(parent) {
      if(checked) { //若父节点为未选中，则需要所有的子节点都被选中
        parent.checked = parent.children.every((item: TreeData) => item.checked)
      } else {
        parent.checked = false
      }
      parent = parent.parent
    }
  }

  render() {
    return (
      <div className='tree'>
        <div className='tree-nodes'>
          <TreeNode
            onCheck={this.onCheck}
            onCollapse={this.onCollapse}
            data={this.props.data} />
        </div>
      </div>
    )
  }
}

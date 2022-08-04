import React, { Component } from 'react'
import { TreeData } from '../types/tree'
import TreeNode from './TreeNode'
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

  onCollapse = (key: string) => {
    const data = this.keyToNodeMap[key]
    if(data) {
      data.collapsed = !data.collapsed
      data.children = data.children || []
      // 利用对象的引用地址特性更新data，进而会更新到state.data，然后重新给state，从而达到更新视图的目的
      console.log(this.state.data)
      console.log(this.keyToNodeMap)
      this.setState({ data: this.state.data });
    }
  }

  render() {
    return (
      <div className='tree'>
        <div className='tree-nodes'>
          <TreeNode
            onCollapse={this.onCollapse}
            data={this.props.data} />
        </div>
      </div>
    )
  }
}

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
  fromNode: TreeData
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
    this.state = { data: props.data, fromNode: null }
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
    this.setState({ data: this.data })
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
    if (data) {
      const { children } = data
      if (children) {
        data.collapsed = !data.collapsed
        this.setState({ data: this.state.data })
      } else {
        data.loading = true
        this.setState({ data: this.state.data })
        try {
          const result = await getChildren(data)
          if (result.code === 0) {
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
    if (data) {
      data.checked = !data.checked
      this.checkChildren(data.children, data.checked)
      this.checkParent(data.parent, data.checked)
      this.setState({ data: this.state.data })
    }
  }

  checkChildren = (children: Array<TreeData>, checked: boolean) => {
    if (children) {
      children?.forEach((item: TreeData) => {
        item.checked = checked
        if (item.children && item.children.length > 0) {
          this.checkChildren(item.children, checked)
        }
      })
    }
  }

  checkParent = (parent: TreeData, checked: boolean) => {
    while (parent) {
      if (checked) { //若父节点为未选中，则需要所有的子节点都被选中
        parent.checked = parent.children.every((item: TreeData) => item.checked)
      } else {
        parent.checked = false
      }
      parent = parent.parent
    }
  }

  setFromNode = (fromNode: TreeData) => {
    this.setState({ ...this.state, fromNode })
  }

  onMove = (toNode: TreeData) => {
    let { fromNode } = this.state
    let parent = toNode.parent
    // 判断目标节点是否在被移动节点内部，若在内部，则不予以移动
    let isContain = false
    while(parent) {
      if(parent.key === fromNode.key) {
        isContain = true
        return
      }
      parent = parent.parent
    }
    
    if(fromNode === toNode || isContain) return
    let fromChildren = fromNode.parent.children
    let toChildren = toNode?.parent?.children || [ toNode ] // 对目标节点为root节点进行处理
    let fromIndex = fromChildren.findIndex((item: TreeData) => item === fromNode)
    let toIndex = toChildren.findIndex(item => item === toNode)
    // 将被移动节点从原来的位置删除
    fromChildren.splice(fromIndex, 1)
    // 如果目标节点是文件夹，则将被移动节点插入到文件夹的最上面；如果目标文件是文件，则将目标节点插到文件的上面
    if(toNode.type === 'folder') {
      toNode.children = toNode.children || []
      toNode.children.unshift(fromNode)
      toNode.collapsed = false
    } else {
      toChildren.splice(toIndex, 0, fromNode)
    }
    this.buildKeyMap()
  }
  

  render() {
    return (
      <div className='tree'>
        <div className='tree-nodes'>
          <TreeNode
            onCheck={this.onCheck}
            onCollapse={this.onCollapse}
            onMove={this.onMove}
            setFromNode={this.setFromNode}
            data={this.props.data} />
        </div>
      </div>
    )
  }
}

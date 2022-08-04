import React, { Component } from 'react'
import { TreeData } from '../types/tree'
import fileIcon from '../assets/images/file.png'
import openFolderIcon from '../assets/images/opened-folder.png'
import closeFolderIcon from '../assets/images/closed-folder.png'


type Props = {
  data: TreeData
  onCollapse: (key: string) => void
}

export default class TreeNode extends Component<Props> {
  render() {
    const { data: { key, name, children, type, collapsed }, onCollapse } = this.props
    let caret, icon;
    if (type === "file") {
      icon = fileIcon
    } else {
      caret = (
        <span className={`collapse ${collapsed ? 'caret-right' : 'caret-down'}`}
          onClick={() => onCollapse(key)}
        />
      )
      icon = collapsed ? closeFolderIcon : openFolderIcon
    }
    return (
      <div className='tree-node'>
        <div className='inner'>
          {caret}
          <span className='content'>
            <img src={icon} style={{ width: 20 }} />
            <span>{name}</span>
          </span>
        </div>
        {
          (children && children.length > 0 && !collapsed) && (
            <div className='children'>
              {
                children.map((item: TreeData) => (
                  <TreeNode key={item.key} data={item} onCollapse={onCollapse}/>
                ))
              }
            </div>
          )
        }
      </div>
    )
  }
}

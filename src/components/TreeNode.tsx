import React, { Component } from 'react'
import { TreeData } from '../types/tree'
import fileIcon from '../assets/images/file.png'
import openFolderIcon from '../assets/images/opened-folder.png'
import closeFolderIcon from '../assets/images/closed-folder.png'
import loadingSrc from '../assets/images/loading.gif';


type Props = {
  data: TreeData
  onCollapse: (key: string) => void
  onCheck: (key: string) => void
}

export default class TreeNode extends Component<Props> {
  render() {
    const { data: { key, name, children, type, collapsed = false, checked = false, loading = false }, onCollapse, onCheck } = this.props
    let caret, icon;
    if (type === "file") {
      icon = fileIcon
    } else {
      caret = loading ? <img className="collapse" src={loadingSrc} style={{ width: 14, top: '50%', marginTop: -7 }}/> : (
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
            <input type="checkbox" checked={checked} onChange={() => { onCheck(key) }}/>
            <img src={icon} style={{ width: 20 }} />
            <span>{name}</span>
          </span>
        </div>
        {
          (children && children.length > 0 && !collapsed) && (
            <div className='children'>
              {
                children.map((item: TreeData) => (
                  <TreeNode key={item.key} data={item} onCollapse={onCollapse} onCheck={onCheck}/>
                ))
              }
            </div>
          )
        }
      </div>
    )
  }
}

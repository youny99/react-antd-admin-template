import React, { Component } from "react";
import { Menu, Icon } from "antd";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import menuList from "@/config/menuConfig";
const SubMenu = Menu.SubMenu;
class Meun extends Component {
  state = {
    menuTreeNode: null,
    openKey: "",
  };

  // filterMenuItem用来根据配置信息筛选可以显示的菜单项
  filterMenuItem = (item) => {
    const { roles } = item;
    const { role, name } = this.props;
    if (name === "admin" || !roles || roles.includes(role)) {
      return true;
    } else if (item.children) {
      // 如果当前用户有此item的某个子item的权限
      return !!item.children.find((child) => roles.includes(child.role));
    }
    return false;
  };
  // 菜单渲染
  getMenuNodes = (menuList) => {
    // 得到当前请求的路由路径
    const path = this.props.location.pathname;

    return menuList.reduce((pre, item) => {
      if (this.filterMenuItem(item)) {
        if (!item.children) {
          // // 判断item是否是当前对应的item
          // if (item.key === path || path.indexOf(item.key) === 0) {
          //   // 更新redux中的headerTitle状态
          //   this.props.setHeadTitle(item.title);
          // }

          pre.push(
            <Menu.Item key={item.path}>
              <Link
                to={item.path}
                // onClick={() => this.props.setHeadTitle(item.title)}
              >
                {item.icon ? <Icon type={item.icon} /> : null}
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          );
        } else {
          // 查找一个与当前请求路径匹配的子Item
          const cItem = item.children.find(
            (cItem) => path.indexOf(cItem.path) === 0
          );
          // 如果存在, 说明当前item的子列表需要打开
          if (cItem) {
            this.setState({
              openKey: item.path,
            });
          }

          // 向pre添加<SubMenu>
          pre.push(
            <SubMenu
              key={item.path}
              title={
                <span>
                  {item.icon ? <Icon type={item.icon} /> : null}
                  <span>{item.title}</span>
                </span>
              }
            >
              {this.getMenuNodes(item.children)}
            </SubMenu>
          );
        }
      }

      return pre;
    }, []);
  };

  componentWillMount() {
    const menuTreeNode = this.getMenuNodes(menuList);
    this.setState({
      menuTreeNode,
    });
  }
  render() {
    const path = this.props.location.pathname;
    const openKey = this.state.openKey;
    return (
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[path]}
        defaultOpenKeys={[openKey]}
      >
        {this.state.menuTreeNode}
      </Menu>
    );
  }
}

export default connect((state) => state.user)(withRouter(Meun));

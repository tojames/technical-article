import React, { Component } from "react";

import { connect } from "dva";
import { Button } from "antd";

class Products extends Component {
  state = {};
  addProdust = () => {
    const { dispatch } = this.props;
    let newObj = { name: "华为Watch", value: 2500, id: 3 };
    dispatch({
      type: "products/add",
      payload: newObj,
    });
  };
  addProdustAsync = () => {
    const { dispatch } = this.props;
    let newObj = { name: "ihphone12", value: 6000, id: 4 };
    dispatch({
      type: "products/addAsync",
      payload: newObj,
    });
  };
  addProdustAsync2 = () => {
    const { dispatch } = this.props;
    let newObj = { name: "小米12", value: 5000, id: 5 };
    dispatch({
      type: "products/addAsync2",
      payload: newObj,
    });
  };
  deleteItem = (id) => {
    console.log(id, "id");
    const { dispatch } = this.props;
    dispatch({
      type: "products/delete",
      payload: id,
    });
  };
  render() {
    console.log("render", this.props);
    let produstList = this.props.produstList;
    let produstView = produstList.map((item, index) => (
      <div key={index + item.value}>
        {item.name}---{item.value}
        <Button onClick={() => this.deleteItem(item.id)}>删除</Button>
      </div>
    ));
    return (
      <div>
        <Button onClick={this.addProdust}>新增产品</Button>
        <Button onClick={this.addProdustAsync}>新增产品Async</Button>
        <Button onClick={this.addProdustAsync2}>新增产品Async2</Button>

        {produstView}
      </div>
    );
  }
}

let mapStateToProps = (state) => ({ produstList: state.products.produstList });

// export default connect(mapStateToProps)(ProductsContainer);
export default connect(mapStateToProps)(Products);

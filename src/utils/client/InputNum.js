import React from "react";
import { InputNumber, Select } from "antd";

const { Option } = Select;
const selectBefore = (
  <Select
    defaultValue="add"
    style={{
      width: 60,
    }}
  >
    <Option value="add">+</Option>
    <Option value="minus">-</Option>
  </Select>
);
const selectAfter = (
  <Select
    defaultValue="EUR"
    style={{
      width: 60,
    }}
  >
    <Option value="USD">$</Option>
    <Option value="EUR">€</Option>
    <Option value="GBP">£</Option>
    <Option value="CNY">¥</Option>
  </Select>
);

const InputNum = () => {
  return (
    <InputNumber
      addonBefore={selectBefore}
      addonAfter={selectAfter}
      defaultValue={6}
    />
  );
};
export default InputNum;

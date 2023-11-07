import React, { useState } from "react";
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from "antd";

const originData = [];
for (let i = 0; i < 13; i++) {
  originData.push({
    key: i.toString(),
    provider_name: `Edward ${i}`,
    cif: 'B234234',
    invoice_date: '12.03.2023',
    invoice_number: '12312313',
    tax: '43%',
    base_amount: '324',
    tax_amount: '2342',
    total: '2666'
  });
}
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  // record,
  // index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const table = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: "Nombre del proveedor",
      dataIndex: "provider_name",
      width: "15%",
      editable: true,
      align: 'center'
    },
    {
      title: "CIF",
      dataIndex: "cif",
      width: "10%",
      editable: true,
      align: 'center'
    },
    {
      title: "Fecha de la factura",
      dataIndex: "invoice_date",
      width: "10%",
      editable: true,
      align: 'center'
    },
    {
      title: "Número de factura",
      dataIndex: "invoice_number",
      width: "15%",
      editable: true,
      align: 'center'
    },
    {
      title: "Impuesto(%)",
      dataIndex: "tax",
      width: "8%",
      editable: true,
      align: 'center'
    },
    {
      title: "Cantidad base",
      dataIndex: "base_amount",
      width: "15%",
      editable: true,
      align: 'center'
    },
    {
      title: "Importe del impuesto",
      dataIndex: "tax_amount",
      width: "10%",
      editable: true,
      align: 'center'
    },
    {
      title: "Total",
      dataIndex: "total",
      width: "10%",
      editable: true,
      align: 'center'
    },
    {
      title: "Editar",
      dataIndex: "operation",
      align: 'center',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Guardar
            </Typography.Link>
            <Popconfirm title="Segura de cancelar?" onConfirm={cancel}>
              <a>Cancelar</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Editar
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        size="middle"
        scroll={{ y: 300 }}
        style={{margin: 20}}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};
export default table;

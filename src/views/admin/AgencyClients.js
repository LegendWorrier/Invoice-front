import React, { useEffect, useRef, useState } from 'react';
import { Col, Row, Table, Button, Space, notification, InputNumber } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
// import {  useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import Input from '@mui/material/Input';

import TextField from '@mui/material/TextField';

import axios from 'axios';
import serverconfig from '../../config';
import { v4 as uuidv4 } from 'uuid';
import Papa from 'papaparse';
import { Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

// const { Search } = Input;

// const onSearch = (value) => console.log(value);

const AgencyClients = () => {
  // const navigate = useNavigate();

  const [data, setData] = useState('');
  const [name, setName] = useState('');
  const [cif, setCIF] = useState('');
  const [cuota, setCuota] = useState(6);
  const [consumo, setConsumo] = useState(0.2);
  const [bankAccount, setBankAccount] = useState('');
  const [license, setLicense] = useState('');
  const [contactName, setContactName] = useState('');
  const [id, setID] = useState('');
  const [phone, setPhone] = useState('');
  const [mail, setMail] = useState('');
  const [handleData, setHandleData] = useState('')

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios.get(serverconfig.API_URL + 'api/users/clientlist').then((res) => {
      console.log(res);
      let data = res.data.data;
      for (let i = 0; i < data.length; i++) {
        data[i]['key'] = uuidv4();
        data[i]['no'] = i + 1;
        // data[i]['users'] = '1' + i;
        data[i]['profile'] = 'Perfil';
      }
      setData(data);
      setHandleData(data)
    });
  };

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const searchInput = useRef(null);

  const tableRef = useRef(null);
  const workbook = new Excel.Workbook();
  const curTable = [];

  const onName = (e) => {
    setName(e.target.value);
  };

  const onCIF = (e) => {
    setCIF(e.target.value);
  };

  const onCuota = (value) => {
    setCuota(value);
  };

  const onMail = (e) => {
   
    setMail(e.target.value);
      
  };
  const onPhone = (e) => {
    setPhone(e.target.value);
  };
  const onID = (e) => {
    setID(e.target.value);
  };
  const onLicense = (e) => {
    setLicense(e.target.value);
  };
  const onContactName = (e) => {
    setContactName(e.target.value);
  };
  const onConsumo = (value) => {
    setConsumo(value);
  };
  const onBankAccount = (e) => {
    setBankAccount(e.target.value);
  };

  function  handleFileUpload(file) {
    const reader = new FileReader();
  
    reader.onload = async function () {
      const csvData = reader.result;
      const parsedData = Papa.parse(csvData, { header: true });
  
      // Use the 'parsedData' object containing the CSV data

      console.log(parsedData.data);
      notification.success({
        description: 'Registro exitoso!',
        placement: 'bottomRight',
        duration: 2 // Duration in seconds (optional)
      });
      parsedData.data.map(async ind => {
        let a = ind
        console.log('ret', ind)
 
        await axios.post(serverconfig.API_URL + 'api/users/add_agency', a)
        getData();
      })
        // console.log('setuser', tmp.customization.userData)
        // setUserData(tmp.customization.userData)
      
      



    };
  
    reader.readAsText(file);
  }

  const onSave = () => {
    if (name == '' || cif == '' || bankAccount == '' || license == '' || contactName == '' || phone == '' || mail == '') {
      return notification.warning({
        description: 'Tienes que cumplir con todos los campos de valor.',
        placement: 'bottomRight',
        duration: 2
      });
    } else {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/;

      if (!emailRegex.test(mail)) {
        // Display error message or perform other actions
        return notification.warning({
          description: 'Please enter a valid email address.',
          placement: 'bottomRight',
          duration: 2
        });
      } else {
        // Email is valid, perform other actions if needed
        axios
        .post(serverconfig.API_URL + 'api/users/add_agency', {
          name: name,
          cif: cif,
          consumption: consumo,
          fee: cuota,
          bankAccount: bankAccount,
          license: license,
          contactName: contactName,
          id: id,
          phone: phone,
          mail: mail
        })
        .then(() => {
          getData();
          notification.success({
            description: ' Guardar éxito!',
            placement: 'bottomRight',
            duration: 2
          });
        })
        .catch((err) => {
          console.log(err);
        });
      }


    }
  };

  // const onDelete = () => {
  //   if (value == '') {
  //     notification.warning({
  //       description: 'Campo de entrada!',
  //       placement: 'bottomRight',
  //       duration: 2
  //     });
  //   } else {
  //     notification.success({
  //       description: 'Eliminar éxito!',
  //       placement: 'bottomRight',
  //       duration: 2
  //     });
  //   }
  // };


  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    let i =0;
    let handleTmp = []
    if(!selectedKeys[0]){
      handleTmp = handleData
      handleTmp.map(one => {
        one.no = i + 1
        i++
      })
      setData(handleTmp)

    } else {
      handleData.map(ind => {
        if(ind[dataIndex] == selectedKeys[0]){
          handleTmp.push(ind)
        }
      })
      handleTmp.map(one => {
        one.no = i + 1
        i++
      })
      console.log('handle', handleTmp)
      setData(handleTmp)
    }
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <Row
        style={{
          padding: 8
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block'
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90
            }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90
            }}
          >
            reiniciar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filtrar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            cerca
          </Button>
        </Space>
      </Row>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined
        }}
      />
    ),
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  });

  const exportToExcel = async () => {
    const tableElement = tableRef.current; // Access the table element

    // Access the table data
    const tableData = Array.from(tableElement.getElementsByTagName('tr')).map((row) =>
      Array.from(row.getElementsByTagName('td')).map((cell) => cell.innerText)
    );

    for (let i = 1; i < tableData.length; i++) curTable.push(tableData[i]);

    try {
      const worksheet = workbook.addWorksheet('agency');
      worksheet.columns = columns;
      worksheet.columns.forEach((column) => {
        column.width = 20;
        column.alignment = { horizontal: 'center' };
      });
      curTable.forEach((singleData) => {
        worksheet.addRow(singleData);
      });
      const buf = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buf]), `agency.xlsx`);
      notification.success({
        description: 'Éxito de exportación!',
        placement: 'bottomRight',
        duration: 2 // Duration in seconds (optional)
      });
    } catch (e) {
      console.log(e);
      notification.error({
        description: 'Exportación fallida!',
        placement: 'bottomRight',
        duration: 2 // Duration in seconds (optional)
      });
    }

    console.log('ttt', tableData); // Perform desired operations with the table data
  };
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      align: 'center'
    },
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      width: '10%',
      ...getColumnSearchProps('id')
    },
    {
      title: 'nombre',
      dataIndex: 'name',
      align: 'center',
      width: '20%',
      ...getColumnSearchProps('name')
    },
    {
      title: 'CIF/DNI',
      dataIndex: 'cif',
      align: 'center',
      ...getColumnSearchProps('cif')
    },
    {
      title: 'Usuarias',
      dataIndex: 'userNum',
      align: 'center'
    },

    {
      title: 'Perfil del cliente',
      dataIndex: 'profile',
      align: 'center',
      render: (text, record) => (
        <Link to={'/dashboard/admin/agency_profile/' + data[record.no-1]._id}>{text}</Link>
      )
      },

  ];



  return (
    <>
      <Row justify="space-between">
        <Col span={12}>
          <h2>Lista de Agencias</h2>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table 
          ref={tableRef} 
          columns={columns} 
          dataSource={data} rowKey="no" size="middle" />
          <Row align="center" style={{ marginTop: 20 }}>
            <Button type="primary" size="large" onClick={exportToExcel}>
              Exportar
            </Button>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <h2>Agencias de datos</h2>
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth value={name} onChange={onName} label="Nombre" variant="standard" />
        </Col>
        <Col span={8} align="center">
          <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Col span={12}>
              <div>Cuota mensual</div>
            </Col>
            <Col span={6}>
              <InputNumber min={6} max={100000} defaultValue={6} value={cuota} onChange={onCuota} />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth value={cif} onChange={onCIF} label="CIF/DNI" variant="standard" />
        </Col>
        <Col span={8} align="center">
          <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Col span={12}>
              <div>Consumo por página</div>
            </Col>
            <Col span={6}>
              <InputNumber min={0.2} max={100000} defaultValue={0.2} value={consumo} onChange={onConsumo} />
            </Col>
          </Row>
          {/* <TextField id="standard-basic" fullWidth  label="Consumo por página" variant="standard" /> */}
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField id="standard-basic" value={bankAccount} onChange={onBankAccount} fullWidth label="Cuenta Bancaria" variant="standard" />
        </Col>
        <Col span={8} align="center">
          <TextField id="standard-basic" value={license} onChange={onLicense} fullWidth label="Número de Licencia" variant="standard" />
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField
            id="standard-basic"
            value={contactName}
            onChange={onContactName}
            fullWidth
            label="Nombre de Contacto"
            variant="standard"
          />
        </Col>
        <Col span={8} align="center">
          <TextField id="standard-basic" value={id} onChange={onID} fullWidth label="Agencia ID" variant="standard" />
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField id="standard-basic" value={phone} onChange={onPhone} fullWidth label="Teléfono" variant="standard" />
        </Col>
        <Col span={8} align="center">
          {/* <TextField id="standard-basic" fullWidth  label="Cuota Mensual" variant="standard" /> */}
          <Button type="primary">Restablecer Licencia</Button>
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <Input id="standard-basic"  value={mail} onChange={onMail} fullWidth label="Mail" variant="standard" />
        </Col>
        <Col span={8} align="center"></Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}>
          <Button type="primary">Enviar Mail</Button>
        </Col>
        <Col span={8}>
          <div>Total documentos en este ano : 0</div>
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}>
          <Button type="primary">Enviar Notificatioin</Button>
        </Col>
        <Col span={8}>
          <div>Total documentos en este mes : 0</div>
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}>
          <Button type="primary">Crear evento</Button>
        </Col>
        <Col span={8}></Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}>
          <Button type="primary">Crear alarma</Button>
        </Col>
        <Col span={8}></Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}></Col>
        <Col span={8}></Col>
      </Row>
      <Row justify="space-evenly">
         <Upload beforeUpload={handleFileUpload} showUploadList={false}>
            <Button type="primary" icon={<UploadOutlined />}>Upload CSV File</Button>

          </Upload>
        <Button type="primary" onClick={onSave}>
        Guardar
        </Button>
      </Row>
    </>
  );
};

export default AgencyClients;

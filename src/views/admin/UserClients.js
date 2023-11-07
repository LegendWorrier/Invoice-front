import React, { useRef, useState, useEffect } from 'react';
import { Col, Row, Input, Table, Button, Space, notification, InputNumber } from 'antd';
// import { UserOutlined } from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
// import { DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import serverconfig from '../../config';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import {Select, MenuItem} from '@mui/material'
import { Upload } from 'antd';
import Papa from 'papaparse';
import { UploadOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';


const UserClients = ({wholeState}) => {
  const [Fname, setFname] = useState('');
  const [lname, setLname] = useState('');

  const [cif, setCIF] = useState('');
  const [email, setEmail] = useState('');
  const [irpf, setIrpf] = useState('');
  // const [agency, setAgency] = useState('');
  const [tax, setTax] = useState('');
  const [license, setLicense] = useState('');
  const [contactName1, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [clientInfo, setClientInfo] = useState([])
  const [selectedValue, setSelectedValue] = useState('');

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [data, setData] = useState('');
  // const [value, setValue] = useState('');
  const [handleData, setHandleData] = useState('')
  const [cuota, setCuota] = useState(6);
  const [consumo, setConsumo] = useState(0.2);

  const searchInput = useRef(null);

  const tableRef = useRef(null);
  const workbook = new Excel.Workbook();
  const curTable = [];
  // const navigate = useNavigate(); 

 
  
  const onName = (e) => {
    setFname(e.target.value);
  };
  const onLname = (e) => {
    setLname(e.target.value);
  };
  
  const onCIF = (e) => {
    setCIF(e.target.value);
  };

  const onTax = (e) => {
    setTax(e.target.value);
  };
  const onPhone = (e) => {
    setPhone(e.target.value);
  };
  const onLicense = (e) => {
    setLicense(e.target.value);
  };
  const onContactName = (e) => {
    setContactName(e.target.value);
  };
  const onEmail = (e) => {
    setEmail(e.target.value);
  };
  const onIrpf = (e) => {
    setIrpf(e.target.value);
  };
  // const onAgency = (e) => {
  //   setAgency(e.target.value);
  // };

  useEffect(() => {
    // setLoading(false);
    getData();
  }, []);

  const getData =  async () => {
  const users =  await axios.get(serverconfig.API_URL + 'api/users/userlist')
  const invoices = await axios.get(serverconfig.API_URL + 'api/users/invoicelist')
  const clients = await axios.get(serverconfig.API_URL + 'api/users/getclients')

      let data = users.data;
      let annual = 0, month = 0;
      const endDate = new Date();

      for (let i = 0; i < data.length; i++) {
        data[i]['key'] = uuidv4();
        data[i]['no'] = i + 1;

        // let v = data[i]['ageny_id'].id
        data[i]['agency'] = data[i]['agency_id'].id
        console.log('egege', data[i]['agency'])

        data[i]['profile'] = 'Perfil';
        for(let j = 0;j < invoices.data.length; j ++){

          if(invoices.data[j].UserId == data[i]._id && new Date(endDate.getFullYear(), endDate.getMonth() -12, endDate.getDate())<new Date(invoices.data[j].Date)){
            annual ++;
          }
          if(invoices.data[j].UserId == data[i]._id && new Date(endDate.getFullYear(), endDate.getMonth() -1, endDate.getDate())<new Date(invoices.data[j].Date)){
            month ++;
          }
        }
        data[i]['anual'] = parseFloat(annual * data[i]['consumption']).toFixed(2);
        data[i]['mensual'] = (month * data[i]['consumption']).toFixed(2);
        annual = 0
        month = 0
      }
      setData(data);
    setClientInfo(clients.data)

      setHandleData(data);
      // setRows(res.data);
  };

  const onSave = () => {
    if (Fname == '' || lname == '' || cif == '' || selectedValue == '' || email == '' || phone == '' || contactName1 == ''
    || license == '' || tax == '') {
      return notification.warning({
        description: 'Tienes que cumplir con todos los campos de valor.',
        placement: 'bottomRight',
        duration: 2
      });
    } else {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/;

      if (!emailRegex.test(email)) {
        // Display error message or perform other actions
        return notification.warning({
          description: 'Please enter a valid email address.',
          placement: 'bottomRight',
          duration: 2
        });
      } else {
        console.log('afafea', selectedValue)
        axios
          .post(serverconfig.API_URL + 'api/users/add_user', {
            fname: Fname,
            lname: lname,
            cif: cif,
            agency: selectedValue,
            irpf: irpf,
            email: email,
            phone: phone,
            contactName: contactName1,
            license: license,
            consumption: consumo,
            fee: cuota,
            // agency: agency,
            tax: tax
          })
          .then(( ) => {
            let tmp = {client: selectedValue,
              user: Fname + ' ' + lname + ' acaba de registrarse!'}
          wholeState.customization.socket.emit('Add User', (tmp))
            getData();
            notification.success({
              description: ' Guardar éxito!',
              placement: 'bottomRight',
              duration: 2 // Duration in seconds (optional)
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
  //       duration: 2 // Duration in seconds (optional)
  //     });
  //   } else {
  //     notification.success({
  //       description: ' Guardar éxito!',
  //       placement: 'bottomRight',
  //       duration: 2 // Duration in seconds (optional)
  //     });
  //   }
  // };
  
  // let tmpData;
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    // confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
    console.log('selectedKeys', selectedKeys, dataIndex)
    // tmpData = data
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

  const onCuota = (value) => {
    setCuota(value);
  };
  const onConsumo = (value) => {
    setConsumo(value);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
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
        let a= ind

       let ret = await axios.post(serverconfig.API_URL + 'api/users/register1', a)
       if(ret.data){
        let tmp = {client: ind.agency_id,
            user: ind.fname + ' ' + ind.lname + ' acaba de registrarse!'}
        wholeState.customization.socket.emit('Add User', (tmp))

       }
       getData()


      })
        // console.log('setuser', tmp.customization.userData)
        // setUserData(tmp.customization.userData)
      
      



    };
  
    reader.readAsText(file);
  }
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
            Reiniciar
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
      saveAs(new Blob([buf]), `user.xlsx`);
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
      align: 'center',
      width: '5%'
    },
    {
      title: 'Agencia',
      dataIndex: 'agency',
      align: 'center',
      width: '25%',
      ...getColumnSearchProps('agency')
    },
    {
      title: 'Nombre',
      dataIndex: 'fname',
      align: 'center',
      width: '15%',
      ...getColumnSearchProps('fname')
    },
    {
      title: 'CIF/DNI',
      dataIndex: 'cif',
      align: 'center',
      width: '15%',
      ...getColumnSearchProps('cif')
    },
    {
      title: 'Contador de cargas anuales',
      dataIndex: 'anual',
      align: 'center',
      width: '15%'
    },
    {
      title: 'Contador de subidas mensuales',
      dataIndex: 'mensual',
      align: 'center',
      width: '15%'
    },
    // {
    //   title: 'Perfil del cliente',
    //   dataIndex: 'profile',
    //   align: 'center',
    //   width: '10%',
    //   // render: (text) => <Link to="#">{text}</Link>
    //   onCell: (record, rowIndex) => ({
    //     onClick: () => {
    //       console.log('Clicked Row:', record.no, data[record.no-1]._id);
    //       navigate('/dashboard/admin/user_profile/' + data[record.no-1]._id);
    //     }
    //   })
    // },
    {
      title: 'Perfil del cliente',
      dataIndex: 'profile',
      align: 'center',
      render: (text, record) => (
        <Link to={'/dashboard/admin/user_profile/' + data[record.no-1]._id}>{text}</Link>
      )
      },

  ];
  return (
    <>
      <Row justify="space-between">
        <Col span={12}>
          <h2>Lista de usuarios</h2>
        </Col>
        <Col span={12}></Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table columns={columns} ref={tableRef} dataSource={data} size="middle" />
        </Col>
        <Col span={24}>
          <Row align="center" style={{ marginTop: 20 }}>
            <Button type="primary" size="large" onClick={exportToExcel}>
              Exportar
            </Button>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <h2>Crear Usuario Nuevo</h2>
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}>
          <TextField id="standard-basic" value={Fname} onChange={onName} fullWidth label="nombre de pila" variant="standard" />
        </Col>
        <Col span={8}>
          <TextField id="standard-basic" value={lname} onChange={onLname} fullWidth label="apellido" variant="standard" />
        </Col>

      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}>
          <TextField id="standard-basic" value={tax} onChange={onTax} fullWidth label="Impuesto" variant="standard" />
        </Col>
        <Col span={8}>
          <TextField id="standard-basic" value={cif} onChange={onCIF} fullWidth label="CIF/DNI" variant="standard" />
        </Col>

      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}>
          <TextField id="standard-basic" value={irpf} onChange={onIrpf} fullWidth label="IRPF" variant="standard" />
        </Col>
        <Col span={8}>
          <TextField
            id="standard-basic"
            value={contactName1}
            onChange={onContactName}
            fullWidth
            label="Nombre de contacto"
            variant="standard"
          />
        </Col>

      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}>
          <TextField id="standard-basic" value={license} onChange={onLicense} fullWidth label="Número de licencia" variant="standard" />
        </Col>
        <Col span={8}>
          <TextField id="standard-basic" value={phone} onChange={onPhone} fullWidth label="Contacto telefonico" variant="standard" />
        </Col>
        
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}>
          <TextField id="standard-basic" value={email} onChange={onEmail} fullWidth label="Contacto de correo" variant="standard" />
        </Col>
        <Col span={8}>
        <Select
            fullWidth
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedValue}
            onChange={(event) => setSelectedValue(event.target.value)}
          >
          {clientInfo.map((client) => (
            <MenuItem key={client._id} value={client._id}>
              {client.id}
            </MenuItem>
          ))}

        </Select>
          {/* <TextField id="standard-basic" value={agency} onChange={onAgency} fullWidth label="Agencia Relacionada" variant="standard" /> */}

          {/* <TextField id="standard-basic" fullWidth label="Restablecer licencia" variant="standard" /> */}
        </Col>

      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>

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
        <Col span={8}>
          <div>Contador de subidas mensuales : 0</div>
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>

        <Col span={8} align="center">
          <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Col span={12}>
              <div>Consumo por página</div>
            </Col>
            <Col span={6}>
              <InputNumber min={0.2} max={100000} defaultValue={0.2} value={consumo} onChange={onConsumo} />
            </Col>
          </Row>
        </Col>
        <Col span={8}  style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div>Contador de subidas año : 0</div>
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}>
          <Button type="primary">Enviar notificación</Button>
        </Col>
        <Col span={8}>
          <Button type="primary">Enviar correo</Button>
        </Col>
        
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}>
          <Button type="primary">Crear evento</Button>
        </Col>
        <Col span={8}>
          <Button type="primary">Restablecer licencia</Button>
        </Col>
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

const mapStateToProps = (state) => ({
  wholeState: state,
});
export default connect(mapStateToProps)(UserClients);

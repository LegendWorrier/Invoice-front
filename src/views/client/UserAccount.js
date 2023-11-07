import React, { useRef, useState, useEffect } from 'react';
import { Row, Col, Input, Table, Button, Space, notification, InputNumber } from 'antd';
// import DatePicker from '../../utils/client/DatePicker';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './common.css'
import TextField from '@mui/material/TextField';
import axios from 'axios'
import serverconfig from '../../config';
// import { SetMeal, SettingsEthernet } from '@mui/icons-material';
import { setUserData } from '../../store/actions'
import { Upload } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import Papa from 'papaparse';
// import { stringify } from 'csv-stringify';
// const onSearch = (value) => console.log(value);

// import { Parser } from 'json2csv';

const UserAccount = ({wholeState, setUserData}) => {
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([1]);
  const [userData, setUser1Data] = useState(wholeState.customization.userData)
  // const [select, setSelect] = useState(0);
  const pageSize = 30;
  const [currentPage, setCurrentPage] = useState(1);

  const [fname, setFname] = useState('')
  const [lname, setLname] = useState('')
  const [cif, setCif] = useState('')
  const [iva, setIva] = useState('')
  const [irpf, setIrpf] = useState('')
  const [pwd, setPwd] = useState('')
  const [license, setLicense] = useState('')
  const [email, setEmail] = useState('')
  const [cuota, setCuota] = useState(6);
  const [consumo, setConsumo] = useState(0.2);
  useEffect(() => {
    if( wholeState != undefined){
      let i =1;
      let wholeUser = []
      setUser1Data(wholeState.customization.userData)
      console.log('ctable',wholeState)

      wholeState.customization.userData.map(index =>{
          wholeUser.push({
            _id: index.user._id,
            key: i + '',
            id: i + '',
            name: index.user.fname + ' ' + index.user.lname,
            cif: index.user.cif,
            email: index.user.email,
            profile: 'profil'
          })
          i++;
      })
      console.log('whole', wholeUser)
      setData(wholeUser)
      i = 0
    }
  },[wholeState])


  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const tableRef = useRef(null);
  const workbook = new Excel.Workbook();
  const curTable = [];

  function convertJsonArrayToCsv(jsonArray, fileName) {
    let csvContent = '';
  
    // Extract header from the keys of the first object in the array
    const header = Object.keys(jsonArray[0]);
    csvContent += header.join(',') + '\n';
  
    // Extract values from each object and convert them to a comma-separated string
    jsonArray.forEach((obj) => {
      const row = Object.values(obj).map(value => JSON.stringify(value));
      csvContent += row.join(',') + '\n';
    });
  
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);
  
    // Create a download link and simulate a click event to trigger the download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    // Clean up the temporary URL
    URL.revokeObjectURL(url);
  }
  
  // Example usage
  // const jsonArray = [
  //   { name: 'John', age: 30, city: 'New York' },
  //   { name: 'Alice', age: 25, city: 'London' },
  //   { name: 'Bob', age: 35, city: 'Paris' }
  // ];
  
  // const fileName = 'output.csv';
  // convertJsonArrayToCsv(jsonArray, fileName);

  function  handleFileUpload(file) {
    const reader = new FileReader();
  
    reader.onload = async function () {
      const csvData = reader.result;
      const parsedData = Papa.parse(csvData, { header: true });
  
      // Use the 'parsedData' object containing the CSV data

      console.log(parsedData.data);
      let tmp = wholeState
      notification.success({
        description: 'Registro exitoso!',
        placement: 'bottomRight',
        duration: 2 // Duration in seconds (optional)
      });
      parsedData.data.map(async ind => {
        let a= ind
        a.agency_id = wholeState.customization.auth._id
        let ret = await axios.post(serverconfig.API_URL + 'api/users/register1', a)
        console.log('ret', ret)
        tmp.customization.userData.push({invoice: [], user:ret.data})
        setUserData(tmp.customization.userData)

      })
        // console.log('setuser', tmp.customization.userData)
        // setUserData(tmp.customization.userData)
      
      



    };
  
    reader.readAsText(file);
  }

  const onCuota = (value) => {
    setCuota(value);
  };
  const onConsumo = (value) => {
    setConsumo(value);
  };

 const downloadData = () => {
  axios.get(serverconfig.API_URL + 'api/users/getWholeUser').then(res => {
    console.log('res',res)
    if(res.data.status == 'success'){
      let temp = []
      res.data.data.map(index => {
        temp.push({
          fname : index.fname,
          lname : index.lname,
          email : index.email,
          cif : index.cif,
          iva :  index.iva,
          irpf : index.irpf,
          anual : index.anual,
          mensual : index.mensual,
          agency_id : index.agency_id,
          password : index.password,
          date : index.date,
          license : index.license,
        })
      })
      convertJsonArrayToCsv(temp, 'downloadUser.csv')

      notification.success({
        description: 'Registro exitoso!',
        placement: 'bottomRight',
        duration: 2 // Duration in seconds (optional)
      });
    }
    if(res.data.status == 'false'){
      notification.error({
        description: 'Some errors!',
        placement: 'bottomRight',
        duration: 2 // Duration in seconds (optional)
      });
      return;
    }
  })



 }
  // const  registerUser = async (data) => {
  //  let res = await axios.post(config.API_URL + 'api/users/register1', data)
  //  console.log('res', res)

  // }
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
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
  const onChange = () => {
    if(fname == '' || lname == '' || cif == '' || iva == '' || email == '' || irpf == '' ||
    pwd == '' || license == ''){
       return notification.warning  ({
          description: 'Tienes que cumplir con todos los campos de valor.',
          placement: 'bottomRight',
          duration: 2 // Duration in seconds (optional)
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
          let data ={
            fname: fname,
            lname: lname,
            cif: cif,
            iva: iva,
            email: email,
            irpf: irpf,
            password: pwd,
            consumption: consumo,
            fee: cuota,
            license: license,
            agency_id: wholeState.customization.auth._id
          }
          console.log('who', data)
          axios
            .post(serverconfig.API_URL + 'api/users/register1', data)
            .then((res) => {
              notification.success({
                description: 'Registro exitoso!',
                placement: 'bottomRight',
                duration: 2 // Duration in seconds (optional)
              });
              console.log('olo', wholeState)
              let tmp = wholeState;
              tmp.customization.userData.push({invoice: [],user:res.data})
              console.log('aaa', tmp.customization)
              setUserData(tmp.customization.userData)
              // navigate('/auth/login');
            })
            .catch(() =>
              notification.error({
                description: 'Registro fallida!',
                placement: 'bottomRight',
                duration: 2 // Duration in seconds (optional)
              })
            );
        }
      }

  }

  // const licenseChange = (e) => {
  //   setLicense(e.target.value)
  // }
  const changeField = (e, field) => {
    switch(field){
      case 'fname':
        setFname(e.target.value)
        break;
      case 'lname':
        setLname(e.target.value)
        break;
      case 'email':
        setEmail(e.target.value)
        break;
      case 'cif':
        setCif(e.target.value)
        break;
      case 'iva':
        setIva(e.target.value)
        break;
      case 'irpf':
        setIrpf(e.target.value)
        break;
      case 'pwd':
        setPwd(e.target.value)
        break;
      case 'license':
        setLicense(e.target.value)
        break;
    }
  }
  const rowClassName = (record) => {
    return selectedRowKeys.includes(record.id) ? 'selected-row' : '';
  };
  const handleRowClick = (record) => {
    console.log('handleclick', record.id)
    
    setSelectedRowKeys([record.id]);
    // setSelect(parseInt(record.id)-1)
    setLicense(userData[record.id-1].user.license)
  }
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };
  const paginationConfig = {
    pageSize,
    current: currentPage,
    total: data.length,
    showSizeChanger: false,
    pageSizeOptions: ['20', '30'], 
    showTotal: (total) => `Total ${total} elementos`,
    onShowSizeChange: (current, size) => handleChangePageSize(size),
  };
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
  const  columns = [
      {
        title: 'No',
        dataIndex: 'id',
        align: 'center',
        // width:10%
      },
      {
        title: 'Nombre',
        dataIndex: 'name',
        align: 'center',
        width: '30%',
        ...getColumnSearchProps('name')
      },
      {
        title: 'CIF/DNI',
        dataIndex: 'cif',
        align: 'center',
        width: '30%',
        ...getColumnSearchProps('cif')
      },
      // {
      //   title: 'Usuarias',
      //   dataIndex: 'users',
      //   align: 'center'
      // },
      {
        title: 'Correo electrónico',
        dataIndex: 'email',
        align: 'center',
        // render: (text) => <Link to="#">Perfil</Link>
  
      },
      {
        title: 'Perfil del cliente',
        dataIndex: 'profile',
        align: 'center',
        render: (text, record) => 
        (
           <Link to={'/dashboard/client/editprofile/' +  data[record.id-1]._id}>{text}</Link>
  
        )
      },
    ];
  
  return (
    <>

      <Row>
        <Col offset={10} span={6}>
          <h2>Crear Usuario Nuevo</h2>
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}>
          <TextField id="standard-basic"  value={fname} onChange={(e) =>changeField(e, 'fname')} fullWidth label="Nombre" variant="standard" />
        </Col>
        <Col span={8}>
          <TextField id="standard-basic"  value={lname} onChange={(e) =>changeField(e, 'lname')} fullWidth label="apellido" variant="standard" />
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}>
          <TextField id="standard-basic"  value={cif} onChange={(e) =>changeField(e, 'cif')} fullWidth label="CIF/DNI" variant="standard" />
        </Col>
        <Col span={8}>
          <TextField id="standard-basic"  value={email} onChange={(e) =>changeField(e, 'email')} fullWidth label="Correo electronico" variant="standard" />
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}>
          <TextField id="standard-basic" value={irpf} onChange={(e) =>changeField(e, 'irpf')} fullWidth label="IRPF" variant="standard" />
        </Col>
        <Col span={8}>
          <TextField id="standard-basic"  value={iva} onChange={(e) =>changeField(e, 'iva')} fullWidth label="IVA" variant="standard" />
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}>
          <TextField id="standard-basic" value={pwd} onChange={(e) =>changeField(e, 'pwd')} fullWidth label="contraseña" variant="standard" />
        </Col>
        <Col span={8}>
          <TextField id="standard-basic"  value={license} onChange={(e) =>changeField(e, 'license')} fullWidth label="license" variant="standard" />
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
      <Row justify="space-evenly">
        <Col span={3}></Col>
        <Col span={5}>
        <Button onClick={onChange} type="primary">Guardar</Button>

        </Col>
        <Col span={6}>
          <Upload beforeUpload={handleFileUpload} showUploadList={false}>
            <Button type="primary" icon={<UploadOutlined />}>Upload CSV File</Button>

          </Upload>
        </Col>
        <Col span={8}>
        <Button type="primary" onClick={downloadData} icon={<DownloadOutlined />}>Descargar Plantilla para Importar</Button>
        </Col>

      </Row>
      <br />
      <Row justify="space-between" style={{ marginTop: 120 }}>
        <Col span={8}></Col>
        <Col span={8}></Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table 
          columns={columns} 
          ref={tableRef} 
          dataSource={data} 
          size="middle" 

          pagination={paginationConfig}
          rowClassName={rowClassName}
          onChange={handleTableChange}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          />
          <Row align="center">
            <Button type="primary" size="large" onClick={exportToExcel}>
              Exportar
            </Button>
          </Row>
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = (state) => ({
  wholeState: state,
});

export default connect(mapStateToProps, {setUserData})(UserAccount);
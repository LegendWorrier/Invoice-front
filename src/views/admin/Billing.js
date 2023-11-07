import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Table, Space,  Button, Input, Radio } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

// import Usage from '../../utils/chart/Usage';
// import Consumption from '../../utils/chart/Consumption';

// import Profit from '../../utils/chart/Profit';
// import Cost from '../../utils/chart/Cost';

import axios from 'axios';
import serverconfig from '../../config';
import { v4 as uuidv4 } from 'uuid';
import './common.css'
const Billing = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  // const [sumfee, setSumfee] = useState('');
  // const [sumcon, setSumcon] = useState('');
  const [data, setData] = useState('');
  // const [select, setSelect] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([1]);

  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [handleData, setHandleData] = useState('')
  const [value, setValue] = useState(12);

  useEffect(() => {
    getData();

  }, []);

  // const getWholeFeeAndConsumption = (period) => {
  //   for (let i = 0; i < data.length; i++) {
  //     axios.post(config.API_URL + 'api/users/getbills', { period: '1', agency: data[i]['id'] }).then((one) => {
  //       setData(data);
  //       data[i]['consumption'] = (one.data * data[i]['consumption']).toFixed(1) + '€';
  //       console.log('one', one.data);
  //       sum += (one.data * data[i]['consumption']).toFixed(1);
  //     });
  //   }
  // };

  const getData = async () => {
    let data
    const result = await axios.get(serverconfig.API_URL + 'api/users/getclients')
    data = result.data    
    console.log('dtat', data) 
    // let fee = 0;
    let curDate = new Date()
    
    for (let i = 0; i < data.length; i++) {
      data[i]['key'] = uuidv4();
      data[i]['no'] = i + 1;
      let date = new Date(curDate.getFullYear(), curDate.getMonth()-12)
      let year = date.getFullYear();
      let month = (date.getMonth() + 1).toString().padStart(2, '0');
      let formattedDate1 = `${year}-${month}`;

      year = curDate.getFullYear();
      month = (curDate.getMonth() + 1).toString().padStart(2, '0');
      const formattedDate2 = `${year}-${month}`;

      data[i]['period'] = formattedDate1 + ' - ' + formattedDate2;

      const userPermonth = await axios.post(serverconfig.API_URL + 'api/users/getusers', {agency_id: data[i]['_id'] });
      let cnt1 = 0, cnt2 =0

      data[i]['quotapermonth'] = userPermonth.data
      
      
      const consumPermonth = await axios.post(serverconfig.API_URL + 'api/users/getbills', {agency_id: data[i]['_id'] });
      console.log('response', consumPermonth.data);
      data[i]['consumptionpermonth'] = consumPermonth.data
      for( let j =0; j< 12; j ++){
        cnt1 += data[i]['consumptionpermonth'][j]
        cnt2 += data[i]['quotapermonth'][j]
      }
      data[i]['quota'] = data[i]['fee'] * cnt2 + '€';
      data[i]['consumptionfee'] = parseFloat(data[i]['consumption'])
      data[i]['consumption'] = (parseFloat(data[i]['consumption']) * cnt1).toFixed(1) + '€';
      console.log('one', data[i]['consumption'])
    }
    console.log('client',  data[0]['id'] )
    // let sum = 0
    console.log('whole', data)
    // setSelect('0')
    setData(data)
    setHandleData(data)
  };
  const handleRowClick = (record) => {
    console.log('handleclick', record.key)
    
    setSelectedRowKeys([record.no]);
    setSelect(parseInt(record.no)-1)
  }

  const rowClassName = (record) => {
    return selectedRowKeys.includes(record.no) ? 'selected-row' : '';
  };
  // const rowStyle = (record) => {
  //   return selectedRowKeys.includes(record.key) ? { background: 'yellow' } : {};
  // };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    // console.log('aaaaa', selectedKeys, dataIndex);
    // confirm();
    // setSearchText(selectedKeys[0]);
    // for (let i = 0; i < data.length; i++) {
    //   console.log('abbbb');
    //   if (data[i]['id'] == selectedKeys[0]) {
    //     console.log('agency', data[i]);
    //   }
    // }

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
  const paginationConfig = {
    pageSize,
    current: currentPage,
    total: data.length,
    showSizeChanger: false,
    pageSizeOptions: ['5', '10', '15'], 
    showTotal: (total) => `Total ${total} elementos`,
    onShowSizeChange: (current, size) => handleChangePageSize(size),
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

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      align: 'center'
    },
    {
      title: 'Agencia',
      dataIndex: 'id',
      align: 'center',
      width: '30%',
      ...getColumnSearchProps('id')
    },
    {
      title: 'Período',
      dataIndex: 'period',
      align: 'center',
      // ...getColumnSearchProps('period')
    },
    {
      title: 'consumo(€)',
      dataIndex: 'consumption',
      align: 'center'
    },
    {
      title: 'cuota(€)',
      dataIndex: 'quota',
      align: 'center'
    }
  ];
  const handleChangePageSize = (value) => {
    setPageSize(value);
    setCurrentPage(1); // Reset to the first page when changing page size
  };
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };
  // const handleRowSelection = (selectedRowKeys, selectedRows) => {
  //   console.log('Selected Row Keys:', selectedRowKeys);
  //   console.log('Selected Rows:', selectedRows);
  // };
  const onChange = (e) => {
     
      let tem_data = handleData
      let endDate = new Date()
      console.log('handle', handleData)
      for(let i = 0; i< handleData.length; i++){
        let consumption = 0.0, fee = 0.0
        for(let j =0; j<e.target.value; j++){
          
            consumption += parseFloat((handleData[i]['consumptionpermonth'][j] * handleData[i]['consumptionfee']).toFixed(2));
            fee += parseFloat((handleData[i]['quotapermonth'][j] * handleData[i]['fee']).toFixed(2))
            console.log('data', parseFloat((handleData[i]['consumptionpermonth'][j] * handleData[i]['consumptionfee']).toFixed(2)))

        }
      
        let date = new Date(endDate.getFullYear(), endDate.getMonth()-e.target.value)
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let formattedDate1 = `${year}-${month}`;
  
        year = endDate.getFullYear();
        month = (endDate.getMonth() + 1).toString().padStart(2, '0');
        let formattedDate2 = `${year}-${month}`;
  
        tem_data[i]['period'] = formattedDate1 + ' - ' + formattedDate2;
        tem_data[i]['consumption'] = consumption.toFixed(1)
        tem_data[i]['quota'] = fee.toFixed(1)
      }
      // setData(tem_data)
    setValue(e.target.value);
  };
  return (
    <>
      <Row>
       <Col span={24}>
          <Row justify="center" style={{ marginBottom: 20 }}>
            <Radio.Group onChange={onChange} value={value}>
              <Radio value={1}>1 Ultimo Mes</Radio>
              <Radio value={3}>3 mes</Radio>
              <Radio value={6}>6 mes</Radio>
              <Radio value={12}>1 año </Radio>
            </Radio.Group>
          </Row>
          <Table
            columns={columns}
            dataSource={data}
            size="middle"
            pagination={paginationConfig}
            rowClassName={rowClassName}
            onChange={handleTableChange}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
          />
          
        </Col>
      </Row>
      {/* <Row justify="center">
        <Col span={12}>
          <Row justify="center">
          <h1>Gráfico de Consumo</h1>
          </Row>
          <Usage wholeData={data} select = {select}/>
        </Col>
        <Col span={12} >
          <Row justify="center">
          <h1>Gráfico de Cuotas</h1>
          </Row>
          <Consumption wholeData={data} select = {select}/>
        </Col>
      </Row> */}

      {/* <Row>
        <Col span={12} style={{ alignItems: 'center' }}>
          <h1>Gráficos de beneficios</h1>
          <Profit />
        </Col>
        <Col span={12} style={{ alignItems: 'center' }}>
          <h1>Gráficos de costos</h1>
          <Cost />
        </Col>
      </Row> */}
    </>
  );
};

export default Billing;

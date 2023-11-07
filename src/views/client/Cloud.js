import { SearchOutlined } from '@ant-design/icons';
import React, { useRef, useState, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table, Row, Select, notification } from 'antd';
import Excel from 'exceljs';
import { DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import serverconfig from '../../config';
import { saveAs } from 'file-saver';

import { connect } from 'react-redux';

let wholeClientData = []

const Cloud = ({wholeState}) => {

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  // const [period, setPeriod] = useState('')
  const [data, setData] = useState()
  const [wholeData, setWholeData] = useState()
  const searchInput = useRef(null);
  const [selVal, setSelVal] = useState('Current quarter')
  // const [quarter, setQuarter] = useState()
  const columns1 = [
    { header: 'Uploaded Date', key: 'Date' },
    
    { header: 'ProviderName', key: 'ProviderName' },
    { header: 'InvoiceNumber', key: 'InvoiceNumber' },

    { header: 'ProviderCIF', key: 'ProviderCIF' },
    { header: 'TaxAmount', key: 'TaxAmount' },
    { header: 'TaxRate', key: 'TaxRate' },
    { header: 'TotalAmount', key: 'TotalAmount' },

  ];

  useEffect(() => {
    // if( wholeState != undefined){
    //   console.log('whoelstea', wholeState)
    //   let i =1;
    //   let wholeInvoice = []
    //   wholeState.customization.userData.map(index =>{
    //     index.invoice.map(one => {
    //       wholeInvoice.push({
    //         key: i + '',
    //         id: i + '',
    //         name: index.user.fname + ' ' + index.user.lname,
    //         cif: index.user.cif,
    //         tax_amount: one.TaxAmount.replace(/€/g, "") + "€",
    //         base_amount: one.BaseAmount.replace(/€/g, "") + "€",
    //         total: one.TotalAmount.replace(/€/g, "") + "€",
    //         time: one.Date,
    //         FileName: one.FileName
    //       })
    //       i++
    //     })
    //   })
    //   setData(wholeInvoice)
    //   console.log('ctable',wholeInvoice)
    //   i = 0
    // }
    getCurrentQuarter()
    getData()
    setWholeData( wholeState.customization.userData)

  },[wholeState])

  const getCurrentQuarter = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index
    console.log('eere')
    if (currentMonth >= 1 && currentMonth <= 3) {
      // setQuarter(1)
      setSelVal('1st quarter')
      return 1;
    } else if (currentMonth >= 4 && currentMonth <= 6) {
      // setQuarter(2)
      
      setSelVal('2nd quarter')

      return 2;
    } else if (currentMonth >= 7 && currentMonth <= 9) {
      // setQuarter(3)

      setSelVal('3rd quarter')

      return 3;
    } else {
      setSelVal('4th quarter')
      // setQuarter(4)

      return 4;
    }
  }

  const getData = () => {
    let allInvoice = []
    axios.post(serverconfig.API_URL + 'api/users/getdownload')
      .then((res) => {
        console.log('res', res.data.data, wholeState.customization.auth._id)
        res.data.data.map((inx, count) => {
          if(inx.ClientId == wholeState.customization.auth._id){
            const month = new Date(inx.Date).getMonth() + 1; // Months are zero-based, so we add 1
            const day = new Date (inx.Date).getDate();
            const year = new Date (inx.Date).getFullYear();

            const formattedDate = `${month}/${day}/${year}`;
            allInvoice.push({
              key: (count + 1) + '',
              invoices: inx.InvoiceFiles,
              id: formattedDate,
              name: inx.name,
              cif: inx.cif,
              tax_amount: inx.tax_amount + " €",
              base_amount: inx.base_amount + " €",
              total: inx.total + " €",
              date: inx.Date
            })
          }

        })
        wholeClientData =allInvoice
        allInvoice = []
        wholeClientData.map((inx, count) => {
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          const startMonthOfQuarter = Math.floor(currentMonth / 3) * 3;
        const startDate = new Date(currentDate.getFullYear(), startMonthOfQuarter, 1);
          console.log('data', inx.date)
          if(startDate<new Date(inx.date)){
            
            allInvoice.push({
              key: (count + 1) + '',
              invoices: inx.invoices,
              id: inx.id,
              name: inx.name,
              cif: inx.cif,
              tax_amount: inx.tax_amount + " €",
              base_amount: inx.base_amount + " €",
              total: inx.total + " €",
            })
          }
        })
       setData(allInvoice)


        
      })

  }

  const tableRef = useRef(null);
  const workbook = new Excel.Workbook();
  const curTable = [];

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    let allInvoice
    if(value == 'month'){
      // setQuarter(1)
      allInvoice = []
      wholeClientData.map((inx, count) => {
        const currentDate =new Date()

      const startDate = new Date(currentDate.getFullYear(), 0, 1);
      const endDate = new Date(currentDate.getFullYear(), 3, 1);
        console.log('data', inx.date)
        if(startDate<new Date(inx.date) && new Date(inx.date) < endDate){
          
          allInvoice.push({
            key: (count + 1) + '',
            invoices: inx.invoices,
            id: inx.id,
            name: inx.name,
            cif: inx.cif,
            tax_amount: inx.tax_amount + " €",
            base_amount: inx.base_amount + " €",
            total: inx.total + " €",
          })
        }
      })
      setData(allInvoice)

    }else if(value == 'quarter'){
      // setQuarter(2)
      allInvoice = []
      wholeClientData.map((inx, count) => {
        const currentDate =new Date()

      const startDate = new Date(currentDate.getFullYear(), 3, 1);
      const endDate = new Date(currentDate.getFullYear(), 6, 1);
        console.log('data', inx.date)
        if(startDate<new Date(inx.date) && new Date(inx.date) < endDate){
          
          allInvoice.push({
            key: (count + 1) + '',
            invoices: inx.invoices,
            id: inx.id,
            name: inx.name,
            cif: inx.cif,
            tax_amount: inx.tax_amount + " €",
            base_amount: inx.base_amount + " €",
            total: inx.total + " €",
          })
        }
      })
      setData(allInvoice)

    }else if(value == 'semester'){
      console.log('aaaaa', wholeClientData)
      // setQuarter(3)
      allInvoice = []
      wholeClientData.map((inx, count) => {
      const currentDate =new Date()
      const startDate = new Date(currentDate.getFullYear(), 6, 1);
      const endDate = new Date(currentDate.getFullYear(), 9, 1);
        console.log('data', inx.date)
        if(startDate<new Date(inx.date) && new Date(inx.date) < endDate){
          
          allInvoice.push({
            key: (count + 1) + '',
            invoices: inx.invoices,
            id: inx.id,
            name: inx.name,
            cif: inx.cif,
            tax_amount: inx.tax_amount + " €",
            base_amount: inx.base_amount + " €",
            total: inx.total + " €",
          })
        }
      })
      setData(allInvoice)

    }else if(value == 'annual'){
      // setQuarter(4)
      allInvoice = []
      wholeClientData.map((inx, count) => {
        const currentDate =new Date()

      const startDate = new Date(currentDate.getFullYear(), 9, 1);
      const endDate = new Date(currentDate.getFullYear() + 1, 0, 1);
        console.log('data', inx.date)
        if(startDate<new Date(inx.date) && new Date(inx.date) < endDate){
          
          allInvoice.push({
            key: (count + 1) + '',
            invoices: inx.invoices,
            id: inx.id,
            name: inx.name,
            cif: inx.cif,
            tax_amount: inx.tax_amount + " €",
            base_amount: inx.base_amount + " €",
            total: inx.total + " €",
          })
        }
      })
      setData(allInvoice)
    }
  };

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
  const exportXLSX = async (record) => {
    let tmpInvoices = [], i =1
    wholeData.map(index =>{
        console.log('whoelDate', record)
        
        index.invoice.map(invoice => {

          if(record.invoices.includes(invoice.FileName)){
            let tmp = invoice
            tmp.no = i
            i++
            tmpInvoices.push(tmp)
          }
        })
      
    })
    console.log('index',tmpInvoices)


    try {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet(1 + '');
      worksheet.columns = columns1;
      worksheet.columns.forEach((column) => {
        column.width = 20;
        column.alignment = { horizontal: 'center' };
      });
      // invoices.forEach((singleData) => {
      //   worksheet.addRow(singleData);
      // });
      tmpInvoices.forEach((singleData) => {
        worksheet.addRow(singleData);
      });

      const buf = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buf]), `client.xlsx`);
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
  }

  const handleExtractPDF = async (record) => {
    let  startDate
    console.log('quarter', record)

    let filesString = ''
    filesString = record.invoices
      const response = await axios.get(serverconfig.API_URL + 'download', {
        responseType: 'blob',
        params: {
          param1: startDate,
          param2: record.userId,
          param3: filesString
        }
      });


    const url = URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'invoice.pdf'; // Set the desired filename for the downloaded file
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);


  }

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
      saveAs(new Blob([buf]), `client.xlsx`);
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
      title: 'Date',
      dataIndex: 'id',
      align: 'center'
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      align: 'center',
      ...getColumnSearchProps('name')
    },
    {
      title: 'CIF/DNI',
      dataIndex: 'cif',
      key: 'cif',
      width: '20%',
      align: 'center',
      ...getColumnSearchProps('cif')
    },

    {
      title: 'Importe del impuesto',
      dataIndex: 'tax_amount',
      align: 'center'
    },
    {
      title: 'Cantidad base',
      dataIndex: 'base_amount',
      align: 'center'
    },
    {
      title: 'Total',
      dataIndex: 'total',
      align: 'center'
    },
    {
      title: 'PDF',
      dataIndex: 'pdf',
      align: 'center',
      render: (text, record) => (
        <Button type="primary" icon={<DownloadOutlined />} onClick={() => handleExtractPDF(record)}>
          PDF
        </Button>
      )
    },
    {
      title: 'XLS',
      dataIndex: 'xls',
      align: 'center',
      render: (text, record) => (
        <Button type="primary" icon={<DownloadOutlined />} onClick={() =>exportXLSX(record)}>
          XLS
        </Button>
      )
    }
  ];
  return (
    <>
      <Row style={{ marginBottom: 20 }}>
        <Select
          defaultValue={selVal}
          style={{ width: 180 }}
          onChange={handleChange}
          options={[
            { value: 'month', label: '1st quarter' },
            { value: 'quarter', label: '2nd quarter' },
            { value: 'semester', label: '3rd quarter' },
            { value: 'annual', label: '4th quarter' }
          ]}
        />
      </Row>

      <Table columns={columns} ref={tableRef} dataSource={data} />
      <Row align="center">
        <Button type="primary" disabled size="large" onClick={exportToExcel}>
          Exportar
        </Button>
      </Row>
    </>
  );
};
const mapStateToProps = (state) => ({
  wholeState: state,
});

export default connect(mapStateToProps)(Cloud);
// export default Cloud;

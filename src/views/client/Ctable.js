import { SearchOutlined } from '@ant-design/icons';
import React, { useRef, useState, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table, Row, notification, Select } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import { connect } from 'react-redux';
// import { Page, Text, Document, StyleSheet } from '@react-pdf/renderer';
import './common.css'
// import { jsPDF } from 'jspdf';
// import html2canvas from 'html2canvas';
// import XLSX from 'xlsx';
// import autoTable from 'jspdf-autotable'
import axios from 'axios';
import serverconfig from '../../config';

const Ctable = ({wholeState}) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  // const [period, setPeriod] = useState('')
  const [data, setData] = useState()
  // const [wholeData, setWholeData] = useState()
  const searchInput = useRef(null);

  // const [selName, setSelName] = useState()
  // const [selCif, setSelCif] = useState()
  // const [selTax, setSelTax] = useState()
  // const [selBase, setSelBase] = useState()
  // const [selTotal, setSelTotal] = useState()
  const [handleData, setHandleData] = useState('')
  // const [userInvoice, setUserInvoice] = useState(wholeState.customization.userData[0].invoice)
  // const [selPeriod, SetSelPeriod] = useState('annual');
  
  const columns1 = [
    { header: 'No', key: 'no' },
    { header: 'Proveedor', key: 'ProviderName' },
    { header: 'CIF/DNI Proveedor', key: 'ProviderCIF' },
    { header: 'Fecha', key: 'InvoiceDate' },
    { header: 'N Factura', key: 'InvoiceNumber' },
    { header: 'Impuesto Tasa', key: 'TaxRate' },
    { header: 'Base', key: 'BaseAmount' },
    { header: 'Imquestos', key: 'TaxAmount' },
    { header: 'Total', key: 'TotalAmount' }
  ];

  useEffect(() => {
    getData()
  },[wholeState])

  const getData = () => {
    if( wholeState != undefined){
      console.log('whoelstea', wholeState)
      let i =1;
      let wholeInvoice = []
      
      wholeState.customization.userData.map(index =>{
  
        let tax_amount = 0,base_amount = 0,total = 0
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const startMonthOfQuarter = Math.floor(currentMonth / 3) * 3;
        const startDate = new Date(currentDate.getFullYear(), startMonthOfQuarter, 1);
        
        index.invoice.map(one => {
          if(startDate < new Date(one.Date) && one.downloadFlag == false)
          {
            tax_amount += parseFloat(one.TaxAmount)
            base_amount += parseFloat(one.BaseAmount)
            total += parseFloat(one.TotalAmount)
          }
         
        })
       
        if(tax_amount != 0){
          wholeInvoice.push({
            key: i + '',
            id: i + '',
            name: index.user.fname + ' ' + index.user.lname,
            cif: index.user.cif,
            tax_amount: tax_amount.toFixed(2) + " €",
            base_amount: base_amount.toFixed(2) + " €",
            total: total.toFixed(2) + " €",
            userId: index.user._id
          })
          i++
          console.log('tatat',tax_amount, base_amount, total)
        }


      })
      setData(wholeInvoice)




      // setData(wholeInvoice)
      setHandleData(wholeInvoice)
      console.log('ctable',wholeInvoice)
      i = 0
    }
  }
  const tableRef = useRef(null);
  // const curTable = [];
  ////////////////////

useEffect(() => {
      // const element = document.getElementById('htmlElement'); // Replace 'htmlElement' with the ID of the HTML element you want to extract
      // element.style.visibility = 'hidden'; // Hide the element initially
    }, [])
// const handleExtractXLSX = (record) => {
//   console.log('record', record)
//   setSelName(record.name)
//   setSelCif(record.cif)
//   setSelTax(record.tax_amount)
//   setSelBase(record.base_amount)
//   setSelTotal(record.total)
//   setTimeout(exportXLSX, 500)

// }

const handleExtractPDF = async (record) => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const startMonthOfQuarter = Math.floor(currentMonth / 3) * 3;
      const startDate = new Date(currentDate.getFullYear(), startMonthOfQuarter, 1);
      console.log('record',data, record)
      let files = []
      wholeState.customization.userData.map(user =>{
        if(user.user._id == record.userId){
          user.invoice.map(index => {
            if(startDate < new Date(index.Date) && index.downloadFlag == false){
              files.push(index.FileName)
            }
          })
        }
      })

      console.log('files', files)
      const filesString = files.join(',');
      console.log('files', filesString)

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
        link.download = 'merged.pdf'; // Set the desired filename for the downloaded file
        link.click();
    
        // Clean up the URL object
        URL.revokeObjectURL(url);
      URL.revokeObjectURL(url);
      
      await axios.get(serverconfig.API_URL + 'api/users/setflaginvoice',  
      { 
        params: {
        param1: startDate,
        param2: record.userId,
        param3: filesString,
        param4: wholeState.customization.auth._id,
        param5: record.cif,
        param6: record.name,
        param7: record.tax_amount,
        param8: record.base_amount,
        param9: record.total

      }
   
      });

      location.reload(true);

     
  
      // let invoices = []
      // let i = 1

      // wholeState.customization.userData[record.id-1].invoice.map(index => {
      //   let endDate = new Date()
      //   if(selPeriod== 'month' && new Date(endDate.getFullYear(), endDate.getMonth()- 1, endDate.getDate(), endDate.getHours(), endDate.getMinutes(), endDate.getSeconds(), endDate.getMilliseconds()) < new Date(index.Date)){
      //     let tmp = index
      //     tmp.no = i
      //     i++

      //     invoices.push(tmp)
      //   }
      //   if(selPeriod== 'quarter' && new Date(endDate.getFullYear(), endDate.getMonth()- 3, endDate.getDate(), endDate.getHours(), endDate.getMinutes(), endDate.getSeconds(), endDate.getMilliseconds()) < new Date(index.Date)){
      //     let tmp = index
      //     tmp.no = i
      //     i++
      //     invoices.push(tmp)
          
      //   }
      //   if(selPeriod== 'semester' && new Date(endDate.getFullYear(), endDate.getMonth()- 6, endDate.getDate(), endDate.getHours(), endDate.getMinutes(), endDate.getSeconds(), endDate.getMilliseconds()) < new Date(index.Date)){
      //     let tmp = index
      //     tmp.no = i
      //     i++

      //     invoices.push(tmp)
          
      //   }
      //   if(selPeriod== 'annual' && new Date(endDate.getFullYear(), endDate.getMonth()- 12, endDate.getDate(), endDate.getHours(), endDate.getMinutes(), endDate.getSeconds(), endDate.getMilliseconds()) < new Date(index.Date)){
      //     let tmp = index
      //     tmp.no = i
      //     i++

      //     invoices.push(tmp)
      //   }
        
      // })

      // let pdfData= []
      // for(let i =0; i < invoices.length; i++){
      //   pdfData.push([invoices[i].no,
      //     invoices[i].ProviderName, 
      //     invoices[i].ProviderCIF, 
      //     invoices[i].InvoiceDate,
      //     invoices[i].InvoiceNumber, 
      //     invoices[i].TaxRate,          
      //     invoices[i].BaseAmount, 
      //     invoices[i].TaxAmount, 
      //     invoices[i].TotalAmount])
      // }
      // const doc = new jsPDF()
      // autoTable(doc, {
      //   theme: 'grid',
      //   columnStyles: { 0: { halign: 'center'} }, // Cells in first column centered and green
      //   margin: { top: 10 },
      //   head: [['No', 'Proveedor', 'CIF/DNI Proveedor', 'Fecha', 'N Factura', 'Impuesto Tasa', 'Base', 'Imquestos', 'Total']],
      //   body: pdfData
      // })
  
      // doc.save('table.pdf')

      // setUserInvoice(invoices)
      // setTimeout(exportPDF, 1500)
  
};
 
// const exportPDF = () => {
//   const element = document.getElementById('htmlElement'); // Replace 'htmlElement' with the ID of the HTML element you want to extract
//   element.style.visibility = ''; // Show the element again after generating the PDF
  

//   html2canvas(element, { scrollY: -window.scrollY })
//   .then((canvas) => {
//     const imgData = canvas;
//     const pdf = new jsPDF('l', 'pt', 'a5');
//     const pageWidth = pdf.internal.pageSize.getWidth()-10;
//     const pageHeight = pdf.internal.pageSize.getHeight()-10;
//     const imgWidth = pageWidth;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;

//     let offsetY = 0;
//     let remainingHeight = imgHeight;

//     while (remainingHeight > 0) {
//       pdf.addImage(imgData, 'PNG', 0, offsetY, imgWidth, imgHeight);
//       remainingHeight -= pageHeight;
//       offsetY -= pageHeight;
//       pdf.addPage();

//     }

//     pdf.save('document.pdf');
//     notification.success({
//       description: 'Éxito de exportación!',
//       placement: 'bottomRight',
//       duration: 2 // Duration in seconds (optional)
//     });
//   });
//   element.style.visibility = 'hidden'; // Show the element again after generating the PDF

// }
const exportXLSX = async (record) => {
  // const tableElement = tableRef.current; // Access the table element
  // Access the table data
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const startMonthOfQuarter = Math.floor(currentMonth / 3) * 3;
  const startDate = new Date(currentDate.getFullYear(), startMonthOfQuarter, 1);
  
  let invoices = []
  let i= 1;
  wholeState.customization.userData[record.id-1].invoice.map(index => {
    if(startDate < new Date(index.Date) && index.downloadFlag == false){
      let tmp = index
      tmp.no = i
      i++
    invoices.push(tmp)
    }
  })
  // wholeState.customization.userData[record.id-1].invoice.map(index => {
  //   let endDate = new Date()
  //   if(selPeriod== 'month' && new Date(endDate.getFullYear(), endDate.getMonth()- 1, endDate.getDate(), endDate.getHours(), endDate.getMinutes(), endDate.getSeconds(), endDate.getMilliseconds()) < new Date(index.Date)){
  //     let tmp = index
  //     tmp.no = i
  //     i++
  //     invoices.push(tmp)
  //   }
  //   if(selPeriod== 'quarter' && new Date(endDate.getFullYear(), endDate.getMonth()- 3, endDate.getDate(), endDate.getHours(), endDate.getMinutes(), endDate.getSeconds(), endDate.getMilliseconds()) < new Date(index.Date)){
  //     let tmp = index
  //     tmp.no = i
  //     i++
  //     invoices.push(tmp)
      
  //   }
  //   if(selPeriod== 'semester' && new Date(endDate.getFullYear(), endDate.getMonth()- 6, endDate.getDate(), endDate.getHours(), endDate.getMinutes(), endDate.getSeconds(), endDate.getMilliseconds()) < new Date(index.Date)){
  //     let tmp = index
  //     tmp.no = i
  //     i++
  //     invoices.push(tmp)
      
  //   }
  //   if(selPeriod== 'annual' && new Date(endDate.getFullYear(), endDate.getMonth()- 12, endDate.getDate(), endDate.getHours(), endDate.getMinutes(), endDate.getSeconds(), endDate.getMilliseconds()) < new Date(index.Date)){
  //     let tmp = index
  //     tmp.no = i
  //     i++
  //     invoices.push(tmp)
  //   }
    
  // })

  console.log('export', invoices,record.id)

  try {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(i + '');
    i++
    worksheet.columns = columns1;
    worksheet.columns.forEach((column) => {
      column.width = 20;
      column.alignment = { horizontal: 'center' };
    });
    invoices.forEach((singleData) => {
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


};


///////////////////////////////////
  const handleChange = (value) => {
    console.log(`selected ${value}`);
    if(value == 'month'){
      // SetSelPeriod('month')

      const endDate = new Date();

      let i =1;
      let wholeInvoice = []
      wholeState.customization.userData.map(index =>{
  
        let tax_amount = 0,base_amount = 0,total = 0
        index.invoice.map(one => {
          if(new Date(endDate.getFullYear(), endDate.getMonth() -1, endDate.getDate())<new Date(one.Date))
          {
            tax_amount += parseFloat(one.TaxAmount)
            base_amount += parseFloat(one.BaseAmount)
            total += parseFloat(one.TotalAmount)
          }
         
        })
        wholeInvoice.push({
          key: i + '',
          id: i + '',
          name: index.user.fname + ' ' + index.user.lname,
          cif: index.user.cif,
          tax_amount: tax_amount.toFixed(2) + " €",
          base_amount: base_amount.toFixed(2) + " €",
          total: total.toFixed(2) + " €",
        })
        i++
        console.log('tatat',tax_amount, base_amount, total)

      })
      setData(wholeInvoice)


    }else if(value == 'quarter'){
      // SetSelPeriod('quarter')

      const endDate = new Date();

      let i =1;
      let wholeInvoice = []
      wholeState.customization.userData.map(index =>{
  
        let tax_amount = 0,base_amount = 0,total = 0
        index.invoice.map(one => {
          if(new Date(endDate.getFullYear(), endDate.getMonth() -3, endDate.getDate())<new Date(one.Date))
          {
            tax_amount += parseFloat(one.TaxAmount)
            base_amount += parseFloat(one.BaseAmount)
            total += parseFloat(one.TotalAmount)
          }
         
        })
        wholeInvoice.push({
          key: i + '',
          id: i + '',
          name: index.user.fname + ' ' + index.user.lname,
          cif: index.user.cif,
          tax_amount: tax_amount.toFixed(2) + " €",
          base_amount: base_amount.toFixed(2) + " €",
          total: total.toFixed(2) + " €",
        })
        i++
        console.log('tatat',tax_amount, base_amount, total)

      })
      setData(wholeInvoice)
    }else if(value == 'semester'){
      // SetSelPeriod('semester')

      const endDate = new Date();

      let i =1;
      let wholeInvoice = []
      wholeState.customization.userData.map(index =>{
  
        let tax_amount = 0,base_amount = 0,total = 0
        index.invoice.map(one => {
          if(new Date(endDate.getFullYear(), endDate.getMonth() -6, endDate.getDate())<new Date(one.Date))
          {
            tax_amount += parseFloat(one.TaxAmount)
            base_amount += parseFloat(one.BaseAmount)
            total += parseFloat(one.TotalAmount)
          }
         
        })
        wholeInvoice.push({
          key: i + '',
          id: i + '',
          name: index.user.fname + ' ' + index.user.lname,
          cif: index.user.cif,
          tax_amount: tax_amount.toFixed(2) + " €",
          base_amount: base_amount.toFixed(2) + " €",
          total: total.toFixed(2) + " €",
        })
        i++
        console.log('tatat',tax_amount, base_amount, total)

      })
      setData(wholeInvoice)
    }else if(value == 'annual'){
      // SetSelPeriod('annual')

      const endDate = new Date();

      let i =1;
      let wholeInvoice = []
      wholeState.customization.userData.map(index =>{
  
        let tax_amount = 0,base_amount = 0,total = 0
        index.invoice.map(one => {
          if(new Date(endDate.getFullYear(), endDate.getMonth() -12, endDate.getDate())<new Date(one.Date))
          {
            tax_amount += parseFloat(one.TaxAmount)
            base_amount += parseFloat(one.BaseAmount)
            total += parseFloat(one.TotalAmount)
          }
         
        })
        wholeInvoice.push({
          key: i + '',
          id: i + '',
          name: index.user.fname + ' ' + index.user.lname,
          cif: index.user.cif,
          tax_amount: tax_amount.toFixed(2) + " €",
          base_amount: base_amount.toFixed(2) + " €",
          total: total.toFixed(2) + " €",
        })
        i++
        console.log('tatat',tax_amount, base_amount, total)

      })
      setData(wholeInvoice)
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    // confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
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
        if(ind[dataIndex].includes(selectedKeys[0]) == true){
          handleTmp.push(ind)
        }
      })
      handleTmp.map(one => {
        one.id = i + 1
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

  // const exportToExcel = async () => {
  //   const tableElement = tableRef.current; // Access the table element
  //   // Access the table data
  //   const tableData = Array.from(tableElement.getElementsByTagName('tr')).map((row) =>
  //     Array.from(row.getElementsByTagName('td')).map((cell) => cell.innerText)
  //   );

  //   for (let i = 1; i < tableData.length; i++) curTable.push(tableData[i]);

  //   try {
  //     const worksheet = workbook.addWorksheet('agency');
  //     worksheet.columns = columns1;
  //     worksheet.columns.forEach((column) => {
  //       column.width = 20;
  //       column.alignment = { horizontal: 'center' };
  //     });
  //     curTable.forEach((singleData) => {
  //       worksheet.addRow(singleData);
  //     });
  //     const buf = await workbook.xlsx.writeBuffer();
  //     saveAs(new Blob([buf]), `client.xlsx`);
  //     notification.success({
  //       description: 'Éxito de exportación!',
  //       placement: 'bottomRight',
  //       duration: 2 // Duration in seconds (optional)
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     notification.error({
  //       description: 'Exportación fallida!',
  //       placement: 'bottomRight',
  //       duration: 2 // Duration in seconds (optional)
  //     });
  //   }

  //   console.log('ttt', tableData); // Perform desired operations with the table data
  
  // };

  const columns = [
    {
      title: 'No',
      dataIndex: 'id',
      align: 'center'
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      align: 'center',
      ...getColumnSearchProps('name')
    },
    {
      title: 'CIF/DNI',
      dataIndex: 'cif',
      key: 'cif',
      width: '15%',
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
          defaultValue="anual"
          style={{ width: 180, display: 'none' }}
          onChange={handleChange}
          options={[
            { value: 'month', label: 'El mes pasado' },
            { value: 'quarter', label: 'Último cuarto' },
            { value: 'semester', label: 'Último semestre' },
            { value: 'annual', label: 'anual' }
          ]}
        />
      </Row>

      <Table columns={columns} ref={tableRef} dataSource={data} id={'testId'}/>
      <Row align="center">
        {/* <Button type="primary" size="large" onClick={exportToExcel}>
          Exportar
        </Button> */}
        {/* <HTMLToPDF 
        /> */}
      </Row>
      {/* <table style={{visibility:'hidden', border:'1px solid black'}}  id="htmlElement">
        <thead>
        <tr>
          <th style={{border: '1px solid black'}}>Proveedor</th>
          <th style={{border: '1px solid black'}}>CIF/DNI Proveedor</th>
          <th style={{border: '1px solid black'}}>Fecha</th>
          <th style={{border: '1px solid black'}}>N Factura</th>
          <th style={{border: '1px solid black'}}>Impuesto Tasa</th>
          <th style={{border: '1px solid black'}}>Base</th>
          <th style={{border: '1px solid black'}}>Imquestos</th>
          <th style={{border: '1px solid black'}}>Total</th>

        </tr>
        </thead>
        <tbody>
          {userInvoice.map(ind => 
          (<tr key={ind._id}>
            <td style={{border: '1px solid black'}}>{ind.ProviderName}</td>
            <td style={{border: '1px solid black'}}>{ind.ProviderCIF}</td>
            <td style={{border: '1px solid black'}}>{ind.InvoiceDate}</td>
            <td style={{border: '1px solid black'}}>{ind.InvoiceNumber}</td>
            <td style={{border: '1px solid black'}}>{ind.TaxRate}</td>
            <td style={{border: '1px solid black'}}>{ind.BaseAmount}</td>
            <td style={{border: '1px solid black'}}>{ind.TaxAmount}</td>
            <td style={{border: '1px solid black'}}>{ind.TotalAmount}</td>

          </tr>)
        )}

        </tbody>
        

      </table> */}
      {/* <div style={{visibility:'hidden'}}>
        <h1>Hello, world!</h1>
        <p>This is the content to be extracted as a PDF.</p>
      </div> */}
    </>
  );
};
const mapStateToProps = (state) => ({
  wholeState: state,
});

export default connect(mapStateToProps)(Ctable);

// export default Ctable;
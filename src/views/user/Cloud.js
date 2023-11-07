import * as React from 'react';
// import { Button } from '@mui/material';
// import { Grid } from '@mui/material';
// import TopicIcon from '@mui/icons-material/Topic';
// import Excel from 'exceljs';
// import { saveAs } from 'file-saver';

// import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TopicIcon from '@mui/icons-material/Topic';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { connect } from 'react-redux';
import { Select, Button,Row, Col } from 'antd';
// import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useEffect, useState } from 'react';
import axios from 'axios';
import serverconfig from '../../config';
import { notification } from 'antd';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import autoTable from 'jspdf-autotable'

const workbook = new Excel.Workbook();
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
const columns = [
  {
    id: 'no',
    label: 'No',
    align: 'center',
    minWidth: 100
  },
  {
    id: 'ProviderName',
    label: 'Proveedor',
    align: 'center',
    minWidth: 180
  },
  {
    id: 'ProviderCIF',
    label: 'CIF/DNI Proveedor',
    align: 'center',
    minWidth: 180
  },
  { id: 'InvoiceDate', label: 'Fecha', align: 'center', minWidth: 130 },
  { id: 'InvoiceNumber', label: 'N Factura', align: 'center', minWidth: 130 },
  { id: 'TaxRate', label: 'Impuesto Tasa', align: 'center', minWidth: 100 },

  {
    id: 'BaseAmount',
    label: 'Base',
    align: 'center',
    minWidth: 150
    // format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: 'TaxAmount',
    label: 'Imquestos',
    align: 'center',
    minWidth: 50
    // format: (value) => value.toLocaleString("en-US"),
  },
  { id: 'TotalAmount', label: 'Total', align: 'center', minWidth: 100 }
];

const Cloud = ({storeState}) => {
  // const [isLoading, setLoading] = useState(true);
  // const [data, setData] = useState();
  const [rows, setRows] = useState([]);
  useEffect(() => {
    // setLoading(false);
    getData();
  }, []);
  const exportToExcel = async () => {
    // setSaving(true);
    console.log('woe', storeState.customization.auth.data)
    try {
      let name  = storeState.customization.auth.data.fname + ' ' + storeState.customization.auth.data.lname 
      let agency_id = storeState.customization.auth.data.agency_id._id;
      let tmp = {client: agency_id,
        userid: storeState.customization.auth.data._id,
        user: name + ' acaba de generar el Excel sobre facturas!'}
        storeState.customization.socket.emit('Add User', (tmp))

      const worksheet = workbook.addWorksheet('invoice2');

      worksheet.columns = columns1;
      console.log('orw', worksheet.columns)

      worksheet.columns.forEach((column) => {

        column.width = column.header.length + 5;
        column.alignment = { horizontal: 'center' };
      });

      rows.forEach((singleData) => {
        // if(singleData != undefined)
        
          worksheet.addRow(singleData);
      });

      const buf = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buf]), `1.xlsx`);
      notification.success({
        description: 'Éxito de exportación!',
        placement: 'bottomRight',
        duration: 2 // Duration in seconds (optional)
      });
    } catch (e) {
      notification.error({
        description: 'Exportación fallida!',
        placement: 'bottomRight',
        duration: 2 // Duration in seconds (optional)
      });
    }
    // setSaving(false);
  };
  const deleteData = () => {
    console.log('store', storeState)  
    axios.post(serverconfig.API_URL + 'api/users/deleteVoice',
    {id: storeState.customization.auth.data._id} ).then((res) => {
        if(res.data == 'success'){
          setRows([])
          notification.success({
            description: 'Eliminado exitosamente!',
            placement: 'bottomRight',
            duration: 2 // Duration in seconds (optional)
          });
        } else if( res.data =='failed'){
          notification.error({
            description: 'desafortunadamente no se pudo eliminar!',
            placement: 'bottomRight',
            duration: 2 // Duration in seconds (optional)
          });
        }
    })
    
  }


  const exportToPDF = () => {
    console.log('rows', rows)
    let pdfData= []
    for(let i =0; i < rows.length; i++){
      pdfData.push([rows[i].no,
        rows[i].ProviderName, 
        rows[i].ProviderCIF, 
        rows[i].InvoiceDate,
        rows[i].InvoiceNumber, 
        rows[i].TaxRate,          
        rows[i].BaseAmount, 
        rows[i].TaxAmount, 
        rows[i].TotalAmount])
    }
    const doc = new jsPDF()
    autoTable(doc, {
      theme: 'grid',
      columnStyles: { 0: { halign: 'center'} }, // Cells in first column centered and green
      margin: { top: 10 },
      head: [['No', 'Proveedor', 'CIF/DNI Proveedor', 'Fecha', 'N Factura', 'Impuesto Tasa', 'Base', 'Imquestos', 'Total']],
      body: pdfData
    })

    doc.save('table.pdf')
    
    // setTimeout(exportPDF, 500)

  }
  // const exportPDF = () => {
  //   const element = document.getElementById('ocrTbl'); // Replace 'htmlElement' with the ID of the HTML element you want to extract

  //   html2canvas(element, { scrollY: -window.scrollY })
  //     .then((canvas) => {
  //       const imgData = canvas.toDataURL('image/png');
  //       const pdf = new jsPDF('l', 'pt', 'a4');
  //       const pageWidth = pdf.internal.pageSize.getWidth();
  //       const pageHeight = pdf.internal.pageSize.getHeight()-10;
  //       const imgWidth = pageWidth;
  //       const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
  //       let offsetY = 0;
  //       let remainingHeight = imgHeight;
    
  //       while (remainingHeight > 0) {
  //         pdf.addImage(imgData, 'PNG', 10, offsetY, imgWidth, imgHeight);
  //         remainingHeight -= pageHeight;
  //         offsetY -= pageHeight;
  //         pdf.addPage();

  //       }
    
  //       pdf.save('document.pdf');
  //       notification.success({
  //         description: 'Éxito de exportación!',
  //         placement: 'bottomRight',
  //         duration: 2 // Duration in seconds (optional)
  //       });
  //     });
  // }
  const handleChange = (value) => {
    console.log(`selected ${value}`);
    const endDate = new Date();

    if(value == 'month'){

      console.log('aaaa', storeState.customization.auth.data)
      axios.post(serverconfig.API_URL + 'api/users/gather').then((res) => {
        // setData(res.data);
        let tmpData = []
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const startMonthOfQuarter = Math.floor(currentMonth / 3) * 3;
        const startDate = new Date(currentDate.getFullYear(), startMonthOfQuarter, 1);
        res.data.map((dt, idx) => {

          if(dt.UserId == storeState.customization.auth.data._id && startDate <new Date(dt.Date) && dt.downloadFlag == false){
            let tmp = dt;
            tmp.no = idx+1
            tmpData.push(tmp)
          }
        })
        console.log('data', res.data )
        let i = 1
        tmpData.map(dt => {
          dt.ClientId = dt.ClientId.id
          dt.no = i
          i++
        })
        setRows(tmpData);
        console.log(tmpData);
      });
    }else if(value == 'quarter'){
      console.log('aaaa', storeState.customization.auth.data)
      axios.post(serverconfig.API_URL + 'api/users/gather').then((res) => {
        // setData(res.data);
        let tmpData = []
        res.data.map(dt => {
          if(dt.UserId == storeState.customization.auth.data._id && new Date(endDate.getFullYear(), endDate.getMonth() -3, endDate.getDate())<new Date(dt.Date)){
            let tmp = dt;
            tmp.no = idx+1

            tmpData.push(tmp)
          }
        })
        console.log('data', res.data )
        let i = 1
        tmpData.map(dt => {
          dt.ClientId = dt.ClientId.id
          dt.no = i
          i++
        })
        setRows(tmpData);
        console.log(tmpData);
      });
    }else if(value == 'semester'){
      console.log('aaaa', storeState.customization.auth.data)
      axios.post(serverconfig.API_URL + 'api/users/gather').then((res) => {
        // setData(res.data);
        let tmpData = []
        res.data.map((dt, idx) => {
          if(dt.UserId == storeState.customization.auth.data._id && new Date(endDate.getFullYear(), endDate.getMonth() -6, endDate.getDate())<new Date(dt.Date)){
            let tmp = dt;
            tmp.no = idx+1

            tmpData.push(tmp)
          }
        })
        console.log('data', res.data )
        let i = 1
        tmpData.map(dt => {
          dt.ClientId = dt.ClientId.id
          dt.no = i
          i++
        })
        setRows(tmpData);
        console.log(tmpData);
      });
    }else if(value == 'annual'){
      console.log('aaaa', storeState.customization.auth.data)
      axios.post(serverconfig.API_URL + 'api/users/gather').then((res) => {
        // setData(res.data);
        let tmpData = []
        res.data.map((dt, idx) => {
          if(dt.UserId == storeState.customization.auth.data._id && new Date(endDate.getFullYear(), endDate.getMonth() -12, endDate.getDate())<new Date(dt.Date)){
            let tmp = dt;
            tmp.no = idx+1

            tmpData.push(tmp)
          }
        })
        console.log('data', res.data )
        let i = 1
        tmpData.map(dt => {
          dt.ClientId = dt.ClientId.id
          dt.no = i
          i++
        })
        setRows(tmpData);
        console.log(tmpData);
      });
    }
  };
  const getData = () => {
    console.log('aaaa', storeState.customization.auth.data)
    // let tmpData = []
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const startMonthOfQuarter = Math.floor(currentMonth / 3) * 3;
    const startDate = new Date(currentDate.getFullYear(), startMonthOfQuarter, 1);
    
    axios.post(serverconfig.API_URL + 'api/users/gather').then((res) => {
      // setData(res.data);
      let tmpData = []
      res.data.map((dt, idx) => {
        if(dt.UserId == storeState.customization.auth.data._id && startDate <new Date(dt.Date) && dt.downloadFlag == false){
          let tmp = dt;
          tmp.no = idx+1

          tmpData.push(tmp)
        }
      })
      console.log('data', res.data )
      let i = 1
      tmpData.map(dt => {
        dt.UserId = dt.ClientId.id
        dt.no = i
        i++
      })
      setRows(tmpData);
      console.log(tmpData);
    });
  };

  return (
    <>
      <Select
        
        defaultValue="anual"
        style={{ width: 180,display: 'none' }}
        onChange={handleChange}
        options={[
          { value: 'month', label: 'El mes pasado' },
          { value: 'quarter', label: 'Último cuarto' },
          { value: 'semester', label: 'Último semestre' },
          { value: 'annual', label: 'anual' }
        ]}
      />
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table" id='ocrTbl'>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                ? rows.map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                        {columns.map((column) => {
                          let value
                          if(column.id == 'BaseAmount' || column.id == 'TaxAmount' || column.id == 'TotalAmount'){
                             value = row[column.id] + ' €';

                          }
                          else {
                             value = row[column.id] + '';

                          }
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                : ''}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {rows.length != 0 ? <Row style={{marginTop:'5vh'}}>
        <Col span={6} style={{textAlign: 'center'}}>
          <Button style={{backgroundColor: '#2196f3', color:'white'}} onClick={exportToExcel} variant="contained" component="label" endIcon={<TopicIcon />}>
            Exportar Excel
          </Button>
        </Col>
        <Col span={3} style={{textAlign: 'center'}}>
          <Button style={{backgroundColor: '#2196f3', color:'white'}} onClick={exportToPDF} variant="contained" component="label" endIcon={<TopicIcon />} >
            Exportar PDF
          </Button>
        </Col>
        <Col span={12} style={{textAlign: 'center'}}>
          <Button style={{backgroundColor: '#2196f3', color:'white', float: 'right'}} onClick={deleteData} variant="contained" component="label" endIcon={<TopicIcon />} >
            Delete
          </Button>
        </Col>
      </Row> : 
      <Row style={{marginTop:'5vh'}}>
        <Col span={6} style={{textAlign: 'center'}}>
          <Button disabled style={{backgroundColor: '#2196f3', color:'white', display: 'none'}} onClick={exportToExcel} variant="contained" component="label" endIcon={<TopicIcon />}>
            Exportar Excel
          </Button>
        </Col>
        <Col span={3} style={{textAlign: 'center'}}>
          <Button disabled style={{backgroundColor: '#2196f3', color:'white', display: 'none'}} onClick={exportToPDF} variant="contained" component="label" endIcon={<TopicIcon />} >
            Exportar PDF
          </Button>
        </Col>
        <Col span={12} style={{textAlign: 'center'}}>
          <Button disabled style={{backgroundColor: '#2196f3', color:'white', float: 'right', display: 'none'}} onClick={deleteData} variant="contained" component="label" endIcon={<TopicIcon />} >
            Delete
          </Button>
        </Col>
      </Row> }
      {/* <Row style={{marginTop:'5vh'}}>
        <Col span={6} style={{textAlign: 'center'}}>
          <Button style={{backgroundColor: '#2196f3', color:'white'}} onClick={exportToExcel} variant="contained" component="label" endIcon={<TopicIcon />}>
            Exportar Excel
          </Button>
        </Col>
        <Col span={3} style={{textAlign: 'center'}}>
          <Button style={{backgroundColor: '#2196f3', color:'white'}} onClick={exportToPDF} variant="contained" component="label" endIcon={<TopicIcon />} >
            Exportar PDF
          </Button>
        </Col>
        <Col span={12} style={{textAlign: 'center'}}>
          <Button disabled style={{backgroundColor: '#2196f3', color:'white', float: 'right'}} onClick={deleteData} variant="contained" component="label" endIcon={<TopicIcon />} >
            Delete
          </Button>
        </Col>
      </Row> */}

      {/* <Grid container direction="row" justifyContent="center" alignItems="center">
        <Button variant="contained" component="label" endIcon={<TopicIcon />} onClick={exportToExcel}>
          Sobresalir
        </Button>
      </Grid> */}
    </>
  );
};
const mapStateToProps = (state) => ({
  storeState: state,
});
export default connect(mapStateToProps)(Cloud);

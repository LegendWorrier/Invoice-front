import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import TopicIcon from '@mui/icons-material/Topic';
import { Grid } from '@mui/material';

import InvoiceRow from './InvoiceRow';
import { useState, useEffect } from 'react';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
// import { Configuration, OpenAIApi } from 'openai';
import axios from 'axios';
// import { saveData } from '../../actions/auth';
import { notification } from 'antd';
// import html2canvas from 'html2canvas';
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable'
import { PDFDocument } from 'pdf-lib';
// import jwt_decode from 'jwt-decode';

// import './upload.css';

// import Excel from "exceljs";
// import { saveAs } from "file-saver";
// import { Configuration, OpenAIApi } from "openai";
// import InvoiceRow from "../../utils/InvoiceRow";
// import SumRow from "../../utils/SumRow";
// import InvoiceTable from '../../utils/table';
import SumRow from './SumRow';
import serverconfig from '../../config';
import { connect } from 'react-redux';

let invoiceData = [];
// let sumString = '';
let fileSize = 0;
let agency = '';
// let cif = '';

const columns = [
  { header: 'Nombre del proveedor', key: 'ProviderName' },
  { header: 'CIF', key: 'CIF' },
  { header: 'Factura Fecha', key: 'InvoiceDate' },
  { header: 'Factura Número', key: 'InvoiceNumber' },
  { header: 'Impuesto Tasa', key: 'TaxRate' },
  { header: 'Base Cantidad', key: 'BaseAmount' },
  { header: 'Tax Cantidad', key: 'Tax' },
  { header: 'Total Cantidad', key: 'TotalAmount' }
];

const Upload = ({wholeState}) => {
  const [files, setFiles] = useState([]);
  const [parse, startParse] = useState(false);
  const [extractFinished, setExtractFinished] = useState(false);
  // const [saving, setSaving] = useState(false);
  const [sum, setSum] = useState();

  const workbook = new Excel.Workbook();

  useEffect(() => {
    // invoiceData = [];
    fileSize = 0;
    console.log("init invoice", invoiceData)
  }, []);

  const extractSum = async () => {
    // const configuration = new Configuration({
      //     apiKey: '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',
      // });

      // delete configuration.baseOptions.headers['User-Agent'];
      // console.log("sum", sumString);
      // const openai = new OpenAIApi(configuration);

      // const response = await openai.createCompletion({
      //     model: "text-davinci-003",
      //     prompt: `If the given input is a JSON array, please perform the following calculations: Calculate the sums of the 'BaseAmount', 'Tax', and 'TotalAmount' values for each currency. Store these sum values as equality equations using the variables 'BASum', 'TaxSum', and 'TASum', respectively. If the JSON array contains multiple currencies, provide separate JSON objects for each currency within a single JSON object. It is crucial that all values include the corresponding currency and are represented as strings. The resulting JSON object should have keys representing the currencies and should contain multiple JSON objects.

      //     If the given input is a JSON object, please perform the same calculations: Calculate the sums of the 'BaseAmount', 'Tax', and 'TotalAmount' values for the currency provided in the JSON object. Store these sum values as equality equations using the variables 'BASum', 'TaxSum', and 'TASum', respectively. The resulting JSON object should have a key representing the currency and contain a single JSON object.
          
      //     In both cases, ensure that the output is in a format that can be parsed by JavaScript. Accuracy of sums in the answers should be high.` + "\n\n" + sumString,
      //     // prompt: `I want you to give me the sum of "BaseAmount" value as BASum, sum of "Tax" value as TaxSum and sum of "TotalAmount" value as TASum from the given array below in JSON Format. Sum is based on the currency which means, if there are 2 different types of currency, then you should give me two json objects corresponding each currency. ALl values must be string and the json must be parsable with JavaScript. I need correct answers.` + "\n\n" + sumString,
      //     temperature: 0.2,
      //     max_tokens: 700,
      //     top_p: 1,
      //     frequency_penalty: 0,
      //     presence_penalty: 0
      // });


      // let res = response.data.choices[0].text;
      // console.log("res", res)
      // // console.log("res0", res[0])
      // // console.log("res1", res[1])
      // // const firstIndex = res.indexOf('{');
      // // const lastIndex = res.lastIndexOf('}');
      // // console.log("first Index = ", firstIndex)
      // // console.log("last Index = ", lastIndex)
      // // console.log(res.substring(firstIndex, lastIndex + 1))
      // // res = JSON.parse(res.substring(firstIndex, lastIndex + 1));
      // res = JSON.parse(res)
      // for(const key in res){
      //   if (res.hasOwnProperty(key)) {
      //       for(const subkey in res[key]){
      //         let arr = res[key][subkey].split('=')
      //         res[key][subkey] = arr[arr.length-1]
      //       }
      //   }
      // }
      // console.log("final", res)
      // setSum(res);
      let currenices = []
      let total = []
      for(let i = 0; i < invoiceData.length; i++){
        let index = currenices.indexOf(invoiceData[i]['Currency'])
        if(index == -1){
          currenices.push(invoiceData[i]['Currency']);
          total.push({[invoiceData[i]['Currency']]: {
              ['BASum'] : Number(invoiceData[i]['BaseAmount']),
              ['TaxSum'] : Number(invoiceData[i]['Tax']),
              ['TASum'] : Number(invoiceData[i]['TotalAmount'])
            }
          })
        }else{
          total[index][invoiceData[i]['Currency']]['BASum'] += Number(invoiceData[i]['BaseAmount']);
          total[index][invoiceData[i]['Currency']]['TaxSum'] += Number(invoiceData[i]['Tax']);
          total[index][invoiceData[i]['Currency']]['TASum'] += Number(invoiceData[i]['TotalAmount']);
        }
      }
      for (let j = 0; j < total.length; j++) {
        const keys = Object.keys(total[j]);
          keys.map((key) => {
            total[j][key]['BASum'] = Math.round(total[j][key]['BASum'] * 100) / 100
            total[j][key]['TaxSum'] = Math.round(total[j][key]['TaxSum'] * 100) / 100
            total[j][key]['TASum'] = Math.round(total[j][key]['TASum'] * 100) / 100
          })
      }
      // total[index][invoiceData[i]['Currency']]['BASum'] = total[index][invoiceData[i]['Currency']]['BASum'].toFixed(2);
      // total[index][invoiceData[i]['Currency']]['TaxSum'] = invoiceData[i]['Tax'].toFixed(2);
      // total[index][invoiceData[i]['Currency']]['TASum'] = invoiceData[i]['TotalAmount'].toFixed(2);
      console.log("total", total)
      setSum(total);
  };

  const onInvoiceDataExtracted = (index, invoice) => {
    setExtractFinished(true);
    console.log("index", index)
    console.log("fileSize", fileSize)
    console.log("invoice", invoice)
    // sumString += invoice + ",";
    let inv = JSON.parse(invoice);
    if(inv['Currency'].toLowerCase() == 'usd') inv['Currency'] = '$';
    if(inv['Currency'].toLowerCase() == 'eur') inv['Currency'] = '€';
    // if (inv != undefined)
    //   invoiceData.push(inv);
    invoiceData[index] = inv
    let i;
    // for (i = 0; i < invoiceData.length; i++) {
    for (i = 0; i < fileSize; i++) {
      if (i >= invoiceData.length || !invoiceData[i]) return;
    } 

    console.log("extract sum");

    extractSum();

    setExtractFinished(true);
  };

  const saveToCloud = async () => {
    console.log('whole', wholeState.customization.auth.data)
    // const decoded = jwt_decode(window.localStorage.getItem('jwtToken'));
    // console.log('token', window.localStorage.getItem('jwtToken'));
    let userId  = wholeState.customization.auth.data._id
    let agency_id = wholeState.customization.auth.data.agency_id._id;

    const formData = new FormData();
    formData.append('userId', userId);
    let tmp = []

    for (const file of files) {
      const uniqueSuffix =userId + '-' + Date.now() + '-' + Math.round(Math.random() * 1e9) + '.pdf';
      tmp.push(uniqueSuffix)

      formData.append('files', file, uniqueSuffix);
    }


    axios.post(serverconfig.API_URL + 'upload', formData)
    .then((response) => {
      console.log(response.data);
      // Handle the server response
    })
    .catch((error) => {
      console.error('Error:', error);
      // Handle errors
    });

    console.log('agency', agency, userId, tmp.length, invoiceData.length);
    const data = []
    for (let i = 0; i < invoiceData.length; i++) {
    console.log('tmp', tmp[i])

       data.push({
        format: invoiceData[i]['Format'],
        ProviderName: invoiceData[i]['ProviderName'],
        CIF: invoiceData[i]['CIF'],
        InvoiceDate: invoiceData[i]['InvoiceDate'],
        InvoiceNumber: invoiceData[i]['InvoiceNumber'],
        BaseAmount: invoiceData[i]['BaseAmount'],
        TaxAmount: invoiceData[i]['Tax'],
        TaxRate: invoiceData[i]['TaxRate'],
        TotalAmount: invoiceData[i]['TotalAmount'],
        Client_ID: agency_id,
        FileName: tmp[i],
        // ClientCIF: cif,
        userId: userId
       })

      }
      //   const data = {
      //   format: 'aaaaaaaaaa',
      //   ProviderName:'vvvvvvvvvvvvvv',
      //   CIF: 'vvvvvvsafdfefaefa',
      //   InvoiceDate: 'feafeafeafeaf',
      //   InvoiceNumber: 'vefaveava',
      //   BaseAmount: 'fefevevvvvvvvv',
      //   TaxAmount: 'fevvvvvvvvvbbb',
      //   TaxRate: 'vevevagdagae',
      //   TotalAmount: 'gveveveveeae',
      //   ClientName: agency,
      //   userId: userId
      // };
     axios.post(serverconfig.API_URL + 'api/users/saveInvoice', {id: agency_id,data: data}).then(res => {
      if(res.data == 'failed')
      {  
          console.log(err);
          return notification.error({
            description: 'Guardar fallida!',
            duration: 2,
            placement: 'bottomRight'
          });
      }
     })
    notification.success({
      description: 'Guardar éxito!',
      duration: 2,
      placement: 'bottomRight'
    });
     

  };

  const exportToPDF = async () => {
    const mergedPdf = await PDFDocument.create();
    
    for (const file of files) {
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();

    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });

    // Create a download link and click it to trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'merged.pdf';
    downloadLink.click();

    // let pdfData = []
    // invoiceData.forEach((singleData, ind) => {
    //   // if(singleData != undefined)

    //   pdfData.push([ind+1, singleData.ProviderName, singleData.CIF, 
    //     singleData.InvoiceDate,singleData.InvoiceNumber, singleData.TaxRate,  singleData.BaseAmount + singleData.Currency,
    //     singleData.Tax + singleData.Currency, singleData.TotalAmount + singleData.Currency])
    //     // worksheet.addRow(singleData);
    // });

    // const doc = new jsPDF()
    // autoTable(doc, {
    //   theme: 'grid',
    //   columnStyles: { 0: { halign: 'center'} }, // Cells in first column centered and green
    //   margin: { top: 10 },
    //   head: [['No', 'Proveedor', 'CIF', 'Factura Fecha', 'Factura Número', 'Impuesto Tasa', 'Base Cantidad', 'Tax Cantidad', 'Total Cantidad']],
    //   body: pdfData
    // })

    // doc.save('table.pdf')

    let name  = wholeState.customization.auth.data.fname + ' ' + wholeState.customization.auth.data.lname 
    let agency_id = wholeState.customization.auth.data.agency_id._id;
    let tmp = {client: agency_id,
      user: name + ' acaba de generar el PDF sobre facturas!'}
    wholeState.customization.socket.emit('Add User', (tmp))

    // setTimeout(exportPDF, 500)

  }

  // const exportPDF = () => {
  //   const element = document.getElementById('ocrTbl'); // Replace 'htmlElement' with the ID of the HTML element you want to extract
  //   // element.style.visibility = ''; // Show the element again after generating the PDF
    
  //   html2canvas(element)
  //     .then((canvas) => {
  //       const imgData = canvas.toDataURL('image/png');
  //       const pdf = new jsPDF('l', 'pt', 'a4');
  //       const imgWidth = pdf.internal.pageSize.getWidth(); // Get page width
  //       const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate height to maintain aspect ratio
  //       pdf.addImage(imgData, 'PNG', 0,0, imgWidth, imgHeight);
  //       pdf.save('document.pdf');
  //     });
  //   // element.style.visibility = 'hidden'; // Show the element again after generating the PDF
  
  // }


  const exportToExcel = async () => {
    console.log("invoice data", invoiceData)
    // setSaving(true);
    try {
      const worksheet = workbook.addWorksheet('invoice');
      worksheet.columns = columns;
      console.log('aaa', worksheet.columns)
      worksheet.columns.forEach((column) => {
        column.width = column.header.length + 5;
        column.alignment = { horizontal: 'center' };
      });

      let name  = wholeState.customization.auth.data.fname + ' ' + wholeState.customization.auth.data.lname 
      let agency_id = wholeState.customization.auth.data.agency_id._id;
      let tmp = {client: agency_id,
        user: name + ' acaba de generar el Excel sobre facturas!'}
      wholeState.customization.socket.emit('Add User', (tmp))
      
      invoiceData.forEach((singleData) => {
        // if(singleData != undefined)
        
          worksheet.addRow(singleData);
      });
      // for (const key in sum) {
      //   if (sum.hasOwnProperty(key)) {
      //     worksheet.addRow(['', '', '', '', key, sum[key]['BASum'], sum[key]['TaxSum'], sum[key]['TASum']]);
      //   }
      // }

      for (let i = 0; i < sum.length; i++) {
        const key = Object.keys(sum[i]);
        const add = Object.prototype.hasOwnProperty.call(sum[i],key[0])
        if (add) {
          worksheet.addRow(["", "", "", "", key[0], sum[i][key[0]]["BASum"], sum[i][key[0]]["TaxSum"], sum[i][key[0]]["TASum"]]);
        }
      }
      // worksheet.addRow(['', '', '', '', '', sum['BASum'], sum['TaxSum'], sum['TASum']]);
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

  return (
    <div>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Button variant="contained" component="label">
          Subir
          <input
            hidden
            accept=".pdf"
            multiple
            type="file"
            onChange={async (e) => {
              startParse(false);
              setExtractFinished(false);
              setSum(null);
              console.log;
              if (e.target.files.length > 0) {
                fileSize = e.target.files.length;
                // invoiceData = []
                invoiceData = Array.apply(null, Array(e.target.files.length));
                // sumString = '';
                setFiles(Array.from(e.target.files));
              }
            }}
          />
        </Button>
        <Button variant="contained" component="label" onClick={() => startParse(true)}>
          {' '}
          Extract PDF
        </Button>
      </Stack>
      {/* <InvoiceTable /> */}
      <div id="ocrTbl" className="App p-4">
        <div className="flex">
          <div className="w-full h-full ml-11">
            {files && files.length > 0 && (
              <>
                <div className="invoice">
                  {/* <thead>
                <tr>
                  <td>ID</td>
                  <td>Provider Name</td>
                  <td>CIF</td>
                  <td>Invoice Date</td>
                  <td>Invoice Number</td>
                  <td>Tax(%)</td>
                  <td>Base Amount</td>
                  <td>Tax Amount</td>
                  <td>Total</td>
                </tr>
            </thead> */}
                  <ul>
                    <li>
                      <div className="bg-white dark:bg-gray-800 dark:border-gray-700 border border-gray-200 rounded-lg shadow my-2 px-4 py-4 flex items-center h-[3rem]">
                        <p className="w-1/12 text-left ml-4">No</p>
                        <p className="w-2/12">Formato</p>
                        <p className="w-2/12">
                          Proveedora
                          <br />
                          Nombre
                        </p>
                        <p className="w-2/12">CIF</p>
                        <p className="w-2/12">
                          Factura
                          <br />
                          Fecha
                        </p>
                        <p className="w-2/12">
                          Factura
                          <br />
                          Número
                        </p>
                        <p className="w-2/12">
                          Impuesto
                          <br />
                          Tasa
                        </p>
                        <p className="w-2/12">
                          Base
                          <br />
                          Cantidad
                        </p>
                        <p className="w-2/12">
                          Tax
                          <br />
                          Cantidad
                        </p>
                        <p className="w-2/12">
                          Total
                          <br />
                          Cantidad
                        </p>
                      </div>
                    </li>
                    {files.map((file, index) => {
                      return (
                        <li key={`invoice-${file.name}`}>
                          <InvoiceRow
                            file={file}
                            index={index}
                            key={`invoice-${index}`}
                            parse={parse}
                            onInvoiceDataExtracted={onInvoiceDataExtracted}
                          />
                        </li>
                      );
                    })}
                    {sum && (
                      <li>
                        <SumRow data={sum} />
                      </li>
                    )}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Grid container direction="row" justifyContent="center" alignItems="center">
        <Stack direction="row" spacing={2}>
          <Button variant="contained" component="label" endIcon={<SaveAsIcon />} onClick={saveToCloud} disabled={!extractFinished && !sum}>
          Guardar
          </Button>
          <Button variant="contained" hidden component="label" endIcon={<TopicIcon />} onClick={exportToExcel} disabled={!extractFinished && !sum}>
            Exportar Excel
          </Button>
          <Button variant="contained" hidden component="label" endIcon={<TopicIcon />} onClick={exportToPDF} disabled={!extractFinished && !sum}>
            Exportar PDF
          </Button>
        </Stack>
      </Grid>
    </div>
  );
};


const mapStateToProps = (state) => ({
  wholeState: state,
});

export default connect(mapStateToProps)(Upload);
// export default Upload;
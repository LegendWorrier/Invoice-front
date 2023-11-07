import { Configuration, OpenAIApi } from "openai";
import { useEffect, useState } from "react";

// import Button from '@mui/material/Button';
// import { data } from "jquery";
import './upload.css'
// import { textAlign } from "@mui/system";
const pdfjsLib = require('pdfjs-dist/webpack');
const Tesseract = require('tesseract.js');

// Set the location of the PDF.js worker script
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.8.335/pdf.worker.min.js';

function convertPdfToImagesAndReadText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function() {
        const typedArray = new Uint8Array(this.result);
        
        pdfjsLib.getDocument(typedArray).promise.then(function(pdf) {
          const totalPages = pdf.numPages;
          const imagePromises = [];
          
          for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
            imagePromises.push(
              pdf.getPage(pageNumber).then(function(page) {
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                const renderContext = {
                  canvasContext: context,
                  viewport: viewport,
                };
                
                return page.render(renderContext).promise.then(function() {
                  return new Promise((resolve) => {
                    canvas.toBlob(function(blob) {
                      const reader = new FileReader();
                      reader.onloadend = function() {
                        resolve(this.result);
                      };
                      reader.readAsDataURL(blob);
                    }, 'image/jpeg', 0.75);
                  });
                });
              })
            );
          }
          
          Promise.all(imagePromises).then( function(imageDataArray) {
            const textPromises = [];
            
            imageDataArray.forEach(function(imageData) {
              textPromises.push(
                Tesseract.recognize(imageData, 'eng').then(function(result) {
                  return result.data.text;
                })
              );
            });
            
            Promise.all(textPromises).then(function(textArray) {
              resolve(textArray);
            }).catch(reject);
          }).catch(reject);
        }).catch(reject);
      };
      reader.readAsArrayBuffer(file);
    });
  }

export default function InvoiceRow({ file, index, parse, onInvoiceDataExtracted }) {
    const [parsing, setParsing] = useState(false);
    const [result, setResult] = useState();
    const [totalAmount, setTotalAmount] = useState()
    const [ProviderName, setProviderName] = useState()
    const [CIF, setCIF] = useState()
    const [InvoiceDate, setInvoiceDate] = useState()
    const [TaxRate, setTaxRate] = useState()

    const [InvoiceNumber, setInvoiceNumber] = useState()
    const [baseAmount, setBaseAmount] = useState()
    const [tax, setTax] = useState()
    let done = false;
    const inputStyle = {
        textAlign: 'center',
      };
    const extractInvoiceData = async () => {
        if (done)   return;
        done = true;
        setParsing(true);
        const configuration = new Configuration({
            apiKey: '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',
        });
        delete configuration.baseOptions.headers['User-Agent'];

        const openai = new OpenAIApi(configuration);

        let extractedText = '';
        let read = false
        if(file.type.includes("pdf")){
            console.log("extract from pdf...")
            // Step 1: Read the uploaded PDF file
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);

            // Step 2: Wait for the file to be loaded
            await new Promise((resolve) => {
                reader.onload = resolve;
            });

            const pdfBytes = reader.result;

            // Step 3: Load the PDF using pdfjs-dist
            const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
            const pdf = await loadingTask.promise;

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const content = await page.getTextContent();
                const pageText = content.items.map(item => item.str).join(' ');
                extractedText += pageText;
            }
            if(extractedText != '')
                read = true
        }
        if(read == false){
            console.log("extract from image")
            console.log(file)
            await convertPdfToImagesAndReadText(file).then(function(textArray) {
                console.log(textArray);
                extractedText = textArray
              }).catch(function(error) {
                console.error(error);
              });
        }

        console.log("text: ", extractedText)

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            // prompt: `I need to extract invoice data from the given text. I need Provider Name as ProviderName, CIF, Invoice Date as InviceDate, Invoice Number as InvoiceNumber, Base or Base Amount or IVA as BaseAmount, Total Amount as TotalAmount and Tax or Fee as Tax, Tax Rate as TaxRate and currency as Currency in json. Here Tax is calculated as difference between base amount and total amount and Tax Rate should be as the percent value. The json must be parsable with JavaScript. I want to the values in ". If Base Amount, Total Amount, and Tax is null or N/A or empty, I want it to be 0. And if Tax Rate is null or N/A, I want it to be 0% and the Base Amount is not 0. Also Tax is in not in percentage. Base Amount and Tax and Total Amount should contain Currency such as '$' and '€'. All items and names must be string ` + "\n\n" + extractedText,
            // prompt: "I need to extract specific invoice data from the given text and represent it in JSON format. The required fields are as follows: 'Provider Name' should be stored as 'ProviderName', 'CIF' as 'CIF', 'Invoice Date' as 'InvoiceDate', 'Invoice Number' as 'InvoiceNumber', 'Base' or 'Base Amount' as 'BaseAmount', 'Total Amount' as 'TotalAmount', 'Tax' or 'Fee' as 'Tax', 'Tax Rate' or 'IVA' as 'TaxRate', and 'currency' as 'Currency'. The 'Invoice Number' should consist of exactly 8 characters in length. The 'Tax' is calculated as the difference between the 'Base Amount' and the 'Total Amount'. 'Tax Rate' is calculated as the percentage of 'Tax' in 'Base Amount' with string format. The resulting JSON object should be parseable with JavaScript. The desired values should be enclosed within double quotation marks. If 'Base Amount', 'Total Amount', or 'Tax' is null, 'N/A', or empty, the corresponding value should be set to 0. If 'Tax Rate' is null or 'N/A', it should be set to 0%. The 'Tax' value should not be in percentage form. The 'Base Amount', 'Tax' and 'Total Amount' fields should  be represented as numbers and other fields and values should be represented as strings." + "\n\n" + extractedText,
            prompt: "I need to extract specific invoice data from the given text and represent it in JSON format. The required fields are as follows: 'Provider Name' should be stored as 'ProviderName', 'CIF' as 'CIF', 'Invoice Date' as 'InvoiceDate', 'Invoice Number' as 'InvoiceNumber', 'Base' or 'Base Amount' as 'BaseAmount', 'Total Amount' as 'TotalAmount', 'Tax' or 'Fee' as 'Tax', 'IVA' or 'Tax Rate' as 'TaxRate', and 'currency' as 'Currency'. The 'Invoice Number' should consist of exactly 8 characters in length. The 'Tax' is calculated as the difference between the 'Base Amount' and the 'Total Amount'. 'Tax Rate' is calculated as the percentage of 'Tax' in 'Base Amount' with string format. The resulting JSON object should be parseable with JavaScript. The desired values should be enclosed within double quotation marks. If 'Base Amount', 'Total Amount', or 'Tax' is null, 'N/A', or empty, the corresponding value should be set to 0. If 'Tax Rate' is null or 'N/A', it should be set to 0%. The 'Tax' value should not be in percentage form. The 'Base Amount', 'Tax' and 'Total Amount' fields should  be represented as numbers and other fields and values should be represented as strings." + "\n\n" + extractedText,
            temperature: 0.2,
            max_tokens: 700,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        const res = response.data.choices[0].text;
        const firstIndex = res.indexOf('{');
        const lastIndex = res.lastIndexOf('}');
        try {
            const data = JSON.parse(res.substring(firstIndex, lastIndex + 1));
            console.log('type', typeof(data['TotalAmount']), typeof(data['BaseAmount']))
            setResult(data);
            setTotalAmount(data['TotalAmount'] + data['Currency'])
            setBaseAmount(data['BaseAmount'] + data['Currency'])
            setTax(data['Tax'] + data['Currency'])
            setProviderName(data['ProviderName'])
            setCIF(data['CIF'])
            setInvoiceDate(data['InvoiceDate'])
            setInvoiceNumber(data['InvoiceNumber'])
            setTaxRate(data['TaxRate'])

            // data["Tax"] = Number(data["Tax"].replace(/[^0-9.]/g, ""));
            // data["BaseAmount"] = Number(data["BaseAmount"].replace(/[^0-9.]/g, ""));
            // data["TotalAmount"] = Number(data["TotalAmount"].replace(/[^0-9.]/g, ""));
            
            // data["Tax"] = data["Tax"];
            // data["BaseAmount"] = Number(data["BaseAmount"].replace(/[^0-9.]/g, ""));
            // data["TotalAmount"] = Number(data["TotalAmount"].replace(/[^0-9.]/g, ""));
            // data["Currency"] = data["Currency"];
            console.log("data:::", data);
            onInvoiceDataExtracted(index, JSON.stringify(data));
        } catch (e) {
console.log(e)
        }
        setParsing(false);
    }

    useEffect(() => {
        if (parse) {
            extractInvoiceData();
        }
    }, [parse])
    const changeInput = (field, e) => {
        
        if(field == 'BaseAmount'){
            let v = e.target.value
            console.log('vvv', v)

            if(v== ''){
                v = '0'
            }
            let number = parseFloat(v.match(/[0-9.]+/)[0]);
            let tmp = result
            tmp[field] = number;
            tmp['TotalAmount'] = number + tmp['Tax']
            console.log('field',field, e.target.value, tmp)
            setResult(tmp)
            onInvoiceDataExtracted(index, JSON.stringify(tmp));
            setTotalAmount(tmp['TotalAmount'] + tmp['Currency'])

            setBaseAmount(e.target.value)
        }else if( field == 'Tax'){
            let v = e.target.value
            if(v== ''){
                v = '0'
            }
            let number = parseFloat(v.match(/[0-9.]+/)[0]);
            let tmp = result
            tmp[field] = number;
            tmp['TotalAmount'] = number + tmp['BaseAmount']
            setTotalAmount(tmp['TotalAmount'] + tmp['Currency'])
            setResult(tmp)
            onInvoiceDataExtracted(index, JSON.stringify(tmp));

            setTax(e.target.value)

        } else if(field == 'ProviderName'){
            let tmp = result
            tmp[field] = e.target.value;
            onInvoiceDataExtracted(index, JSON.stringify(tmp));
            setProviderName(e.target.value)
        }else if(field == 'CIF'){
            let tmp = result
            tmp[field] = e.target.value;
            onInvoiceDataExtracted(index, JSON.stringify(tmp));
            setCIF(e.target.value)
        }else if(field == 'InvoiceDate'){
            let tmp = result
            tmp[field] = e.target.value;
            onInvoiceDataExtracted(index, JSON.stringify(tmp));
            setInvoiceDate(e.target.value)
        }else if(field == 'TaxRate'){
            let tmp = result
            tmp[field] = e.target.value;
            onInvoiceDataExtracted(index, JSON.stringify(tmp));
            setTaxRate(e.target.value)
        }else if(field == 'InvoiceNumber'){
            let tmp = result
            tmp[field] = e.target.value;
            onInvoiceDataExtracted(index, JSON.stringify(tmp));
            setInvoiceNumber(e.target.value)
        }

    }
    return (
        <div className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 rounded-lg shadow my-2 px-4 py-4 flex items-center h-[3rem]">
            {
                !result ? (
                    <>
                        <p className="w-1/12 text-left ml-4">{index + 1}</p>
                        <p className="grow text-left">
                            {file.name}
                        </p>

                        {parsing && (<div className='flex-none'>
                            <div role="status">
                                <svg aria-hidden="true" className="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                            </div>
                        </div>)
                        }
                    </>
                ) : (
                    <>
                        <p className="w-1/12 text-left ml-4">{index + 1}</p>
                        <input type='text' style={inputStyle} onChange={(e) => changeInput('ProviderName',e)} className="w-4/12" value={ProviderName} ></input>
                        <input type='text' style={inputStyle} onChange={(e) => changeInput('CIF',e)} className="w-2/12" value={CIF} ></input>
                        <input type='text' style={inputStyle} onChange={(e) => changeInput('InvoiceDate',e)} className="w-2/12" value={InvoiceDate} ></input>
                        <input type='text' style={inputStyle} onChange={(e) => changeInput('InvoiceNumber',e)} className="w-2/12" value={InvoiceNumber} ></input>
                        <input type='text' style={inputStyle} onChange={(e) => changeInput('TaxRate',e)} className="w-2/12" value={TaxRate} ></input>
                        <input type='text' style={inputStyle} onChange={(e) => changeInput('BaseAmount',e)} className="w-2/12" value={baseAmount}></input>
                        <input type='text' style={inputStyle} onChange={(e) => changeInput('Tax',e)} className="w-2/12" value={tax} />
                        <input type='text'  style={inputStyle}
                        // onChange={(e) => changeInput('TotalAmount',e)} 
                            className="w-2/12" value={totalAmount} />
                    </>
                )
            }
  
        </div>
    )
}
// import { Configuration, OpenAIApi } from "openai";
// import { useEffect, useState } from "react";


const pdfjsLib = require('pdfjs-dist/webpack');

// Set the location of the PDF.js worker script
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.8.335/pdf.worker.min.js';

export default function SumRow({ data }) {
    return (
        <>
        {
        data.map((sum) => {
          const key = Object.keys(sum);
          const add = Object.prototype.hasOwnProperty.call(sum,key[0])
        if (add) {
            return (
              <div
                key={key[0]}
                className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 rounded-lg shadow my-2 px-4 py-4 flex items-center h-[3rem]"
              >
                <p className="w-1/12 text-left ml-4"></p>
                <p className="w-4/12"></p>
                <p className="w-2/12"></p>
                <p className="w-2/12"></p>
                <p className="w-2/12"></p>
                <p className="w-2/12"></p>
                <p className="w-2/12">{sum[key[0]]["BASum"] + ' ' + key[0]}</p>
                <p className="w-2/12">{sum[key[0]]["TaxSum"] + ' ' +  key[0]}</p>
                <p className="w-2/12">{sum[key[0]]["TASum"] + ' ' +  key[0]}</p>
              </div>
            );
        }
        return null;
        })}
        </>
    );
}
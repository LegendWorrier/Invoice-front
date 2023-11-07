import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import { Radio, Row } from 'antd';

const Usage = ({wholeData, select}) => {
  let data1 = []
  const [data, setData] = useState([]);
  const [conData, setConData] = useState([])
  useEffect(() =>{
    console.log('aa', wholeData[parseInt(select)])
    if(wholeData[parseInt(select)] != undefined){
      let consumVal = wholeData[parseInt(select)]['consumptionfee']

      let endDate = new Date()
      // let dta = []
      for(let i =11; i>= 0; i--){
        const date = new Date(endDate.getFullYear(), endDate.getMonth()-i)
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const formattedDate = `${year}-${month}`;
        if(wholeData[parseInt(select)]['consumptionpermonth'][i] == 0){
        data1.push({year: "" + formattedDate, value: (wholeData[parseInt(select)]['consumptionpermonth'][i] * consumVal)})

        } else {
          data1.push({year: "" + formattedDate, value: parseFloat((wholeData[parseInt(select)]['consumptionpermonth'][i] * consumVal).toFixed(2))})
        }
        
      }
      setData(data1)
      setConData(data1)
      setValue(4)
      console.log('data1', data1)
    }

  }, [wholeData[parseInt(select)]])
 
  //   let data2 = [
  //   {
  //     year: '2017-01',
  //     value: 12
  //   }
  // ];
  // let data3 = [
  //   {
  //     year: '2017-01',
  //     value: 12
  //   },
  //   {
  //     year: '2017-02',
  //     value: 6
  //   },
  //   {
  //     year: '2017-03',
  //     value: 18
  //   },
  // ];
  // let data4 = [
  //   {
  //     year: '2017-01',
  //     value: 12
  //   },
  //   {
  //     year: '2017-02',
  //     value: 6
  //   },
  //   {
  //     year: '2017-03',
  //     value: 18
  //   },
  //   {
  //     year: '2017-04',
  //     value: 24
  //   },
  //   {
  //     year: '2017-05',
  //     value: 96
  //   },
  //   {
  //     year: '2017-06',
  //     value: 23
  //   },
  // ];

  const [value, setValue] = useState(4);

  const onChange = (e) => {
    let dt = []
    if( e.target.value == 4){
      dt = conData
    }else if(e.target.value == 3){
    console.log('graph', e.target.value);

      for(let i = 6; i < 12; i++){
        dt.push(conData[i])
      }
    }else if( e.target.value == 2){
      for(let i = 9; i < 12; i++){
        dt.push( conData[i])
      }
    }else if (e.target.value == 1){
      dt.push(conData[11])
    }
    console.log('ddddd', dt)
    setData(dt)
    setValue(e.target.value);
  };

  const config = (data) => {
    return {
      data,
      xField: 'year',
      yField: 'value',
      label: {},
      point: {
        size: 5,
        shape: 'diamond',
        style: {
          fill: 'white',
          stroke: '#5B8FF9',
          lineWidth: 2
        }
      },
      tooltip: {
        showMarkers: false
      },
      state: {
        active: {
          style: {
            shadowBlur: 4,
            stroke: '#000',
            fill: 'red'
          }
        }
      },
      interactions: [
        {
          type: 'marker-active'
        }
      ]
    };
  };

  return (
    <>
      <Row justify="center" style={{ marginBottom: 20 }}>
        <Radio.Group onChange={onChange} value={value}>
          <Radio value={1}>1 Ultimo Mes</Radio>
          <Radio value={2}>3 mes</Radio>
          <Radio value={3}>6 mes</Radio>
          <Radio value={4}>1 año </Radio>
        </Radio.Group>
      </Row>
      <Line {...config(data)} />

      {/* {value === '' 
      ? 
      <Line {...config(data)} /> 
      : 
      value === 1
      ?
      <Line {...config(data2)} />
      :
      value === 2
      ?
      <Line {...config(data3)} />
      :
      value === 3
      ?
      <Line {...config(data4)} />
      :
      <Line {...config(data)} />
    } */}
    </>
  );
};

export default Usage;

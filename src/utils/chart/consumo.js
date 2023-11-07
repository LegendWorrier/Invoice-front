import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom';
import { Line } from '@ant-design/plots';
import { Radio, Row, Input, Col } from 'antd';

const Consumo = ({wholeData}) => {
  let data1 = []
  const [data, setData] = useState([]);
  const [conData, setConData] = useState([])
  const [uploadVal, setUploadVal] = useState()
  useEffect(() =>{
    console.log('aa', wholeData)
    if(wholeData != undefined){

      let consumVal = wholeData['consumptionfee']
      let sum = 0;
      let endDate = new Date()
      for(let i =11; i>= 0; i--){
        const date = new Date(endDate.getFullYear(), endDate.getMonth()-i)
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const formattedDate = `${year}-${month}`;
        if(wholeData['consumptionpermonth'][i] == 0){
          data1.push({year: "" + formattedDate, value: (wholeData['consumptionpermonth'][i] * consumVal)})
  
          } else {
          console.log('bbbb', (wholeData['consumptionpermonth'][i] * consumVal).toFixed(2))
          let val = wholeData['consumptionpermonth'][i] 
          sum += val
          data1.push({year: "" + formattedDate, value: val})

          }
      }
      setUploadVal(sum)
      setData(data1)
      setConData(data1)
      setValue(4)
      console.log('data1', data1)
    }

  }, [wholeData])
 
  const [value, setValue] = useState(4);

  const onChange = (e) => {
    let dt = []
    if( e.target.value == 4){
      dt = conData
      let tmp_sum = 0;
      conData.map(dat => {
        tmp_sum += dat.value
      })
      console.log('annual', tmp_sum)

      setUploadVal(tmp_sum)
    }else if(e.target.value == 3){
      let tmp_sum = 0;


      for(let i = 6; i < 12; i++){
        dt.push(conData[i])
        tmp_sum += conData[i].value
      }
    console.log('graph', e.target.value, tmp_sum);

      setUploadVal(tmp_sum)

    }else if( e.target.value == 2){
      let tmp_sum = 0;
      for(let i = 9; i < 12; i++){
        dt.push( conData[i])
        tmp_sum += conData[i].value

      }
      setUploadVal(tmp_sum)

    }else if (e.target.value == 1){
      dt.push(conData[11])
    setUploadVal(conData[11].value)

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
          <Radio value={1}>1 mes</Radio>
          <Radio value={2}>3 mes</Radio>
          <Radio value={3}>6 mes</Radio>
          <Radio value={4}>1 año </Radio>
        </Radio.Group>
      </Row>
      <Line {...config(data)} />
      <br />
      <Row>
        <Col  offset={10} push={0} span={4}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px' }}>Upload Number:</span>
            <Input disabled value={uploadVal}/>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Consumo;

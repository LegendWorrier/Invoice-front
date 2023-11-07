import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom';
import { Line } from '@ant-design/plots';
import { Radio, Row, Col, Input } from 'antd';

const Cuota = ({wholeData}) => {
  let data1 = []
  const [data, setData] = useState([]);
  const [conData, setConData] = useState([])
  const [userVal, setUserVal] = useState()
  useEffect(() =>{

    if(wholeData != undefined){
      console.log('aa', wholeData)
      // wholeData = wholeData.wholeData
      let fee = wholeData['fee']

      let endDate = new Date()
      let sum = 0
      // let dta = []
      for(let i =11; i>= 0; i--){
        const date = new Date(endDate.getFullYear(), endDate.getMonth()-i)
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const formattedDate = `${year}-${month}`;
        data1.push({year: "" + formattedDate, value: (wholeData['quotapermonth'][i] * fee)})
        sum += wholeData['quotapermonth'][i] * fee
      }
      setUserVal(sum)
      setData(data1)
      setConData(data1)
      setValue(4)

      console.log('data1', data1)
    }

  }, [wholeData])

  // let data2 = [
  //   {
  //     year: '2022-01',
  //     value: 1.8
  //   }
  // ];
  // let data3 = [
  //   {
  //     year: '2022-01',
  //     value: 1.8
  //   },
  //   {
  //     year: '2022-02',
  //     value: 1.2
  //   },
  //   {
  //     year: '2022-03',
  //     value: 3.6
  //   }
  // ];
  // let data4 = [
  //   {
  //     year: '2022-01',
  //     value: 1.8
  //   },
  //   {
  //     year: '2022-02',
  //     value: 1.2
  //   },
  //   {
  //     year: '2022-03',
  //     value: 3.6
  //   },
  //   {
  //     year: '2022-04',
  //     value: 2.8
  //   },
  //   {
  //     year: '2022-05',
  //     value: 1.4
  //   },
  //   {
  //     year: '2022-06',
  //     value: 5.8
  //   }
  // ];

  const [value, setValue] = useState(4);
  const onChange = (e) => {
    let dt = []
    if( e.target.value == 4){
      dt = conData
      let tmp_sum = 0;
      console.log('fff', conData)
      conData.map(dat => {
        tmp_sum += dat.value
      })
      setUserVal(tmp_sum)
    }else if(e.target.value == 3){
      let tmp_sum = 0;

    console.log('graph', e.target.value);

      for(let i = 6; i < 12; i++){
        dt.push(conData[i])
        tmp_sum += conData[i].value

      }
      setUserVal(tmp_sum)

    }else if( e.target.value == 2){
      let tmp_sum = 0;

      for(let i = 9; i < 12; i++){
        dt.push( conData[i])
        tmp_sum += conData[i].value

      }
      setUserVal(tmp_sum)

    }else if (e.target.value == 1){
      dt.push(conData[11])
    setUserVal(conData[11].value)

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
            <span style={{ marginRight: '8px' }}>Fees:</span>
            <Input disabled value={userVal}/>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Cuota;
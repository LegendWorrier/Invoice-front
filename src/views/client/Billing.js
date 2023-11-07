import React, {useState, useEffect} from 'react';
import { Row, Col,  } from 'antd';
import Cuota from '../../utils/chart/cuota'
import Consumo from '../../utils/chart/consumo'
// import InputNum from '../../utils/client/InputNum';
// import { InputNumber } from 'antd'
import { connect } from 'react-redux';
import axios from 'axios'
import serverconfig from '../../config';

// const { RangePicker } = DatePicker;


const Billing = ({storeState}) => {

  // const [cuota, setCuota] = useState(6)
  // const [consumo, setConsumo] = useState(0.2)
  const [data, setData] = useState()
  const [select, setSelect] = useState()
  useEffect(() => {
    console.log('storeSate', storeState.customization.auth)

    getData();

  }, []);

  const getData = async () => {
    let data = {}

      const consumPermonth = await axios.post(serverconfig.API_URL + 'api/users/getbills', {agency_id: storeState.customization.auth._id });
      console.log('response', consumPermonth.data);
      data['consumptionpermonth'] = consumPermonth.data
      data['consumptionfee'] = parseFloat(storeState.customization.auth.consumption)

      const userPermonth = await axios.post(serverconfig.API_URL + 'api/users/getusers', {agency_id: storeState.customization.auth._id });

      data['quotapermonth'] = userPermonth.data
      data['fee'] = storeState.customization.auth.fee
      console.log('data', data)
      setSelect('0')
      setData(data) 
  };

  // const onCuota = (value) => {
  //   setCuota(value)
  //   console.log('changed', cuota);

  // };

  // const onConsumo = (value) => {
  //   setConsumo(value)
  //   console.log('changed', consumo);
  // }

  return (
    <>

      <Row justify="space-evenly" style={{marginTop: 20}}>
        <Col span={12}>
        <Row justify="center">
            <h1>Gráfico de Consumo</h1>
          </Row>
          <Consumo wholeData={data} select={select} />
        </Col>
        <Col span={12}>
        <Row justify="center">
            <h1>Gráfico de Cuotas</h1>
          </Row>
          <Cuota wholeData={data} select={select}/>
        </Col>
      </Row>
    </>
  );
};

// export default Billing;
const mapStateToProps = (state) => ({
  storeState: state,
});

export default connect(mapStateToProps)(Billing);

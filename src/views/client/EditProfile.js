import React, {useState, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import { Row, Col, Button, InputNumber, Input } from 'antd';
import { connect } from 'react-redux';
  import axios from 'axios';
  import serverconfig from '../../config';
// import { useNavigate } from 'react-router-dom';

import { useParams } from 'react-router';
import { setUserData } from '../../store/actions'
import { notification } from 'antd';


const EditProfile = ({wholeState, setUserData}) => {
  const params = useParams();
  const userID = params.id;

  // const [value, setValue] = useState('')
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [cif, setCif] = useState('');
  const [iva, setIva] = useState('');
  const [cuota, setCuota] = useState(6);
  const [month, setMonth] = useState(0)
  const [quater, setQuater] = useState(0)
  const [year, setYear] = useState(0)
  const [consumo, setConsumo] = useState(0.2);
  const [bill, setBill] = useState()

  const [irpf, setIrpf] = useState('');
  const [license, setLicense] = useState('');
  // const navigate = useNavigate();

  useEffect(() => {
    getData()

  }, []);

  const getData = async () => {
    console.log('editprofile', wholeState.customization.userData, userID)
    wholeState.customization.userData.map(index => {
      if( index.user._id == userID){
        console.log('index', index)
        setFname(index.user.fname)
        setLname(index.user.lname)
        setEmail(index.user.email)
        setCif(index.user.cif)
        setIrpf(index.user.irpf)
        setIva(index.user.iva)
        setLicense(index.user.license)
        setConsumo(index.user.consumption)
        setCuota(index.user.fee)
        let endDate = new Date()
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentQuarter = Math.floor(currentMonth / 3) + 1;
        let tem_month = 0, tem_year = 0, tem_quater = 0
        for(let i = 0; i < index.invoice.length; i ++){
          if( new Date(endDate.getFullYear(), endDate.getMonth(), 1, 0, 0, endDate.getSeconds(), endDate.getMilliseconds()) < new Date(index.invoice[i].Date)){
            tem_month++
          }
          if(new Date(endDate.getFullYear(), (currentQuarter- 1)*3 + 1, 1, endDate.getHours(), endDate.getMinutes(), endDate.getSeconds(), endDate.getMilliseconds()) < new Date(index.invoice[i].Date)){
            tem_quater++
            
          }
          if(new Date(endDate.getFullYear(), endDate.getMonth()- 12, 1, endDate.getHours(), endDate.getMinutes(), endDate.getSeconds(), endDate.getMilliseconds()) < new Date(index.invoice[i].Date)){
            tem_year++
          }
        }
        setMonth((tem_month ))
        setQuater((tem_quater ))
        setYear((tem_year ))
        setBill((tem_quater * index.user.consumption).toFixed(2))

        console.log('data', tem_month, tem_year, tem_quater)

      }
    })
  }

  const onFName = (e) => {
    setFname(e.target.value);
  };
  const onLName = (e) => {
    setLname(e.target.value);
  };
  const onCIF = (e) => {
    setCif(e.target.value);
  };
  const onLicense = (e) => {
    setLicense(e.target.value);
  };

  const onEmail = (e) => {
    setEmail(e.target.value);
  };

  const onIva = (e) => {
    setIva(e.target.value);
  };
  const onCuota = (value) => {
    setCuota(value);
  };
  const onConsumo = (value) => {
    setConsumo(value);
    setBill((quater * value).toFixed(2))

  };
  const onSave = () => {

    axios
    .post(serverconfig.API_URL + 'api/users/editclientUser', {
      fname: fname,
      lname: lname,
      cif: cif,
      iva: iva,
      irpf: irpf,
      license: license,
      email: email,
      tableID: userID,
      consumption: consumo,
      fee: cuota
    })
    .then(() => {
      notification.success({
        description: ' Guardar éxito!',
        placement: 'bottomRight',
        duration: 2
      });
      let tmp = wholeState
      tmp.customization.userData.map(index => {
        if( index.user._id == userID){
          console.log('index', index)
          index.user.fname = fname
          index.user.lname = lname
          index.user.email = email
          index.user.cif = cif
          index.user.iva = iva
          index.user.license = license
          index.user.consumption = consumo
          index.user.fee = cuota
 
        }
      })
      console.log('bbbbb', tmp.customization.userData)
      setUserData(tmp.customization.userData)

      navigate('/dashboard/client/user_accounts');
    })
    .catch((err) => {
      console.log(err);
    });

  }
  return (
    <>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth label="nombre de pila" onChange={onFName} value={fname}  variant="standard" />
        </Col>
        <Col span={8} align="center">
          <TextField id="standard-basic"  fullWidth label="apellido" onChange={onLName} value={lname} variant="standard" />
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField id="standard-basic"  fullWidth label="Cantidad IVa" onChange={onIva} value={iva} variant="standard" />
        </Col>
        <Col span={8} align="center">
          <TextField id="standard-basic"  fullWidth label="CIF/DNI" onChange={onCIF} value={cif} variant="standard" />
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField id="standard-basic"  fullWidth label="correo electrónico" onChange={onEmail} value={email}  variant="standard" />
        </Col>
        <Col span={8} align="center">
          <TextField id="standard-basic"  fullWidth label="licencia" onChange={onLicense} value={license} variant="standard" />
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} >

        </Col>
        <Col span={8}>

          {/* <TextField id="standard-basic" fullWidth  label="Consumo por página" variant="standard" /> */}
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}>

        <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Col span={12}>
              <div>Facturaa Subidas el ultimo mes</div>
            </Col>
            <Col span={6}>
              <Input disabled value={month} />
            </Col>
          </Row>
          {/* <TextField id="standard-basic" fullWidth  label="Consumo por página" variant="standard" /> */}
        </Col>
        <Col span={8}>
        <Row  style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Col span={12}>
              <div>Fasturas Subidas el Ultimo Trimestre</div>
            </Col>
            <Col span={6}>
              <InputNumber min={6} max={100000}  value={cuota} onChange={onCuota} />
            </Col>
          </Row>

        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}>
          <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Col span={12}>
              <div>Facturas Subidas al Ano</div>
            </Col>
            <Col span={6}>
              <Input disabled value={quater}  />
            </Col>
          </Row>
          {/* <TextField id="standard-basic" fullWidth  label="Consumo por página" variant="standard" /> */}
        </Col>
        <Col span={8}>
        <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Col span={12}>
              <div>Consumo por página</div>
            </Col>
            <Col span={6}>
              <InputNumber min={0.2} max={100000}  value={consumo} onChange={onConsumo} />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}>
          <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Col span={12}>
              <div>Upload Counter año</div>
            </Col>
            <Col span={6}>
              <Input disabled value={year}  />
            </Col>
          </Row>
          {/* <TextField id="standard-basic" fullWidth  label="Consumo por página" variant="standard" /> */}
        </Col>
        <Col span={8}>
        <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Col span={12}>
              <div>Consumo a Facturar</div>
            </Col>
            <Col span={6}>
              <Input disabled value={bill} />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row style={{justifyContent:'center', marginTop: '29vh'}}>
        <Button type='primary' onClick={onSave}>Editar</Button>
      </Row>
    </>
  );
};

const mapStateToProps = (state) => ({
  wholeState: state,
});

export default connect(mapStateToProps, {setUserData})(EditProfile);
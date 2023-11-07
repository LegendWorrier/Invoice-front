import React, { useState, useEffect } from 'react';
import { Row, Col, Button, notification, InputNumber, Input } from 'antd';
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router';
import axios from 'axios';
import serverconfig from '../../../config';
// import { useNavigate } from 'react-router-dom';


const AgencyProfile = () => {
  const params = useParams();
  const userID = params.id;

  const [name, setName] = useState('');
  const [cif, setCIF] = useState('');
  const [cuota, setCuota] = useState(6);
  const [consumo, setConsumo] = useState(0.2);
  const [bankAccount, setBankAccount] = useState('');
  const [license, setLicense] = useState('');
  const [contactName, setContactName] = useState('');
  const [id, setID] = useState('');
  const [phone, setPhone] = useState('');
  const [mail, setMail] = useState('');

  const [month, setMonth] = useState(0)
  const [quater, setQuater] = useState(0)
  const [bill, setBill] = useState()
  const [year, setYear] = useState(0)

  useEffect(() => {
    getData()

  }, []);
  const getData = async () => {
    let annual = 0, month = 0, quarter = 0
    let endDate = new Date()

    let client = await axios.post(serverconfig.API_URL + 'api/users/getAgency', { id: userID })
    setName(client.data.name);
    setCIF(client.data.cif);
    setCuota(client.data.fee);
    setConsumo(client.data.consumption);
    setBankAccount(client.data.bankAccount)
    setLicense(client.data.license)
    setContactName(client.data.contactName)
    setID(client.data.id)
    setPhone(client.data.phone)
    setMail(client.data.mail)
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentQuarter = Math.floor(currentMonth / 3) + 1;
    let invoices = await axios.get(serverconfig.API_URL + 'api/users/getInvoices')
    
    for(let j =0; j< invoices.data.data.length; j++){
      if(invoices.data.data[j].ClientId == userID && new Date(endDate.getFullYear(), endDate.getMonth() -12, 1)<new Date(invoices.data.data[j].Date)){
        annual ++;
      }
      if(invoices.data.data[j].ClientId == userID && new Date(endDate.getFullYear(), endDate.getMonth(), 1)<new Date(invoices.data.data[j].Date)){
        month ++;
      }
      if(invoices.data.data[j].ClientId == userID && new Date(endDate.getFullYear(), (currentQuarter-1)*3 + 1, 1)<new Date(invoices.data.data[j].Date)){
        quarter ++;
      }
    }
    setMonth(month )
    setQuater(quarter)
    setYear(annual)
    setBill((quarter * client.data.consumption).toFixed(2))
    console.log('invoices', invoices)
  }
  const onName = (e) => {
    setName(e.target.value);
  };

  const onCIF = (e) => {
    setCIF(e.target.value);
  };

  const onCuota = (value) => {
    setCuota(value);
  };

  const onConsumo = (value) => {
    setConsumo(value);
    setBill((quater * value).toFixed(2))

  };

  const onMail = (e) => {
    setMail(e.target.value);
  };
  const onPhone = (e) => {
    setPhone(e.target.value);
  };
  const onID = (e) => {
    setID(e.target.value);
  };
  const onLicense = (e) => {
    setLicense(e.target.value);
  };
  const onContactName = (e) => {
    setContactName(e.target.value);
  };
  const onBankAccount = (e) => {
    setBankAccount(e.target.value);
  };

  const onEdit = () => {
    axios
      .post(serverconfig.API_URL + 'api/users/editAgency', {
        name: name,
        cif: cif,
        tableID: userID,
        fee: cuota,
        consumption: consumo,
        bankAccount: bankAccount,
        license: license,
        contactName: contactName,
        id: id,
        phone: phone,
        mail: mail
      })
      .then(() => {
        notification.success({
          description: ' Guardar éxito!',
          placement: 'bottomRight',
          duration: 2 
        });
        // navigate('/dashboard/admin/agency_clients');
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <Row>
        <Col span={24}>
          <h2>Perfil</h2>
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth value={name} onChange={onName} label="Nombre" variant="standard" />
        </Col>
        <Col span={8} align="center">
        <TextField id="standard-basic" value={license} onChange={onLicense} fullWidth label="Número de Licencia" variant="standard" />


        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth value={cif} onChange={onCIF} label="CIF/DNI" variant="standard" />
        </Col>
        <Col span={8} align="center">
        <TextField id="standard-basic" value={id} onChange={onID} fullWidth label="Agencia ID" variant="standard" />

          {/* <TextField id="standard-basic" fullWidth  label="Consumo por página" variant="standard" /> */}
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField
            id="standard-basic"
            value={bankAccount}
            onChange={onBankAccount}
            fullWidth
            label="Cuenta Bancaria"
            variant="standard"
          />
        </Col>
        <Col span={8} align="center">
        <TextField id="standard-basic" value={mail} onChange={onMail} fullWidth label="Mail" variant="standard" />

        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField
            id="standard-basic"
            value={contactName}
            onChange={onContactName}
            fullWidth
            label="Nombre de Contacto"
            variant="standard"
          />
        </Col>
        <Col span={8} align="center">

        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField id="standard-basic" value={phone} onChange={onPhone} fullWidth label="Teléfono" variant="standard" />
        </Col>
        <Col span={8} align="center">

        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}>

        <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Col span={12}>
              <div>Upload Counter Month</div>
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
              <div>Cuota mensual</div>
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
              <div>Upload Counter Trimestre</div>
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
              <div>COST TO BILL</div>
            </Col>
            <Col span={6}>
              <Input disabled value={bill} />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Row align="center" style={{ marginTop: '20vh' }}>
            <Button type="primary" size="large" onClick={onEdit}>
              Editar
            </Button>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default AgencyProfile;

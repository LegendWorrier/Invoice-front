import React, { useState, useEffect } from 'react';
import { Row, Col, Button, notification, Input, InputNumber } from 'antd';
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router';
import axios from 'axios';
import serverconfig from '../../../config';
// import { useNavigate } from 'react-router-dom';
import {Select, MenuItem} from '@mui/material'

const UserProfile = () => {
  const [fname, setFName] = useState('');
  const [lname, setLName] = useState('');

  const [cif, setCIF] = useState('');
  const [email, setEmail] = useState('');
  const [irpf, setIrpf] = useState('');
  // const [agency, setAgency] = useState('');
  const [tax, setTax] = useState('');
  const [license, setLicense] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [clientInfo, setClientInfo] = useState([])
  const [cuota, setCuota] = useState();
  const [consumo, setConsumo] = useState();
  const [month, setMonth] = useState(0)
  const [quater, setQuater] = useState(0)
  const [year, setYear] = useState(0)
  const [bill, setBill] = useState()
  const params = useParams();
  const userID = params.id;
  // const navigate = useNavigate();

  useEffect(() => {
    getData()

  }, []);

  const getData = async () => {
    const user = await axios.post(serverconfig.API_URL + 'api/users/getUser', { id: userID })
    const clients = await axios.get(serverconfig.API_URL + 'api/users/getclients')
    const invoices = await axios.get(serverconfig.API_URL + 'api/users/invoicelist')
    setFName(user.data.fname);
    setLName(user.data.lname)
    setCIF(user.data.cif);
    setEmail(user.data.email);
    setIrpf(user.data.irpf);
    // setAgency(user.data.agency);
    setLicense(user.data.license);
    setContactName(user.data.contactName);
    setTax(user.data.tax);
    setPhone(user.data.phone);
    setClientInfo(clients.data)
    setSelectedValue(user.data.agency_id)
    let annual = 0, month = 0, quarter = 0
    let endDate = new Date()
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentQuarter = Math.floor(currentMonth / 3) + 1;

    for(let j = 0;j < invoices.data.length; j ++){

      if(invoices.data[j].UserId == userID && new Date(endDate.getFullYear(), endDate.getMonth() -12, 1)<new Date(invoices.data[j].Date)){
        annual ++;
      }
      if(invoices.data[j].UserId == userID && new Date(endDate.getFullYear(), endDate.getMonth(), 1)<new Date(invoices.data[j].Date)){
        month ++;
      }
      if(invoices.data[j].UserId == userID && new Date(endDate.getFullYear(), (currentQuarter-1)*3 + 1, 1)<new Date(invoices.data[j].Date)){
        quarter ++;
      }
    }
    setCuota(user.data.fee)
    setConsumo(user.data.consumption)
    setMonth(month )
    setQuater(quarter)
    setYear(annual)
    setBill((quarter * user.data.consumption).toFixed(2))
    console.log('users', user, clients)
  }

  const onFName = (e) => {
    setFName(e.target.value);
  };
  const onLName = (e) => {
    setLName(e.target.value);
  };
  const onCIF = (e) => {
    setCIF(e.target.value);
  };

  const onTax = (e) => {
    setTax(e.target.value);
  };
  const onPhone = (e) => {
    setPhone(e.target.value);
  };
  const onLicense = (e) => {
    setLicense(e.target.value);
  };
  const onContactName = (e) => {
    setContactName(e.target.value);
  };
  const onEmail = (e) => {
    setEmail(e.target.value);
  };
  const onIrpf = (e) => {
    setIrpf(e.target.value);
  };
  const onCuota = (value) => {

    setCuota(value);
  };
  const onConsumo = (value) => {
    setMonth((month ))
    setQuater((quater ))
    setYear((year ))
    setConsumo(value);
    setBill((quater * value).toFixed(2))

  };
  // const onAgency = (e) => {
  //   setAgency(e.target.value);
  // };

  const onEdit = () => {
    axios
      .post(serverconfig.API_URL + 'api/users/editUser', {
        fname: fname,
        lname: lname,
        cif: cif,
        agency_id: selectedValue,
        irpf: irpf,
        // tax: tax,
        license: license,
        // contactName: contactName,
        // phone: phone,
        consumption: consumo,
        fee: cuota,
        email: email,
        tableID: userID
      })
      .then(() => {
        notification.success({
          description: ' Guardar éxito!',
          placement: 'bottomRight',
          duration: 2
        });
        // navigate('/dashboard/admin/user_clients');
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
        <Col span={3}>
        <TextField id="standard-basic" value={fname} onChange={onFName}  label="Nombre de pila" variant="standard" />
        </Col>
        <Col span={3}>
        <TextField id="standard-basic" value={lname} onChange={onLName}  label="Apellido" variant="standard" />
        </Col>
        <Col span={8}>
          <TextField id="standard-basic" disabled value={tax} onChange={onTax} fullWidth label="Impuesto" variant="standard" />
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}>
          <TextField id="standard-basic" value={cif} onChange={onCIF} fullWidth label="CIF/DNI" variant="standard" />
        </Col>
        <Col span={8}>
          <TextField id="standard-basic" value={irpf} onChange={onIrpf} fullWidth label="IRPF" variant="standard" />
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}>
          <TextField
          disabled
            id="standard-basic"
            value={contactName}
            onChange={onContactName}
            fullWidth
            label="Nombre de contacto"
            variant="standard"
          />
        </Col>
        <Col span={8}>
          <TextField id="standard-basic"  value={license} onChange={onLicense} fullWidth label="Número de licencia" variant="standard" />
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}>
          <TextField id="standard-basic" value={phone} onChange={onPhone} fullWidth label="Contacto telefonico" variant="standard" />
        </Col>
        <Col span={8}>
          {/* <TextField id="standard-basic" value={agency} onChange={onAgency} fullWidth label="Agencia Relacionada" variant="standard" /> */}
          <Select
            fullWidth
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedValue}
            onChange={(event) => setSelectedValue(event.target.value)}
          >
          {clientInfo.map((client) => (
            <MenuItem key={client._id} value={client._id}>
              {client.id}
            </MenuItem>
          ))}
                      {/* <MenuItem value={1}>Option 1</MenuItem>
                      <MenuItem value={2}>Option 2</MenuItem>
                      <MenuItem value={3}>Option 3</MenuItem> */}
            </Select>
          {/* <TextField id="standard-basic" fullWidth label="Restablecer licencia" variant="standard" /> */}
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8}>
          <TextField id="standard-basic" value={email} onChange={onEmail} fullWidth label="Contacto de correo" variant="standard" />
        </Col>
        <Col span={8}></Col>
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
          <Row align="center" style={{ marginTop: '15vh' }}>
            <Button type="primary" size="large" onClick={onEdit}>
              Editar
            </Button>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default UserProfile;

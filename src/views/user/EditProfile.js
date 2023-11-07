import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Row, Col, Button, notification } from 'antd';
import axios from 'axios';
import serverconfig from '../../config';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [username, setName] = useState('');
  const [cif, setCif] = useState('');
  const [iva, setIva] = useState('');
  const [irpf, setIrpf] = useState('');
  const [useremail, setEmail] = useState('');
  const [anual, setAnual] = useState('');
  const [mensual, setMensual] = useState('');
  const [tel, setTel] = useState('');

  const navigate = useNavigate();

  let oldemail = window.localStorage.getItem('email');

  const onName = (e) => {
    setName(e.target.value);
  };
  const onCif = (e) => {
    setCif(e.target.value);
  };
  const onIrpf = (e) => {
    setIrpf(e.target.value);
  };
  const onIva = (e) => {
    setIva(e.target.value);
  };
  const onEmail = (e) => {
    setEmail(e.target.value);
  };
  const onAnual = (e) => {
    setAnual(e.target.value);
  };
  const onMensual = (e) => {
    setMensual(e.target.value);
  };
  const onTel = (e) => {
    setTel(e.target.value);
  };
  const onSave = () => {
    axios
      .post(serverconfig.API_URL + 'api/users/edit', {
        fname: username,
        email: useremail,
        oldemail: oldemail,
        cif: cif,
        iva: iva,
        irpf:irpf,
        anual: anual,
        mensual: mensual,
        tel: tel,
      })
      .then(() => {
        notification.success({
          description: 'Registro exitoso!',
          placement: 'bottomRight',
          duration: 2 // Duration in seconds (optional)
        });
        navigate('/dashboard/user/profile');
      })
      .catch(() =>
        notification.error({
          description: 'Registro fallida!',
          placement: 'bottomRight',
          duration: 2 // Duration in seconds (optional)
        })
      );
    // if (value == '') {
    //   notification.warning({
    //     description: 'Campo de entrada!',
    //     placement: 'bottomRight',
    //     duration: 2 // Duration in seconds (optional)
    //   });
    // } else {
    //   notification.success({
    //     description: ' Guardar éxito!',
    //     placement: 'bottomRight',
    //     duration: 2 // Duration in seconds (optional)
    //   });
    // }
  };
  return (
    <>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth label="Nombre" value={username} onChange={onName} variant="standard" />
        </Col>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth label="CIF/DNI" value={cif} onChange={onCif} variant="standard" />
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth label="Cantidad IVa" value={iva} onChange={onIva} variant="standard" />
        </Col>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth label="Cuota Mensual" value={irpf} onChange={onIrpf} variant="standard" />
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth label="Teléfono" value={tel} onChange={onTel} variant="standard" />
        </Col>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth label="Correo electrónico" value={useremail} onChange={onEmail} variant="standard" />
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth label="Contador Anual" value={anual} onChange={onAnual} variant="standard" />
        </Col>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth label="Contador mensual" value={mensual} onChange={onMensual} variant="standard" />
        </Col>
      </Row>

      <Row style={{ justifyContent: 'center' }}>
        <Button type="primary" onClick={onSave}>
          Guardar
        </Button>
      </Row>
    </>
  );
};

export default EditProfile;

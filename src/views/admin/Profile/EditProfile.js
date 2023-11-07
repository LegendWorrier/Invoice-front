import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import { Row, Col, Button, notification } from 'antd';

const EditProfile = () => {
  const [value, setValue] = useState('')

  const onChange = (e) => {
    setValue(e.target.value)
  }
  const onSave = () => {
    if(value == '') {
      notification.warning({
        description: 'Campo de entrada!',
        placement: 'bottomRight',
        duration: 2 // Duration in seconds (optional)
      });
    } else {
      notification.success({
        description: ' Guardar éxito!',
        placement: 'bottomRight',
        duration: 2 // Duration in seconds (optional)
      });
    }
  }
  return (
    <>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth value={value} onChange={onChange} label="Nombre" variant="standard" />
        </Col>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth label="CIF/DNI" variant="standard" />
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth label="Cantidad IVa" variant="standard" />
        </Col>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth label="Cuota Mensual" variant="standard" />
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth label="Nombre" variant="standard" />
        </Col>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth label="Cuota Mensual" variant="standard" />
        </Col>
      </Row>
      <Row style={{justifyContent:'center'}}>
        <Button type='primary' onClick={onSave}>Guardar</Button>
      </Row>
    </>
  );
};

export default EditProfile;

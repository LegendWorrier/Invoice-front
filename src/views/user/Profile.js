import React from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { Button, Row, Col, notification  } from 'antd';
import TextField from '@mui/material/TextField';

import { useEffect, useState } from 'react';
import axios from 'axios';
import serverconfig from '../../config';
import { connect } from 'react-redux';
import {authLogin } from '../../store/actions'
// import './upload.css';

const Profile = ({storeState, authLogin}) => {
  // const [isLoading, setLoading] = useState(true);
  const [username, setName] = useState('')
  const [cif, setCif] = useState('')
  const [iva, setIva] = useState('')
  // const [irpf, setIrpf] = useState('')
  const [useremail, setEmail] = useState('')
  // const [anual, setAnual] = useState('')
  // const [mensual, setMensual] = useState('')
  // const [tel, setTel] = useState('')
  const [agencyid, setAgencyId] = useState('')
  const [quater, setQuater] = useState()

  useEffect(() => {
    // setLoading(false);
    getData();
  }, []);
  // let email = window.localStorage.getItem('email');
  // let lname = window.localStorage.getItem('lname');

  const onChange = (str,e) => {
    if(str == 'username'){
      setName(e.target.value)
    }else if(str == 'cif'){
      setCif(e.target.value)

    }else if(str == 'iva'){
      setIva(e.target.value)

    }else if(str == 'email'){
      setEmail(e.target.value)

    }
  }

  const getData = async() => {
    const invoices = await axios.get(serverconfig.API_URL + 'api/users/invoicelist')
    let quarter = 0
    let endDate = new Date()

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentQuarter = Math.floor(currentMonth / 3) + 1;

    for(let j = 0;j < invoices.data.length; j ++){

      if(invoices.data[j].UserId == storeState.customization.auth.data._id && new Date(endDate.getFullYear(), endDate.getMonth() -12, endDate.getDate())<new Date(invoices.data[j].Date)){
        // annual ++;
      }
      if(invoices.data[j].UserId == storeState.customization.auth.data._id && new Date(endDate.getFullYear(), endDate.getMonth() -1, endDate.getDate())<new Date(invoices.data[j].Date)){
        // month ++;
      }
      if(invoices.data[j].UserId == storeState.customization.auth.data._id && new Date(endDate.getFullYear(), (currentQuarter-1) * 3 + 1, endDate.getDate())<new Date(invoices.data[j].Date)){
        quarter ++;
      }
    }
    console.log('ss', quarter)
    setName(storeState.customization.auth.data.fname)
    setCif(storeState.customization.auth.data.cif)
    setQuater(storeState.customization.auth.data.consumption * quarter)
    setIva(storeState.customization.auth.data.iva)
    // setIrpf(storeState.customization.auth.data.irpf)
    setEmail(storeState.customization.auth.data.email)
    // setAnual(storeState.customization.auth.data.anual)
    // setMensual(storeState.customization.auth.data.mensual)
    // setTel(storeState.customization.auth.data.tel)
    setAgencyId(storeState.customization.auth.data.agency_id.id)
    
  };
  const onSave = () => {
    console.log('store', storeState.customization)
    let data = {
       _id: storeState.customization.auth.data._id,
       name: username,
       cif: cif,
       iva: iva,
       mail: useremail
     }
     axios.post(serverconfig.API_URL + 'api/users/updateUser', data)
       .then((res) => {
         console.log('res', res.data)
           if(res.data.status == 'success'){
           authLogin(res.data)
             notification.success({
               description: ' Guardar éxito!',
               placement: 'bottomRight',
               duration: 2 // Duration in seconds (optional)
             });
       
           }
       })



 }
  return (
    <section>
      <MDBContainer className="py-5">
        <MDBRow className="justify-content-center">
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="5">
                    <MDBCardText>Nombre</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="7">
                    <MDBCardText className="text-muted">{username}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="5">
                    <MDBCardText>CIF/DNI</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="7">
                    <MDBCardText className="text-muted">{cif}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="5">
                    <MDBCardText>Cantidad IVa</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="7">
                    <MDBCardText className="text-muted">{iva}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                {/* <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Cantidad IRPF</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{irpf}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Teléfono</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{tel}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr /> */}
                <MDBRow>
                  <MDBCol sm="5">
                    <MDBCardText>Correo electrónico</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="7">
                    <MDBCardText className="text-muted">{useremail}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="5">
                    <MDBCardText>Número de licencia</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="7">
                    <MDBCardText className="text-muted">3424-234-2342</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="5">
                    <MDBCardText>identificador de agencia</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="7">
                    <MDBCardText className="text-muted">{agencyid}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="5">
                    <MDBCardText>Upload Counter Trimestre</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="7">
                    <MDBCardText className="text-muted">{quater + '€'}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                {/* <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Contador mensual</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{mensual}</MDBCardText>
                  </MDBCol>
                </MDBRow> */}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth label="Nombre" value={username} onChange={(e) => onChange('username', e)} variant="standard" />
        </Col>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth label="CIF/DNI" value={cif} onChange={(e) => onChange('cif', e)} variant="standard" />
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth label="Nombre de contacto" value={iva} onChange={(e) => onChange('iva', e)} variant="standard" />
        </Col>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth label="Correo electrónico" value={useremail} onChange={(e) => onChange('email', e)} variant="standard" />
        </Col>
      </Row>
      <Row style={{justifyContent:'center'}}>
        <Button type='primary' onClick={onSave}>Guardar</Button>
      </Row>
    </section>
  );
};

const mapStateToProps = (state) => ({
  storeState: state,
});
export default connect(mapStateToProps,{authLogin})(Profile);
// export default Profile;
// 
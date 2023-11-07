import React from 'react'
import {useState, useEffect} from 'react'
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
  
  } from "mdb-react-ui-kit";
  import 'mdb-react-ui-kit/dist/css/mdb.min.css';
  import { connect } from 'react-redux';
  import TextField from '@mui/material/TextField';
  import axios from 'axios'
  import serverconfig from '../../config';
  import {authLogin} from '../../store/actions'

  import { Button, Row, Col, notification } from 'antd'

const Profile = ({storeState, authLogin}) => {
  useEffect(() => {
    // setLoading(false);
    getData();
  }, []);

  console.log('storeState', storeState)
  // const [clientData, setClientData] = useState(storeState.customization.auth);
  const [name, setName] = useState(storeState.customization.auth.name)
  const [cif, setCif] = useState(storeState.customization.auth.cif)
  const [contactName, setContactName] = useState(storeState.customization.auth.contactName)
  const [email, setEmail] = useState(storeState.customization.auth.mail)
  const [phone, setPhone] = useState(storeState.customization.auth.phone)
  const [quater, setQuater] = useState()
  
  const getData = async() => {
    const invoices = await axios.get(serverconfig.API_URL + 'api/users/invoicelist')
    let quarter = 0
    let endDate = new Date()
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentQuarter = Math.floor(currentMonth / 3) + 1;
    for(let j = 0;j < invoices.data.length; j ++){

      if(invoices.data[j].ClientId == storeState.customization.auth._id && new Date(endDate.getFullYear(), endDate.getMonth() -12, 1)<new Date(invoices.data[j].Date)){
        // annual ++;
      }
      if(invoices.data[j].ClientId == storeState.customization.auth._id && new Date(endDate.getFullYear(), endDate.getMonth(), 1)<new Date(invoices.data[j].Date)){
        // month ++;
      }
      if(invoices.data[j].ClientId == storeState.customization.auth._id && new Date(endDate.getFullYear(), (currentQuarter-1)*3 + 1, 1)<new Date(invoices.data[j].Date)){
        quarter ++;
      }
    }
    setQuater((storeState.customization.auth.consumption * quarter).toFixed(2))

  }

 
  const onChange = (str,e) => {
    if(str == 'name'){
      setName(e.target.value)
    }else if(str == 'cif'){
      setCif(e.target.value)

    }else if(str == 'contactName'){
      setContactName(e.target.value)

    }else if(str == 'email'){
      setEmail(e.target.value)

    }else if(str == 'phone') {
      setPhone(e.target.value)

    }
  }

    const onSave = () => {
     let data = {
        _id: storeState.customization.auth._id,
        name: name,
        cif: cif,
        contactName: contactName,
        mail: email,
        phone: phone
      }
      axios.post(serverconfig.API_URL + 'api/users/updateClient', data)
        .then((res) => {
          console.log('res', res.data.data)
            if(res.data.status == 'success'){
              authLogin(res.data.data)
              notification.success({
                description: ' Guardar éxito!',
                placement: 'bottomRight',
                duration: 2 // Duration in seconds (optional)
              });
        
            }
        })

 

  }
  return (
    <section >
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
                    <MDBCardText className="text-muted">
                      {name}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="5">
                    <MDBCardText>CIF/DNI</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="7">
                    <MDBCardText className="text-muted">
                    {cif}

                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="5">
                    <MDBCardText>Nombre de contacto</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="7">
                    <MDBCardText className="text-muted">
                    {contactName}

                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="5">
                    <MDBCardText>Correo electrónico</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="7">
                    <MDBCardText className="text-muted">
                    {email}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="5">
                    <MDBCardText>Teléfono</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="7">
                    <MDBCardText className="text-muted">
                    {phone}

                    </MDBCardText>
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
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          
        </MDBRow>
      </MDBContainer>

      {/* <Row style={{justifyContent: 'center'}}>
        <Button type='primary' href='/dashboard/client/edit_profile'>
          Edit
        </Button>
      </Row> */}
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth label="Nombre" value={name} onChange={(e) => onChange('name', e)} variant="standard" />
        </Col>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth label="CIF/DNI" value={cif} onChange={(e) => onChange('cif', e)} variant="standard" />
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth label="Nombre de contacto" value={contactName} onChange={(e) => onChange('contactName', e)} variant="standard" />
        </Col>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth label="Correo electrónico" value={email} onChange={(e) => onChange('email', e)} variant="standard" />
        </Col>
      </Row>
      <Row justify="space-evenly" style={{ marginBottom: 10 }}>
        <Col span={8} align="center">
          <TextField id="standard-basic" fullWidth label="Teléfono" value={phone} onChange={(e) => onChange('phone', e)} variant="standard" />
        </Col>
      </Row>
      <Row style={{justifyContent:'center'}}>
        <Button type='primary' onClick={onSave}>Guardar</Button>
      </Row>
    </section>
  )
}
const mapStateToProps = (state) => ({
  storeState: state,
});


export default connect(mapStateToProps, {authLogin})(Profile);
// export default Profile 
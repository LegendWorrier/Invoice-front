import React from "react";
import { Button,  Form, Input, Row, notification } from "antd";
import Link from "@mui/material/Link";
import { useNavigate } from 'react-router-dom';
// import $ from 'jquery'
import axios from 'axios'
import serverconfig from '../../../config'
import {authLogin, setUserData } from '../../../store/actions'
import { connect } from 'react-redux';

const Admin = ({role,authLogin, setUserData, wholeState, }) => {
  console.log('aaaaaaaaaaa', wholeState)

const navigate = useNavigate();
const onFinish = (values) => {
    console.log('role', typeof(role), role)
    if (values.id === "admin" && role == 1) {
        notification.success({
          description:
            'Bienvenida administradora!',
            placement: 'bottomRight',
          duration: 2, // Duration in seconds (optional)
        });
        authLogin({name: 'admin'})
        window.localStorage.setItem('name', 'admin')
        localStorage.setItem('jwtToken', '')
        window.localStorage.setItem("role", "1")
        navigate('/dashboard');
    }
    else if(role == 3){
      axios
      .post(serverconfig.API_URL + 'api/users/clientSave', {license: values.id})
      .then(res => {
        authLogin(res.data.agency)
        setUserData(res.data.userdata)
        console.log('success', res.data.userdata)
        if(res.data.status == 'success')
        {
          notification.success({
          description:
            'Bienvenida cliente!',
            placement: 'bottomRight',
          duration: 2, // Duration in seconds (optional)
        });
        window.localStorage.setItem('name', res.data.agency.name)
        window.localStorage.setItem("role", "3")
        window.localStorage.setItem('license', values.id)
        axios.get(serverconfig.API_URL + 'api/users/clientlist').then(() => {
          navigate('/dashboard/client/profile');

        })
      }
      })
      .catch(err => {
        if(err.response.data.status == 'error'){
          notification.warning({
            description:
            err.response.data.errors,
              placement: 'bottomRight',
            duration: 2, // Duration in seconds (optional)
          });
        }
        console.log("err", err.response.data.status)
      })
      
    } else if(role == 2){
      axios
      .post(serverconfig.API_URL + 'api/users/login', {license: values.id})
      .then(res => {
        console.log('aaaaafefeaaaaaa', res.data)
        window.localStorage.setItem('name', res.data.data.fname)
        window.localStorage.setItem('license', values.id)

        authLogin(res.data)
        // console.log('success')
        if(res.data.status == 'success')
        {          
          notification.success({
          description:
            'Bienvenida cliente!',
            placement: 'bottomRight',
          duration: 2, // Duration in seconds (optional)
        });
        window.localStorage.setItem("role", "2")
        axios.get(serverconfig.API_URL + 'api/users/clientlist').then(() => {
          navigate('/dashboard');

        })
      }

      })
      .catch(err => {
          notification.warning({
            description:
            err.response.data,
              placement: 'bottomRight',
            duration: 2, // Duration in seconds (optional)
          });
      })
    }
    else {
      notification.error({
        description:
          'Sorry, incorrect input',
          placement: 'bottomRight',
        duration: 2, // Duration in seconds (optional)
      });
    }

  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Row justify="center">
      <Form
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Contrasena"
          name="id"
          rules={[
            {
              required: true,
              message: "Por favor ingrese su identificación!",
            },
          ]}
        >
          <Input placeholder="Por favor ingrese su identificación"  />
        </Form.Item>
        <Form.Item style={{ textAlign: 'center' }}>
        {role == 2 ? (
          <Link href="/auth/register" variant="body2">
                      {"No tengo una cuenta? Inscribirse"}
          </Link>
        ): (<></>)}
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
          Entrar
          </Button>
        </Form.Item>
      </Form>
    </Row>
  );
};
const mapStateToProps = (state) => ({
  wholeState: state,
});

// const mapDispatchToProps = {
//   setAuth: SET_AUTH,
// };
export default connect(mapStateToProps, {authLogin, setUserData})(Admin);

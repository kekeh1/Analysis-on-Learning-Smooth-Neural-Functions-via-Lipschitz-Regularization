import React, {useCallback, useEffect, useState} from "react";
import {
    Container,
    FormWrap,
    Icon,
    FormButton,
    FormContent,
    Form,
    FormH1,
    FormInput,
    FormLabel,
    Text
} from '../AccountElements'

const Register = () => {

    const [email, setEmail] = useState("")
    const [first_name, setFirstName] = useState("")
    const [last_name, setLastName] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [message, setMessage] = React.useState("");

    const success = async (text)=> {
        window.location = "login/";
    };

    const signup_api = async (email, first_name, last_name, phone, password, password2, success, fail) => {

        const response = await fetch(
              "http://127.0.0.1:8000/accounts/register/",
              {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    "email": email,
                    "first_name": first_name,
                    "last_name": last_name,
                    "phone": phone,
                    "password": password,
                    "password2": password2,
                  })
              }
          );
        const text = await response.text();
        if (response.status === 201) {
          console.log("success", JSON.parse(text));
          success(JSON.parse(text));
        } else {
          console.log("fail", text);
          Object.entries(JSON.parse(text)).forEach(([key, value])=>{
            fail(`${key}: ${value}`);
          });
        }
    };

    const trySignup = async (e) => {
        e.preventDefault();
        console.log("Signing up with", email, password);
        await signup_api(email, first_name, last_name, phone, password, password2, success, (text)=>{setMessage(text)});
    };

    return (
        <>
            <Container id="register">
                <FormWrap>
                    <Icon to='/'>Toronto Fitness Club</Icon>
                    <FormContent>
                        <Form id="registerform" action='register'>
                            <FormH1>Register</FormH1>
                            <FormLabel htmlFor='email'>Email</FormLabel>
                            <FormInput type='email' onChange={(e)=>{setEmail(e.target.value)}} required />
                            <FormLabel htmlFor='first_name'>First Name</FormLabel>
                            <FormInput type='text' onChange={(e)=>{setFirstName(e.target.value)}} required />
                            <FormLabel htmlFor='last_name'>Last Name</FormLabel>
                            <FormInput type='text' onChange={(e)=>{setLastName(e.target.value)}} required />
                            <FormLabel htmlFor='phone'>Phone</FormLabel>
                            <FormInput type='text' onChange={(e)=>{setPhone(e.target.value)}} required />
                            <FormLabel htmlFor='password'>Password</FormLabel>
                            <FormInput type='password' onChange={(e)=>{setPassword(e.target.value)}} required />
                            <FormLabel htmlFor='password2'>Repeat Password</FormLabel>
                            <FormInput type='password' onChange={(e)=>{setPassword2(e.target.value)}} required />
                            <div style={{margin: "1em", color: "red"}}>{message}</div>
                            <FormButton type='submit' onClick={trySignup}>Sign up</FormButton>
                        </Form>
                    </FormContent>
                </FormWrap>
            </Container>
        </>
    )
}

const RegisterPage = () => {
    return (
        <>
            <Register />
        </>
    )
}

export default RegisterPage;
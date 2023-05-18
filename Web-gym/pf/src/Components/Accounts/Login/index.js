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

const LogIn = () => {
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [message, setMessage] = React.useState("");

    const success = async (text)=> {
        await localStorage.setItem("token", text.access);
        window.location = "/";
    };
    const login_api = async (email, password, success, fail) => {
        const response = await fetch(
              "http://127.0.0.1:8000/accounts/login/",
              {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',},
                  body: JSON.stringify({
                    "email": email,
                    "password": password,})
              }
          );
        const text = await response.text();
        if (response.status === 200) {
          success(JSON.parse(text));
        } else {
          Object.entries(JSON.parse(text)).forEach(([key, value])=>{
            fail(`${key}: ${value}`);
          });
        }
    };

    const tryLogin = async (e) => {
        e.preventDefault();
        await login_api(email, password, success, (text)=>{setMessage(text)});
    };

    return (
        <>
            <Container>
                <FormWrap>
                    <Icon to='/'>Toronto Fitness Club</Icon>
                    <FormContent>
                        <Form id="loginform">
                            <FormH1>Login</FormH1>
                            <FormLabel htmlFor='email'>Email</FormLabel>
                            <FormInput type='email' onChange={(e)=>{setEmail(e.target.value)}} required />
                            <FormLabel htmlFor='password'>Password</FormLabel>
                            <FormInput type='password' onChange={(e)=>{setPassword(e.target.value)}} required />
                            <div style={{margin: "1em", color: "red"}}>{message}</div>
                            <FormButton type='submit' onClick={tryLogin}>Continue</FormButton>
                        </Form>
                    </FormContent>
                </FormWrap>
            </Container>
        </>
    )
}

const LoginPage = () => {
    return (
        <>
            <LogIn />
        </>
    )
}

export default LoginPage;
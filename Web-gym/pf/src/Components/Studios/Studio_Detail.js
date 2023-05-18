import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";


import {
    Container,
    Containerdiv,
    Header,
    Content,
    Contentdiv,
    NavBtn,
    NavBtnLink,
} from './StudioElement'
import Navbar from "../Navbar";

const Studio = () => {
    const { studio_id } = useParams();
    const [studio, setStudio] =
        useState({address: "", id: "", name: "",
            phone_number: "", postal_code: "", latitude: "", longitude: ""});

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/studios/detail/${studio_id}/`)
            .then(res => res.json())
            .then(json => {
                console.log(json);
                setStudio(json);
            })
    }, [studio_id])

    return (
        <Container><Navbar />
            <Containerdiv>
                <Header>Studio name: { studio.name }</Header>
                <Contentdiv>
                    <Content>Studio id: </Content>
                    <Content>{ studio.id}</Content>
                </Contentdiv>
                <Contentdiv>
                    <Content>Studio address: </Content>
                    <Content>{ studio.address}</Content>
                </Contentdiv>
                <Contentdiv>
                    <Content>Phone number: </Content>
                    <Content>{ studio.phone_number}</Content>
                </Contentdiv>
                <Contentdiv>
                    <Content>Postal Code: </Content>
                    <Content>{studio.postal_code}</Content>
                </Contentdiv>
                <Contentdiv>
                    <Content>Location latitude: </Content>
                    <Content>{ studio.latitude}</Content>
                </Contentdiv>
                <Contentdiv>
                    <Content>Location  longitude: </Content>
                    <Content>{ studio.longitude}</Content>
                </Contentdiv>
          
                <Contentdiv>
                <NavBtn>
                    <NavBtnLink to={'/Date/' + studio.id}>See All Classes</NavBtnLink>
                </NavBtn>
                <NavBtn>
                    <NavBtnLink to={'/Time/' + studio.id}>See All Classes Schedules</NavBtnLink>
                </NavBtn>
                </Contentdiv>

                

            </Containerdiv>
        </Container>
    );
}

export default Studio;
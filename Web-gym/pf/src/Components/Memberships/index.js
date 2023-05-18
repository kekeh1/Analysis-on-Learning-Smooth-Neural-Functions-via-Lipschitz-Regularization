import React from 'react';
import Icon1 from '../../images/icon-1.svg';
// import Icon2 from '../../images/icon-2.svg';
// import Icon3 from '../../images/icon-3.svg';

import { useEffect, useState } from 'react';
import {
    MembershipsContainer,
    MembershipsH1,
    MembershipsWrapper,
    MembershipsCard,
    MembershipsChecks,
    MembershipsIcon,
    MembershipsH2,
    MembershipsP, 
    CheckMark,
    DollarSign
}
    from './MembershipsElements';
import { NavBtn, NavBtnLink } from '../Navbar/NavbarElements';

const Memberships = () => {

    const [subscription, setSubscription] = useState([]);
    const [sub_data, setSubData] = useState([]);

    useEffect(() => {
        const getSubscriptions = async () => {
              let response = await fetch('http://127.0.0.1:8000/accounts/subscriptions/', {
                  method: "GET",
              })
              let data = await response.json()
              // console.log(data.results)
              setSubData(data.results)
        }
        getSubscriptions();
    }, [subscription])


    const renderedOutput = sub_data.map(item => <MembershipsCard key={ item.name }>
        <MembershipsIcon src={Icon1}/>
        <MembershipsH2>{item.name}</MembershipsH2>
        <MembershipsChecks>
            <MembershipsP>< CheckMark/>Access to 20+ studios</MembershipsP>
            <MembershipsP>< CheckMark/>24/7 Gym access</MembershipsP>
            <MembershipsP>< CheckMark/>Access to professional coaches</MembershipsP>
            <MembershipsP>< CheckMark/>Access to a wide array of classes</MembershipsP>
        </MembershipsChecks>
        <MembershipsH2><DollarSign/>{item.amount} {item.duration}</MembershipsH2>
    </MembershipsCard>);

    return (
        <MembershipsContainer id='subscriptions'>
            <MembershipsH1>Flexible plans to fit your lifestyle</MembershipsH1>
            <NavBtn>
                <NavBtnLink to='/profile'>Add/Manage Subscriptions</NavBtnLink>
            </NavBtn>
            <MembershipsWrapper>
                {renderedOutput}
            </MembershipsWrapper>
        </MembershipsContainer>

    )
}

export default Memberships

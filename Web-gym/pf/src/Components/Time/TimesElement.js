import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
bottom: 0;
left: 0;
right: 0;
top: 0;
position: fixed;
overflow-y: scroll;
background: rgb(210,169,105);
background: linear-gradient(90deg, rgba(210,169,105,0.8785889355742297) 0%, rgba(221,56,43,0.43881302521008403) 35%, rgba(219,181,61,0.5480567226890756) 64%, rgba(214,155,104,1) 93%);
`;

export const Calendardiv = styled.div`
display: flex;
flex-wrap: wrap;
`;

export const Inputd = styled.div`
display: flex;
flex-wrap: wrap;
flex-direction: row;
align-items: center;
justify-content: space-around;
margin-top:30px;
`;

export const ContainerInput = styled.div`
margin-top:100px;
margin-left:50px;
margin-right:50px;
display: flex;
justify-content: space-around;
align-items: center;

`;

export const TableI = styled.div`
margin-top:50px;
margin-left:50px;
margin-right:50px;


`;





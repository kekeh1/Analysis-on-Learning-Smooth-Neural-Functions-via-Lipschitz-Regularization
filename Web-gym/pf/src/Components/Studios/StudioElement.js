import styled from "styled-components";
import { Link as LinkR } from 'react-router-dom'
import { Link as LinkS} from 'react-scroll'
import { HashLink } from 'react-router-hash-link'
export const Container = styled.div`
bottom: 0;
left: 0;
right: 0;
top: 0;
position: fixed;
overflow-y: scroll;
background: linear-gradient(225deg, #ffc93f 0, #ffba41 12.5%, #ffaa43 25%, #ff9a45 37.5%, #f98946 50%, #eb7946 62.5%, #de6b47 75%, #d15e48 87.5%, #c65449 100%);;
`;

export const Containerdiv= styled.div`
text-align: center;
margin: auto;
margin-top:130px;

display: flex;
flex-direction: column;
justify-content: space-around;
`;

export const Header = styled.p`
color: #000000;
font-size: 30px;
line-height: 16px;
font-weight: 700;
letter-spacing: 1.4px;
text-transform: uppercase;
margin-bottom: 16px;

`;

export const Content = styled.p`
margin-top:30px;
color: #000000;
font-size: 25px;
line-height: 16px;
font-weight: 700;
letter-spacing: 1.4px;
margin-bottom: 16px;


`;


export const Contentdiv = styled.p`
display: flex;
flex-wrap: wrap;
justify-content: space-around;
`;

export const NavLinks = styled(HashLink)`
    color: #fff;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    cursor: pointer;

    &.active{
        border-bottom: 3px solid #FF7900;
        }
`
export const NavBtn = styled.nav`
    display: flex;
    align-items: center;

    @media screen and (max-width: 768px) {
        display: none;
    }
`
export const NavBtnLink = styled(LinkR)`
    border-radius: 50px;
    background: #000000;
    white-space: nowrap;
    padding: 10px 22px;
    color: #ffc93f ;
    font-size: 16px;
    outline: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;

    &:hover {
        transition: all 0.2s ease-in-out;
        background: #ffc93f ;
        color: #ffc93f ;
        



    }
`

export const ContainerTable = styled.div`
bottom: 0;
left: 0;
right: 0;
top: 0;
position: fixed;
align-items: center;
overflow-y: scroll;
background: rgb(210,169,105);
background: linear-gradient(90deg, rgba(210,169,105,0.8785889355742297) 0%, rgba(221,56,43,0.43881302521008403) 35%, rgba(219,181,61,0.5480567226890756) 64%, rgba(214,155,104,1) 93%);
`;

export const Inputd = styled.div`

`;

export const ContainerInput = styled.div`
margin-top:100px;
margin-left:50px;
margin-right:50px;
display: flex;
justify-content: space-around;
align-items: start;

`;


export const TableI = styled.div`
margin-top:50px;
margin-left:50px;
margin-right:50px;

`;
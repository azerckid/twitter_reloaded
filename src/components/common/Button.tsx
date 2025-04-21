import styled from "styled-components";

interface ButtonProps {
    small?: boolean;
    danger?: boolean;
    primary?: boolean;
}

export const Button = styled.button<ButtonProps>`
    padding: ${props => props.small ? "5px 10px" : "10px 0px"};
    background-color: ${props => {
        if (props.danger) return "tomato";
        if (props.primary) return "#1d9bf0";
        return "transparent";
    }};
    color: ${props => props.danger || props.primary ? "white" : "#1d9bf0"};
    font-weight: 600;
    border: ${props => props.danger || props.primary ? "none" : "1px solid #1d9bf0"};
    font-size: ${props => props.small ? "12px" : "16px"};
    text-transform: ${props => props.small ? "uppercase" : "none"};
    border-radius: ${props => props.small ? "5px" : "20px"};
    cursor: pointer;
    &:hover,
    &:active {
        opacity: 0.9;
    }
`; 
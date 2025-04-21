import styled from "styled-components";

export const Input = styled.input`
    padding: 10px 20px;
    border-radius: 20px;
    border: 1px solid #1d9bf0;
    font-size: 16px;
    color: white;
    background-color: black;
    width: 100%;
    font-family: inherit;
    &[type="submit"] {
        cursor: pointer;
        &:hover,
        &:active {
            opacity: 0.9;
        }
    }
`;

export const TextArea = styled.textarea`
    border: 2px solid #1d9bf0;
    padding: 20px;
    border-radius: 20px;
    font-size: 16px;
    color: white;
    width: 100%;
    resize: none;
    background-color: black;
    font-family: inherit;
    &::placeholder {
        font-family: inherit;
    }
`; 
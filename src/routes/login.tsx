import { useState } from "react";
import { getFirebaseAuth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import {
    Error,
    Form,
    Input,
    Switcher,
    Title,
    Wrapper,
} from "../components/auth-components";
import GithubButton from "../components/github-btn";
import { styled } from "styled-components";

const ResetPasswordButton = styled.button`
    background: none;
    border: none;
    color: #1d9bf0;
    cursor: pointer;
`;

export default function Login() {
    const [isLoading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [resetSent, setResetSent] = useState(false);
    const navigate = useNavigate();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { name, value },
        } = e;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading || email === "" || password === "") return;
        try {
            setLoading(true);
            await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
            navigate("/");
        } catch (e) {
            if (e instanceof FirebaseError) {
                if (e.code === "auth/wrong-password") {
                    setError("비밀번호가 틀렸습니다. 비밀번호를 재설정하시겠습니까?");
                } else {
                    setError(e.message);
                }
            } else {
                setError("알 수 없는 오류가 발생했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    const onResetClick = async () => {
        if (email === "") {
            setError("이메일을 입력해주세요.");
            return;
        }
        try {
            setLoading(true);
            await sendPasswordResetEmail(getFirebaseAuth(), email);
            setResetSent(true);
            setError("");
        } catch (e) {
            if (e instanceof FirebaseError) {
                setError(e.message);
            } else {
                setError("알 수 없는 오류가 발생했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Wrapper>
            <Title>Log into 𝕏</Title>
            <Form onSubmit={onSubmit}>
                <Input
                    onChange={onChange}
                    name="email"
                    value={email}
                    placeholder="Email"
                    type="email"
                    required
                />
                <Input
                    onChange={onChange}
                    value={password}
                    name="password"
                    placeholder="Password"
                    type="password"
                    required
                />
                <Input
                    type="submit"
                    value={isLoading ? "Loading..." : "Log in"}
                />
            </Form>
            {error !== "" ? (
                <Error>
                    {error}
                    {error.includes("비밀번호가 틀렸습니다") && (
                        <ResetPasswordButton onClick={onResetClick}>
                            재설정 이메일 보내기
                        </ResetPasswordButton>
                    )}
                </Error>
            ) : null}
            {resetSent && <Error style={{ color: "#1d9bf0" }}>비밀번호 재설정 이메일이 전송되었습니다.</Error>}
            <Switcher>
                Don't have an account?{" "}
                <Link to="/create-account">Create one &rarr;</Link>
            </Switcher>
            <GithubButton />
        </Wrapper>
    );
}
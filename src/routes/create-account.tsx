import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase.ts";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
    Wrapper,
    Title,
    Form,
    Input,
    Error,
    Switcher,
} from "../components/auth-components.tsx";
import GithubButton from "../components/github-btn.tsx";

export default function CreateAccount() {
    const [isLoading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { name, value },
        } = e;
        if (name === "name") {
            setName(value);
        } else if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading || name === "" || email === "" || password === "") return;
        setError("");
        try {
            setLoading(true);
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            console.log(credentials);
            await updateProfile(credentials.user, {
                displayName: name,
            });
            navigate("/");
        } catch (e) {
            if (e instanceof FirebaseError) {
                if (e.code === "auth/email-already-in-use") {
                    setError("이미 사용 중인 이메일입니다. 로그인을 시도해보세요.");
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

    return (
        <Wrapper>
            <Title>Join 𝕏</Title>
            <Form onSubmit={onSubmit}>
                <Input
                    onChange={onChange}
                    name="name"
                    value={name}
                    placeholder="Name"
                    type="text"
                    required
                />
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
                    value={isLoading ? "Loading..." : "Create Account"}
                />
            </Form>
            {error !== "" ? <Error>{error}</Error> : null}
            <Switcher>
                Already have an account? <Link to="/login">Log in &rarr;</Link>
            </Switcher>
            <GithubButton />
        </Wrapper>
    );
}
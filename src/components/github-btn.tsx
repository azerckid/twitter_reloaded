import { styled } from "styled-components";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirebaseAuth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

const Button = styled.span`
   margin-top: 50px;
   background-color: white;
   font-weight: 500;
   width: 100%;
   color: black;
   padding: 10px 20px;
   border-radius: 50px;
   border: 0;
   display: flex;
   gap: 5px;
   align-items: center;
   justify-content: center;
   cursor: pointer;
 `;

const Logo = styled.img`
   height: 25px;
 `;

export default function GithubButton() {
    const navigate = useNavigate();
    const onClick = async () => {
        try {
            const auth = getFirebaseAuth();
            const provider = new GithubAuthProvider();
            await signInWithPopup(auth, provider);
            navigate("/");
        } catch (e) {
            if (e instanceof FirebaseError) {
                if (e.code === "auth/account-exists-with-different-credential") {
                    alert("이미 다른 방법으로 가입된 이메일입니다. 이메일/비밀번호로 로그인해주세요.");
                } else {
                    console.error(e);
                }
            }
        }
    };
    return (
        <Button onClick={onClick}>
            <Logo src="/github-mark.svg" />
            Continue with Github
        </Button>
    );
}
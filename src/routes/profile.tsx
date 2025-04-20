import { auth } from "../firebase";
import { styled } from "styled-components";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    gap: 20px;
    margin-top: 40px;
    height: 100vh;
`;

const Avatar = styled.div`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #1d9bf0;
`;

const AvatarImage = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
`;

const AvatarFallback = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 50%;
`;

const Title = styled.h1`
    font-size: 24px;
    font-weight: 600;
`;

const WelcomeMessage = styled.h1`
    font-size: 24px;
    font-weight: 600;
`;

export default function Profile() {
    const user = auth.currentUser;
    return (
        <Wrapper>
            <Title>Profile</Title>
            <Avatar>
                {user?.photoURL
                    ? <AvatarImage src={user.photoURL} />
                    : <AvatarFallback>{user?.displayName?.charAt(0)}</AvatarFallback>}
            </Avatar>
            <WelcomeMessage>어서오세요  {user?.displayName} 님</WelcomeMessage>
            <p>{user?.email}</p>
        </Wrapper>
    );
}
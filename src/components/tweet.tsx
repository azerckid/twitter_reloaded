import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { getFirebaseAuth, getFirebaseDb } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import EditTweetForm from "./EditTweetForm";
import { Button } from "./common/Button";
import { formatDate } from "../utils/date-formatter";

const Wrapper = styled.div`
   display: grid;
   grid-template-columns: 3fr 1fr;
   padding: 20px;
   border: 1px solid rgba(255, 255, 255, 0.5);
   border-radius: 15px;
 `;

const Column = styled.div`
   &:last-child {
      place-self: end;
   }
`;

const Photo = styled.img`
   width: 100px;
   height: 100px;
   border-radius: 15px;
   object-fit: cover;
 `;

const Username = styled.span`
   font-weight: 600;
   font-size: 15px;
 `;

const TimeStamp = styled.span`
    margin-left: 10px;
    font-size: 12px;
    color: #888;
`;

const Payload = styled.p`
   margin: 10px 0px;
   font-size: 18px;
 `;

const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 10px;
`;

export default function Tweet({ username, photo, tweet, userId, id, createdAt }: ITweet) {
    const user = getFirebaseAuth().currentUser;
    const [isEditing, setIsEditing] = useState(false);

    const onDelete = async () => {
        const ok = confirm("삭제하시겠습니까?");
        if (!ok) return;
        try {
            await deleteDoc(doc(getFirebaseDb(), "tweets", id));
        } catch (error) {
            console.log(error);
        }
    };

    const onEdit = () => {
        setIsEditing(true);
    };

    const onCancel = () => {
        setIsEditing(false);
    };

    return (
        <Wrapper>
            <Column>
                <Username>{username}</Username>
                <TimeStamp>{formatDate(createdAt)}</TimeStamp>
                <Payload>{tweet}</Payload>
                {user?.uid === userId ? (
                    <ButtonContainer>
                        <Button small danger onClick={onDelete}>
                            Delete
                        </Button>
                        <Button small primary onClick={onEdit}>
                            Edit
                        </Button>
                    </ButtonContainer>
                ) : null}
                {isEditing && (
                    <EditTweetForm
                        id={id}
                        tweet={tweet}
                        photo={photo || null}
                        onCancel={onCancel}
                    />
                )}
            </Column>
            <Column>{photo ? <Photo src={photo} /> : null}</Column>
        </Wrapper>
    );
}
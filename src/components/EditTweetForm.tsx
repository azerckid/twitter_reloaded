import { useState } from "react";
import { styled } from "styled-components";
import { getFirebaseDb } from "../firebase";
import { updateDoc, doc } from "firebase/firestore";

const EditForm = styled.form`
   display: flex;
   flex-direction: column;
   gap: 10px;
`;

const EditTextArea = styled.textarea`
   margin-top: 10px;
   border: 2px solid #1d9bf0;
   padding: 10px;
   border-radius: 10px;
   font-size: 14px;
   color: black;
   width: 100%;
   resize: none;
   background-color: #f0f0f0;
`;

const EditPhotoInput = styled.input`
   display: none;
`;

const EditPhotoButton = styled.label`
   padding: 5px 0px;
   color: #1d9bf0;
   text-align: center;
   border-radius: 10px;
   border: 1px solid #1d9bf0;
   font-size: 12px;
   font-weight: 600;
   cursor: pointer;
`;

const EditSubmitButton = styled.button`
   background-color: #1d9bf0;
   color: white;
   border: none;
   padding: 5px 0px;
   border-radius: 10px;
   font-size: 12px;
   cursor: pointer;
`;

const CancelButton = styled.button`
   background-color: #ff4444;
   color: white;
   font-weight: 600;
   border: 0;
   font-size: 12px;
   padding: 5px 10px;
   text-transform: uppercase;
   border-radius: 5px;
   cursor: pointer;
   margin-left: 10px;
`;

interface EditTweetFormProps {
    id: string;
    tweet: string;
    photo: string | null;
    onCancel: () => void;
}

export default function EditTweetForm({ id, tweet, photo, onCancel }: EditTweetFormProps) {
    const [editTweet, setEditTweet] = useState(tweet);
    const [editPhoto, setEditPhoto] = useState<string | null>(photo);

    const onEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditTweet(e.target.value);
    };

    const onEditPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length === 1) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditPhoto(reader.result as string);
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const onEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await updateDoc(doc(getFirebaseDb(), "tweets", id), {
                tweet: editTweet,
                photo: editPhoto,
            });
            onCancel();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <EditForm onSubmit={onEditSubmit}>
            <EditTextArea
                rows={5}
                maxLength={180}
                value={editTweet}
                onChange={onEditChange}
            />
            {editPhoto && <img src={editPhoto} alt="Edit" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "15px" }} />}
            <EditPhotoButton htmlFor="editFile">
                {editPhoto ? "Change photo" : "Add photo"}
            </EditPhotoButton>
            <EditPhotoInput
                onChange={onEditPhotoChange}
                type="file"
                id="editFile"
                accept="image/*"
            />
            <EditSubmitButton type="submit">Save</EditSubmitButton>
            <CancelButton onClick={onCancel}>Cancel</CancelButton>
        </EditForm>
    );
} 
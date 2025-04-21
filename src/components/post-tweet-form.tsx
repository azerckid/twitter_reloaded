import { useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { auth } from "../firebase";

const Form = styled.form`
   display: flex;
   flex-direction: column;
   gap: 10px;
 `;

const TextArea = styled.textarea`
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

const AttachFileButton = styled.label`
   padding: 10px 0px;
   color: #1d9bf0;
   text-align: center;
   border-radius: 20px;
   border: 1px solid #1d9bf0;
   font-size: 14px;
   font-weight: 600;
   cursor: pointer;
   font-family: inherit;
 `;

const AttachFileInput = styled.input`
   display: none;
 `;

const SubmitBtn = styled.input`
   background-color: #1d9bf0;
   color: white;
   border: none;
   padding: 10px 0px;
   border-radius: 20px;
   font-size: 16px;
   cursor: pointer;
   font-family: inherit;
   &:hover,
   &:active {
     opacity: 0.9;
   }
 `;

const ImagePreview = styled.img`
    width: 100%;
    height: 300px;
    border-radius: 15px;
    object-fit: cover;
`;

const ErrorMessage = styled.p`
   color: tomato;
   font-size: 14px;
   text-align: center;
`;

const CharCount = styled.span`
   font-size: 12px;
   color: ${props => props.color === "red" ? "tomato" : "#1d9bf0"};
   text-align: right;
`;

export default function PostTweetForm() {
    const [isLoading, setLoading] = useState(false);
    const [tweet, setTweet] = useState("");
    const [file, setFile] = useState<string | null>(null);
    const [error, setError] = useState<string>("");

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTweet(e.target.value);
    };
    // const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { files } = e.target;
    //     if (files && files.length === 1) {
    //         setFile(files[0]);
    //     }
    // };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length === 1) {
            const maxSize = 600 * 1024; // 600KB
            if (files[0].size > maxSize) {
                setError("파일 크기는 600KB 이하여야 합니다.");
                return;
            }
            setError("");
            const reader = new FileReader();
            reader.onloadend = () => {
                setFile(reader.result as string);
            };
            reader.readAsDataURL(files[0]);
        }
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) return;
        if (isLoading) return;
        if (tweet === "") {
            setError("트윗 내용을 입력해주세요.");
            return;
        }
        if (tweet.length > 180) {
            setError("트윗은 180자를 넘을 수 없습니다.");
            return;
        }

        try {
            setLoading(true);
            await addDoc(collection(db, "tweets"), {
                tweet,
                createdAt: Date.now(),
                username: user.displayName || "Anonymous",
                userId: user.uid,
                ...(file && { photo: file }), // Only add photo if file exists
            });
            setTweet("");
            setFile(null);
            setError("");
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={onSubmit}>
            <TextArea
                rows={5}
                maxLength={180}
                onChange={onChange}
                value={tweet}
                placeholder="What is happening?!"
            />
            <CharCount color={tweet.length > 180 ? "red" : "blue"}>
                {tweet.length}/180
            </CharCount>
            {file && <ImagePreview src={file} />}
            <AttachFileButton htmlFor="file">
                {file ? "Photo added ✅" : "Add photo"}
            </AttachFileButton>
            <AttachFileInput
                onChange={onFileChange}
                type="file"
                id="file"
                accept="image/*"
            />
            {error !== "" && <ErrorMessage>{error}</ErrorMessage>}
            <SubmitBtn
                type="submit"
                value={isLoading ? "Posting..." : "Post Tweet"}
            />
        </Form>
    );
}
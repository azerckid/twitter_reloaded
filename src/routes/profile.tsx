import { styled } from "styled-components";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { Unsubscribe, updateProfile } from "firebase/auth";
import {
    collection,
    limit,
    onSnapshot,
    orderBy,
    query,
    where,
    setDoc,
    doc,
    getDoc
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";

interface UserProfile {
    userId: string;
    avatar: string;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  svg {
    width: 50px;
  }
  &:hover::after {
    content: "Change Photo";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 26px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const NameInput = styled.input`
  font-size: 22px;
  background-color: black;
  color: white;
  border: 1px solid white;
  padding: 5px;
  border-radius: 5px;
  width: 200px;
  text-align: center;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  color:rgb(255, 255, 255, 0.2);
  cursor: pointer;
  font-size: 16px;
  transition: color 0.1s ease-in-out;
  &:hover {
    color: #1d9bf0;
  }
`;

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

export default function Profile() {
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState(user?.photoURL);
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [newDisplayName, setNewDisplayName] = useState(user?.displayName ?? "Anonymous");

    const fetchUserProfile = async (userId: string) => {
        const userProfileRef = doc(db, "userProfile", userId);
        const profileSnapshot = await getDoc(userProfileRef);
        if (profileSnapshot.exists()) {
            const data = profileSnapshot.data() as UserProfile;
            setAvatar(data.avatar);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserProfile(user.uid);
        }
    }, [user]);

    const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (!user) return;
        if (files && files.length === 1) {
            const file = files[0];
            const maxSize = 400 * 1024; // 400KB
            if (file.size > maxSize) {
                alert("파일 크기는 400KB 이하여야 합니다.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = async () => {
                const avatarUrl = reader.result as string;
                try {
                    // Save to Firestore
                    const userProfileRef = doc(db, "userProfile", user.uid);
                    await setDoc(userProfileRef, {
                        userId: user.uid,
                        avatar: avatarUrl
                    });
                    setAvatar(avatarUrl);
                    console.log("Profile updated successfully");
                } catch (error) {
                    console.error("Error updating profile:", error);
                    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
                    alert("프로필 업데이트 중 오류가 발생했습니다: " + errorMessage);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const onNameChange = async () => {
        if (!user) return;
        try {
            await updateProfile(user, {
                displayName: newDisplayName,
            });
            setIsEditing(false);
            console.log("Display name updated successfully");
        } catch (error) {
            console.error("Error updating display name:", error);
            const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
            alert("이름 업데이트 중 오류가 발생했습니다: " + errorMessage);
        }
    };

    useEffect(() => {
        let unsubscribe: Unsubscribe | null = null;
        const fetchTweets = async () => {
            if (!user) {
                console.error("User is not logged in.");
                return;
            }
            const tweetsQuery = query(
                collection(db, "tweets"),
                where("userId", "==", user.uid),
                orderBy("createdAt", "desc"),
                limit(25)
            );
            unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
                const tweets = snapshot.docs.map((doc) => {
                    const { tweet, createdAt, userId, username, photo } = doc.data();
                    return {
                        tweet,
                        createdAt,
                        userId,
                        username,
                        photo,
                        id: doc.id,
                    };
                });
                setTweets(tweets);
            });
        };
        fetchTweets();
        return () => {
            unsubscribe && unsubscribe();
        };
    }, []);
    return (
        <Wrapper>
            <AvatarUpload htmlFor="avatar">
                {avatar ? (
                    <AvatarImg src={avatar} alt="Profile" />
                ) : (
                    <svg
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                    </svg>
                )}
            </AvatarUpload>
            <AvatarInput
                onChange={onAvatarChange}
                id="avatar"
                type="file"
                accept="image/*"
            />
            <Name>
                {isEditing ? (
                    <>
                        <NameInput
                            type="text"
                            value={newDisplayName}
                            onChange={(e) => setNewDisplayName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    onNameChange();
                                }
                            }}
                        />
                        <EditButton onClick={onNameChange}>
                            <svg
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                width="24"
                                height="24"
                            >
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                        </EditButton>
                    </>
                ) : (
                    <>
                        {user?.displayName ?? "Anonymous"}
                        <EditButton onClick={() => setIsEditing(true)}>
                            <svg
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                width="24"
                                height="24"
                            >
                                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                            </svg>
                        </EditButton>
                    </>
                )}
            </Name>
            <Tweets>
                {tweets.map((tweet) => (
                    <Tweet key={tweet.id} {...tweet} />
                ))}
            </Tweets>
        </Wrapper>
    );
}
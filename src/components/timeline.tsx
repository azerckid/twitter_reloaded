import {
    collection,
    limit,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import { useEffect, useState, lazy, Suspense } from "react";
import { styled } from "styled-components";
import { getFirebaseDb } from "../firebase";
import { Unsubscribe } from "firebase/auth";
import LoadingScreen from "./loading-screen";

const Tweet = lazy(() => import("./tweet"));

export interface ITweet {
    id: string;
    photo?: string;
    tweet: string;
    userId: string;
    username: string;
    createdAt: number;
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
`;

export default function Timeline() {
    const [tweets, setTweet] = useState<ITweet[]>([]);

    useEffect(() => {
        let unsubscribe: Unsubscribe | null = null;
        const fetchTweets = async () => {
            const tweetsQuery = query(
                collection(getFirebaseDb(), "tweets"),
                orderBy("createdAt", "desc"),
                limit(25)
            );
            /* const spanshot = await getDocs(tweetsQuery);
              const tweets = spanshot.docs.map((doc) => {
                const { tweet, createdAt, userId, username, photo } = doc.data();
                return {
                  tweet,
                  createdAt,
                  userId,
                  username,
                  photo,
                  id: doc.id,
                };
              }); */
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
                setTweet(tweets);
            });
        };
        fetchTweets();
        return () => {
            unsubscribe && unsubscribe();
        };
    }, []);
    return (
        <Wrapper>
            {tweets.map((tweet) => (
                <Suspense key={tweet.id} fallback={<LoadingScreen />}>
                    <Tweet {...tweet} />
                </Suspense>
            ))}
        </Wrapper>
    );
}
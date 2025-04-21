import { styled } from "styled-components";
import { lazy, Suspense } from "react";
import LoadingScreen from "../components/loading-screen";

const Timeline = lazy(() => import("../components/timeline"));
const PostTweetForm = lazy(() => import("../components/post-tweet-form"));

const Wrapper = styled.div`
    display: grid;
    gap: 50px;
    grid-template-rows: 1fr 5fr;
    overflow-y: scroll;
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

export default function Home() {
    return (
        <Wrapper>
            <Suspense fallback={<LoadingScreen />}>
                <PostTweetForm />
            </Suspense>
            <Suspense fallback={<LoadingScreen />}>
                <Timeline />
            </Suspense>
        </Wrapper>
    );
}
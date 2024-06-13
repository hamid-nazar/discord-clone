import { useEffect, useState } from "react";


type ChatScrollProps = {
    chatRef: React.RefObject<HTMLDivElement>;
    bottomRef: React.RefObject<HTMLDivElement>;
    shouldLoadMore: boolean;
    loadMore: () => void;
    count: number;
}

export function useChatScroll({
    chatRef,
    bottomRef,
    shouldLoadMore,
    loadMore,
    count
}: ChatScrollProps) {

    const [hasInitialized, setInitialized] = useState(false);


    useEffect(function() {
        setInitialized(true);
        const topDiv = chatRef?.current;

        function handleScroll() {
            const scrollTop = topDiv?.scrollTop;

            if (scrollTop === 0 && shouldLoadMore) {
                loadMore();
            }
        }

        topDiv?.addEventListener("scroll", handleScroll);


        return function() {
            topDiv?.removeEventListener("scroll", handleScroll);
        }

    }, [ chatRef,shouldLoadMore, loadMore ]);


    useEffect(function() {

        const bottomDiv = bottomRef?.current;
        const topDiv = chatRef?.current;

        function handleAutoScroll() {

            if (!hasInitialized  && bottomDiv) {

                return true;
            }

            if (!topDiv) {

                return false;
            }

            const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
        
            return distanceFromBottom < 100;
        }

        if (handleAutoScroll()) {
           
            setTimeout(function() {
                bottomDiv?.scrollIntoView({behavior: "smooth"});
            }, 100);
        }

    }, [count, hasInitialized, bottomRef, chatRef]);


}

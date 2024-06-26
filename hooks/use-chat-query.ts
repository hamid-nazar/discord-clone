import { useSocket } from "@/components/providers/socket-provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";



interface ChatQueryProps {
    queryKey: string;
    apiUrl: string;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
}


export function useChatQuery({ queryKey, apiUrl, paramKey, paramValue }: ChatQueryProps) {

    const { isConnected } = useSocket();

    async function fetchMessages({ pageParam = undefined }) {

        const url = qs.stringifyUrl({
            url: apiUrl,
            query: {
                cursor: pageParam,
                [paramKey]: paramValue,
            }
        }, {
            skipNull: true
        });

        const response = await fetch(url);
        const data = await response.json();

        return data;

    }

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        initialPageParam: undefined,  // Add this line
        refetchInterval: isConnected ? false : 1000
    });

    return { data, fetchNextPage, hasNextPage, isFetchingNextPage, status };
}
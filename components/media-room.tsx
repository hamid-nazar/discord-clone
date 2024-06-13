"use client";

import React from "react";

import "@livekit/components-styles";
import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
  channelId: string;
  video: boolean;
  audio: boolean;
}

export function MediaRoom({ channelId, video, audio }: MediaRoomProps) {
  const { user } = useUser();

  const [token, setToken] = useState("");

  useEffect(
    function () {
      if (!user?.firstName || !user?.lastName) {
        return;
      }

      const name =
        user?.firstName || user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : "";

      (async () => {
        try {
          const resp = await fetch(
            `/api/livekit?room=${channelId}&username=${name}`
          );

          const data = await resp.json();

          setToken(data.token);

        } catch (e) {
          console.error(e);
        }
      })();
    },
    [channelId, user?.firstName, user?.lastName]
  );

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 items-center justify-center">
        <Loader2 className="animate-spin h-7 w-7 text-zinc-500 my-4" />
        <p className="text-zinc-500 text-xs dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
<LiveKitRoom
    data-lk-them={"default"}
    serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
    token={token}
    connect={true}
    video={video}
    audio={audio}
    >

    
  <VideoConference />

</LiveKitRoom>

  )
}

import { useState, useCallback } from "react";
import useSWR, { Fetcher } from "swr";
import { Cuboid } from "../types";

interface Data {
  cuboids: Cuboid[];
}

const fetcher: Fetcher<Data, string> = (url) =>
  fetch(url).then((res) => res.json());

export function useDataFrame() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const paddedFrame = currentFrame.toString().padStart(2, "0");
  const url = `https://static.scale.com/uploads/pandaset-challenge/frame_${paddedFrame}.json`;

  const { data, isLoading, error } = useSWR(url, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const goToPrevious = useCallback(() => {
    if (currentFrame > 0) {
      setCurrentFrame((prev) => prev - 1);
    }
  }, [currentFrame]);

  const goToNext = useCallback(() => {
    if (currentFrame < 49) {
      setCurrentFrame((prev) => prev + 1);
    }
  }, [currentFrame]);

  const goTo = useCallback((frame: number) => {
    if (frame >= 0 && frame <= 49) {
      setCurrentFrame(frame);
    }
  }, []);

  return { data, isLoading, error, currentFrame, goToPrevious, goToNext, goTo };
}

"use client";

import useSWR from "swr";

export interface News {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function useNews() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR("/api/admin/news", fetcher);
  return {
    newsList: data as News[],
    newsError: error,
    newsLoading: isLoading,
  };
}

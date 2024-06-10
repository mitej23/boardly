import { useQuery } from "@tanstack/react-query";

const useGetQuery = (url: string, query: string, key: string) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: [key, query],
    queryFn: async ({ queryKey }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, boardName] = queryKey;
      const requestOptions: RequestInit = {
        method: "Get",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow" as RequestRedirect,
        credentials: "include",
      };
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}${url}?query=${boardName}`,
        requestOptions
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Some Error");
      }

      return response.json();
    },
  });
  return {
    data,
    isPending,
    isError,
    error,
  };
};

export default useGetQuery;

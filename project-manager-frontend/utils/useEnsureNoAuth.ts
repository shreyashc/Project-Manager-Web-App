import { useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useEnsureNoAuth = () => {
  const { data, loading, error } = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (!loading && data && data.me && !error) {
      router.replace("/projects");
    }
  }, [loading, data, router]);
};

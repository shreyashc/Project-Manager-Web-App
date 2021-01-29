import React from "react";
import Link from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";
import { useApolloClient } from "@apollo/client";
import { useRouter } from "next/router";
const Navbar: React.FC = () => {
  const router = useRouter();
  const { data, loading } = useMeQuery();
  const apolloClient = useApolloClient();
  const [logoutMutation] = useLogoutMutation();

  if (loading && !data) {
    return null;
  }

  return (
    <header>
      <nav>
        <div className="nav-links">
          <Link href="/">
            <a>
              <h1 className="nav-logo">Project Manager</h1>
            </a>
          </Link>
          {!data ? (
            <>
              <Link href="/login">
                <a className="login-btn">Login</a>
              </Link>
              <Link href="/signup">
                <a className="signup-btn">Signup</a>
              </Link>
            </>
          ) : (
            <>
              <a className="login-btn">{data.me.username}</a>
              <button
                onClick={async () => {
                  router.replace("/login");
                  await logoutMutation();
                  await apolloClient.resetStore();
                }}
                className="p-2 text-white ml-3 bg-red-400 rounded hover:bg-red-200"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default withApollo({ ssr: false })(Navbar);

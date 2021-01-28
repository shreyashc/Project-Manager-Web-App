import React from "react";
import Link from "next/link";
import { useMeQuery } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";
const Navbar: React.FC = () => {
  const { data, loading } = useMeQuery();

  if (loading) {
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
              <Link href="/">
                <a className="login-btn">Login</a>
              </Link>
              <Link href="/">
                <a className="signup-btn">Signup</a>
              </Link>
            </>
          ) : (
            <>
              <a className="login-btn">{data.me.username}</a>
              <a
                className="p-2 text-white ml-3 bg-red-400 rounded hover:bg-red-200"
                href="/"
              >
                Logout
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default withApollo({ ssr: false })(Navbar);

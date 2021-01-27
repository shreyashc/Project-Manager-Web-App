import React from "react";
import Link from "next/link";
import { useMeQuery } from "../generated/graphql";
import withApollo from "../utils/withApollo";
const Navbar: React.FC = () => {
  const { data, loading } = useMeQuery({
    skip: true,
  });

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
          <Link href="/">
            <a className="login-btn">Login</a>
          </Link>
          <Link href="/">
            <a className="signup-btn">Signup</a>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default withApollo({ ssr: false })(Navbar);

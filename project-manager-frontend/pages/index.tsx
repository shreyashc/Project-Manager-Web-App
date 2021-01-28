import Link from "next/link";
import React from "react";
import Layout from "../components/Layout";

const Home: React.FC = () => {
  return (
    <Layout>
      <div className="flex gap-9 p-5 mt-5 flex-wrap justify-around items-center md:container md:mx-auto">
        <div className="max-w-lg">
          <img src="scrum.svg" alt="scrum board" />
        </div>
        <div className="felx text-center font-semibold text-2xl">
          Manage Your Project with our tool <br />
          and increase your productivity.
          <div className="m-5">
            <Link href="/projects">
              <a className="m-5 p-2 px-3 bg-blue-400 hover:bg-blue-300 font-semibold rounded">
                Get Started
              </a>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;

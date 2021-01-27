import React from "react";

const Home: React.FC = () => {
  return (
    <div className="flex gap-9 p-5 mt-5 flex-wrap justify-around items-center md:container md:mx-auto">
      <div className="max-w-lg">
        <img src="scrum.svg" alt="scrum board" />
      </div>
      <div className="felx text-center font-semibold text-2xl">
        Manage Your Project with our tool <br />
        and increase your productivity.
        <div className="m-5">
          <a
            href="home/"
            className="m-5 p-2 px-3 bg-blue-400 hover:bg-blue-300 font-semibold rounded"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;

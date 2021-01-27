import { useMyProjectsQuery } from "../../generated/graphql";
import withApollo from "../../utils/withApollo";

const projects = () => {
  const { data, loading } = useMyProjectsQuery();
  if (loading) return null;
  return (
    <div className="md:container md:mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center bg-blue-400 px-4 py-1 rounded">
          <h2 className="my-6 font-semibold text-xl">My Projects</h2>
          <a
            className="mx-4 ml-auto text-gray-500 font-semibold bg-gray-100 py-1 px-2 rounded"
            href="add.html "
          >
            Add Project
          </a>
        </div>
        <div className="projects">
          {data.myProjects.map((project) => (
            <div className="project p-3 bg-gray-600 my-3" key={project.id}>
              <a>
                <h3 className="text-xl">{project.title}</h3>
                <p className="mt-2 text-gray-300">{project.description}</p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default withApollo({ ssr: true })(projects);

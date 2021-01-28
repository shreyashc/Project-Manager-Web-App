import { Spinner } from "../../components/Spinner";
import { useMyProjectsQuery } from "../../generated/graphql";
import { withApollo } from "../../utils/withApollo";
import Layout from "../../components/Layout";

const Projects = () => {
  const { data, loading } = useMyProjectsQuery();

  if (!loading && !data) {
    return (
      <div>
        <div>Something Went Wrong</div>
      </div>
    );
  }
  return (
    <Layout>
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center bg-blue-400 px-4 py-1 rounded">
            <h2 className="my-6 font-semibold text-xl">My Projects</h2>
            <a className="mx-4 ml-auto text-gray-500 font-semibold bg-gray-100 py-1 px-2 rounded">
              Add Project
            </a>
          </div>
          {loading ? (
            <Spinner />
          ) : (
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
          )}
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Projects);

import React from "react";
import Layout from "../../components/Layout";
import { Field, Form, Formik } from "formik";
import Link from "next/link";
import Spinner from "../../components/Spinner";
import { useCreateProjectMutation } from "../../generated/graphql";
import { withApollo } from "../../utils/withApollo";
import { useRouter } from "next/router";
const CreateProject = () => {
  const router = useRouter();
  const [createProject] = useCreateProjectMutation();
  return (
    <Layout>
      <div className="wrapper max-w-3xl mx-auto">
        <Formik
          initialValues={{ title: "", description: "" }}
          onSubmit={async (values) => {
            const { errors } = await createProject({
              variables: { input: values },
              update: (cache) => {
                cache.evict({ fieldName: "myProjects" });
                cache.gc();
              },
            });
            if (!errors) {
              router.push("/projects");
            }
          }}
        >
          {(props) => (
            <Form
              onSubmit={props.handleSubmit}
              className="bg-gray-800 mx-auto p-4 rounded-md mt-4 shadow-lg"
            >
              <h2 className="font-bold text-3xl text-blue-300 text-center mb-4">
                Add Project
              </h2>
              <div className="mb-3">
                <label>Project Title:</label>
                <Field
                  name="title"
                  required={true}
                  className="border-0 mt-2 px-4 py-2 bg-gray-700 rounded-sm w-full text-gray-200 focus:outline-none focus:ring focus:border-blue-400 ring-blue-300"
                />
                {props.errors.title && (
                  <div id="error">{props.errors.title}</div>
                )}
              </div>
              <div className="mb-3">
                <label>Project Description:</label>
                <Field
                  required={true}
                  as="textarea"
                  name="description"
                  rows="7"
                  className="border-0 mt-2 px-4 py-2 bg-gray-700 rounded-sm w-full text-gray-200 focus:outline-none focus:ring focus:border-blue-400 ring-blue-300"
                />
                {props.errors.description && (
                  <div id="error">{props.errors.description}</div>
                )}
              </div>
              <div className="flex justify-end py-1 space-x-5">
                <Link href="/projects">
                  <a className="bg-gray-800 px-2 py-1 rounded-sm ring ring-gray-600">
                    Cancel
                  </a>
                </Link>
                <button
                  type="submit"
                  className="bg-green-800 px-2 py-1 rounded-sm ring ring-green-600 hover:bg-green-700"
                  disabled={props.isSubmitting}
                >
                  {!props.isSubmitting ? (
                    <span>Create Project</span>
                  ) : (
                    <span className="flex items-center">
                      <span className="mx-3">Creating</span>
                      <Spinner size="small" color="text-white" />
                    </span>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default withApollo({ srr: true })(CreateProject);

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
      <div className="wrapper-new-p">
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
            <Form onSubmit={props.handleSubmit} className="form-new-proj">
              <h2 className="form-new-proj-head">Add Project</h2>
              <div className="mb-3">
                <label>Project Title:</label>
                <Field
                  name="title"
                  required={true}
                  className="form-new-proj-field"
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
                  className="form-new-proj-field"
                />
                {props.errors.description && (
                  <div id="error">{props.errors.description}</div>
                )}
              </div>
              <div className="flex justify-end py-1 space-x-5">
                <Link href="/projects">
                  <a className="form-new-proj-cancel">Cancel</a>
                </Link>
                <button
                  type="submit"
                  className="form-new-proj-submit "
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

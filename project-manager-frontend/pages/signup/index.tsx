import { Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../components/Layout";
import Spinner from "../../components/Spinner";
import {
  MeDocument,
  MeQuery,
  useSignupMutation,
} from "../../generated/graphql";
import { withApollo } from "../../utils/withApollo";

const Signup = () => {
  const [signupMutation] = useSignupMutation();
  const router = useRouter();
  return (
    <Layout>
      <div className="signup-login-wrap">
        <Formik
          initialValues={{ username: "", email: "", password: "" }}
          onSubmit={async (values, helper) => {
            const { data } = await signupMutation({
              variables: { options: values },
              update: (cache, { data }) => {
                if (data.register.errors) {
                  return;
                }
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: data?.register.user,
                  },
                });
                cache.evict({ fieldName: "myProjects" });
                cache.gc();
                router.push("/projects");
              },
            });
            if (data.register.errors) {
              data.register.errors.map((error) => {
                helper.setFieldError(error.field, error.message);
              });
            }
          }}
        >
          {(props) => (
            <Form className="signup-login-form">
              <h2 className="signup-login-head">Sign Up</h2>
              <div className="mb-3">
                <label>
                  Username:
                  <Field
                    required
                    type="text"
                    name="username"
                    placeholder="username"
                    className="signup-login-field"
                  />
                </label>
                <div className="signup-login-error">
                  {props.errors.username}
                </div>
              </div>
              <div className="mb-3">
                <label className="mb-3">
                  Email:
                  <Field
                    required
                    type="email"
                    name="email"
                    placeholder="email"
                    className="signup-login-field"
                  />
                </label>
                <div className="signup-login-error">{props.errors.email}</div>
              </div>
              <div>
                <label>
                  Password:
                  <Field
                    required
                    type="password"
                    name="password"
                    placeholder="password"
                    className="signup-login-field"
                  />
                </label>
                <div className="signup-login-error">
                  {props.errors.password}
                </div>
              </div>

              <button type="submit" className="signup-login-submit">
                {props.isSubmitting ? (
                  <Spinner size="small" color="text-white" />
                ) : (
                  "Sign Up"
                )}
              </button>
            </Form>
          )}
        </Formik>
        <div className="signup-login-link">
          <Link href="/login">
            <a>Alredy have an account? Login </a>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Signup);

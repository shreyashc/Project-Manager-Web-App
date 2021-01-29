import { Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../components/Layout";
import Spinner from "../../components/Spinner";
import { MeDocument, MeQuery, useLoginMutation } from "../../generated/graphql";
import { useEnsureNoAuth } from "../../utils/useEnsureNoAuth";
import { withApollo } from "../../utils/withApollo";

const Login = () => {
  useEnsureNoAuth();
  const router = useRouter();
  const [loginMutation] = useLoginMutation();

  return (
    <Layout>
      <div className="signup-login-wrap">
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values, helper) => {
            const { data } = await loginMutation({
              variables: values,
              update: (cache, { data }) => {
                if (data.login.errors) {
                  return;
                }
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: data?.login.user,
                  },
                });
                cache.evict({ fieldName: "myProjects" });
                cache.gc();
                router.push("/projects");
              },
            });

            if (data.login.errors) {
              data.login.errors.map((error) => {
                helper.setFieldError(error.field, error.message);
              });
            }
          }}
        >
          {(props) => (
            <Form
              action="login.php"
              method="POST"
              className="signup-login-form"
            >
              <h2 className="signup-login-head">Log In</h2>
              <div className="mb-3">
                <label className="mb-3">
                  Email:
                  <Field
                    required
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
                    placeholder="password"
                    type="password"
                    name="password"
                    className="signup-login-field"
                  />
                </label>
                <div className="tsignup-login-error">
                  {props.errors.password}
                </div>
              </div>
              <button type="submit" className="signup-login-submit">
                {props.isSubmitting ? (
                  <Spinner size="small" color="text-white" />
                ) : (
                  "Log In"
                )}
              </button>
            </Form>
          )}
        </Formik>
        <div className="signup-login-link">
          <Link href="/signup">
            <a>Don't have an account? Signup </a>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Login);

import { MutationFunctionOptions, FetchResult } from "@apollo/client";
import { Field, Form, Formik } from "formik";
import { CreateTaskMutation, Exact } from "../../generated/graphql";
import { addTask } from "./addTask";

const AddTaskModal = ({
  projectId,
  createTaskMutation,
  setShowModal,
}: AddTaskModalProps) => {
  return (
    <div className="add-task-from-wrapper">
      <Formik
        initialValues={{ name: "" }}
        onSubmit={({ name }) => {
          addTask(createTaskMutation, projectId, name);
          setShowModal(false);
        }}
      >
        {(props) => (
          <Form className="add-task-from">
            <h2 className="add-task-head">Add a task</h2>
            <div className="mb-3">
              <label className="mb-3">
                Task Name:
                <Field
                  required
                  type="text"
                  name="name"
                  placeholder="task name"
                  className="form-text-input"
                />
              </label>
            </div>
            <div
              onClick={() => setShowModal(false)}
              className="form-cancel-btn"
            >
              Cancel
            </div>
            <button type="submit" className="form-submit-btn">
              {!props.isSubmitting ? "Add" : "Adding"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

interface AddTaskModalProps {
  projectId: number;
  createTaskMutation: (
    options?: MutationFunctionOptions<
      CreateTaskMutation,
      Exact<{
        projectId: number;
        name: string;
      }>
    >
  ) => Promise<
    FetchResult<CreateTaskMutation, Record<any, any>, Record<any, any>>
  >;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default AddTaskModal;

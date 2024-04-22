import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import closeImage from "../asserts/images/close.svg";
import { axiosI } from "../instance/axios";
const Detailview = ({ action, data, showProjects, updateState }) => {
  const [openPopup, setOpenPopup] = useState(false);
  const [scrollableModal, setScrollableModal] = useState(false);
  const [ProjectData, setProjectData] = useState({
    title: "",
    description: "",
    todos: [],
  });

  useEffect(() => {
    console.log("check bro", action);
    if (action != "create") {
      // const data={name:}
      //   action.name = data.title;
      //   data.todolist = data.todos
      //     ? data.todos
      //     : data.todo
      //     ? data.todo
      //     : [];
      console.log(action, data, "action check");
      setProjectData(data);
    }
    setOpenPopup(true);
    setScrollableModal(true);
  }, []);

  function showProjectsCall() {
    showProjects();
  }

  // function addTodoList(){
  //     setProjectData(...scrollableModal,{status:"",Description:""})

  // }
  function check() {
    // event.preventDefault();

    if (ProjectData._id) {
      axiosI
        .post("/update", ProjectData)
        .then((sucessData) => {
          if (sucessData.status == 200) {
            const finalList = sucessData.data.projects.map((v) => {
              const todos = v?.todo?.map((todoid) => {
                return sucessData.data.todos.find((v) => v._id == todoid);
              });
              return {
                id: v._id,
                title: v.title,
                description: v.description,
                totaltask: v?.todo?.length,
                todos,
                completed: todos?.filter((v) => v.status !== "pending").length,
              };
            });
            // updateTotalProjectRerender(finalList)
            console.log(sucessData);
          } else {
            return;
          }
        })
        .catch((err) => {
          console.log(err, "err");
        });
    } else {
      axiosI
        .post("/insert", ProjectData)
        .then((sucessData) => {
          if (sucessData.status == 200) {
            updateState(sucessData);
            console.log(sucessData);
          }
          return;
        })
        .catch((err) => {
          console.log(err, "err");
        });
    }

    console.log(ProjectData, "ProjectData");
  }

  function changeData(event) {
    // event.preventdefault()
    let eventData = event.target;
    setProjectData({ ...ProjectData, [eventData.name]: eventData.value });
    console.log(eventData.name, eventData.description, "eventData");

    // let event = e.target
    // console.log(event.namevent , event.value)
  }

  function addToDo() {
    let newProjectData = { ...ProjectData };
    newProjectData.todos.push({ status: "pending", description: "" });
    setProjectData(newProjectData);
  }

  function changeTodoList(event) {
    console.log(
      event.target.checked,
      event.target.name,
      event.target.id,
      event.target,
      "event...."
    );
    let newProjectData = { ...ProjectData };

    if (event.target.name === "description") {
      newProjectData.todos[Number(event.target.id)][event.target.name] =
        event.target.value;
    } else {
      newProjectData.todos[Number(event.target.id)][event.target.name] =
        event.target.checked ? "completed" : "pending";
    }
    setProjectData(newProjectData);
  }

  function deleteTodo(index) {
    let newProjectData = { ...ProjectData };
    newProjectData.todos.splice(index, 1);
    setProjectData(newProjectData);
    console.log(newProjectData, "newProjectData Arockia");
  }
  return (
    <>
      <MDBModal
        open={scrollableModal}
        onClose={() => {
          setScrollableModal(false);
          showProjectsCall();
        }}
        tabIndex="-1"
      >
        <MDBModalDialog scrollable>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Modal title</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => {
                  setScrollableModal(false);
                  showProjectsCall();
                }}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <form>
                <div class="form-group text-start mb-4 mt-3">
                  <label className="text-start mb-2">Project Name</label>
                  <input
                    type="text"
                    className="form-control text-start"
                    name="title"
                    onChange={changeData}
                    value={ProjectData.title}
                    placeholder="Type Here"
                  />
                  <small className="form-text text-muted"></small>
                </div>
                <div class="form-group text-start mb-4">
                  <label className="text-start mb-2">Description</label>
                  <textarea
                    className="form-control text-start"
                    placeholder="Description"
                    name="description"
                    onChange={changeData}
                    value={ProjectData.description}
                  ></textarea>
                </div>
                {/* <div class="form-check">
                <input type="checkbox" class="form-check-input" id="exampleCheck1">
                <label class="form-check-label" for="exampleCheck1">Check me out</label>
            </div> */}

                <div className=" row">
                  <div className="col-8 text-start">
                    <label className="text-start mb-2">TodoList</label>
                  </div>
                  <div className="col-2 text-start">
                    <label className="text-start mb-2">Completed</label>
                  </div>
                  <div className="col-2 text-start">
                    <label className="text-start mb-2">Delete</label>
                  </div>

                  {ProjectData.todos.map((data, index) => (
                    <section className="row mb-3">
                      <div className="col-8">
                        <input
                          type="text"
                          className="form-control text-start"
                          name="description"
                          id={index}
                          onChange={changeTodoList}
                          value={data.description}
                          placeholder="Type Here"
                        />
                      </div>
                      <div className="col-2">
                        <input
                          name="status"
                          className="form-check-input"
                          type="checkbox"
                          id={index}
                          onChange={changeTodoList}
                          checked={data.status !== "pending"}
                        />
                      </div>
                      <div className="col-2">
                        <img
                          src={closeImage}
                          style={
                            ProjectData.todos.length == 1
                              ? { opacity: "0.5", "pointer-events": "none" }
                              : {}
                          }
                          onClick={() => {
                            deleteTodo(index);
                          }}
                          alt=""
                        />
                      </div>
                    </section>
                  ))}
                </div>
              </form>

              <div className="row justify-content-end">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    addToDo();
                  }}
                >
                  Add
                </button>
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setScrollableModal(!setScrollableModal);
                  showProjectsCall();
                }}
              >
                {" "}
                test
              </button>
              <button
                className="btn btn-success"
                disabled={
                  ProjectData.todos.every(
                    (todo) => todo.description.length > 0
                  ) &&
                  ProjectData.title.length &&
                  ProjectData.description.length
                    ? false
                    : true
                }
                onClick={() => {
                  check();
                }}
                type="submit"
              >
                {" "}
                Save changes
              </button>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default Detailview;

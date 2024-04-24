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
import axiosI from "../instance/axios";
const Detailview = ({ action, data, showProjects, updateState }) => {
  const [scrollableModal, setScrollableModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [resetProject, setresetProject] = useState({});
  const [deletepopup, setdeletepopup] = useState({ status: false, index: 0 });
  const [ProjectData, setProjectData] = useState({
    title: "",
    description: "",
    todo: [{ status: "pending", description: "" }],
  });

  useEffect(() => {
    if (action !== "create") {
      let newdata = { ...data }
      setresetProject(newdata)
      setProjectData(data);
    }
    setScrollableModal(true);
  }, [action, data]);

  function showProjectsCall() {
    showProjects();
  }

  function check() {
    if (ProjectData._id) {
      console.log(ProjectData, "ProjectData")
      axiosI
        .post("/update", ProjectData)
        .then((sucessData) => {
          console.log(sucessData.status, "sucessData")
          if (sucessData.status === 200) {
            updateState(sucessData);
            setScrollableModal(false);
            return
          } else {
            return alert('sommething went erong');
          }
        }).catch((err) => {
          console.log(err, "error....")
          return alert('sommething went erong')
        });
    } else {
      axiosI
        .post("/insert", ProjectData)
        .then((sucessData) => {
          console.log(sucessData, "sucessdata")
          if (sucessData.status === 200) {
            updateState(sucessData);
            console.log(sucessData);
          }
          else if (sucessData.status === 401) {
            alert('somethig went wrong')
          }
          return;
        })
        .catch((err) => {
          console.log(err, "err")
          return alert('somethig went wrong')
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
    newProjectData.todo.push({ status: "pending", description: "" });
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
      newProjectData.todo[Number(event.target.id)][event.target.name] =
        event.target.value;
    } else {
      newProjectData.todo[Number(event.target.id)][event.target.name] =
        event.target.checked ? "completed" : "pending";
    }
    setProjectData(newProjectData);
  }

  function deleteTodo(index) {
    if (ProjectData._id) {
      setdeletepopup({ status: true, index: index })
    } else {
      let newProjectData = { ...ProjectData };
      newProjectData.todo.splice(index, 1);
      setProjectData(newProjectData);
    }
  }
  function clearChanges() {
    setProjectData({
      title: "",
      description: "",
      todo: [{ status: "pending", description: "" }],
    })
  }
  function hitdeleteRequest(index) {

    let id = ProjectData.todo[index]._id
    axiosI
      .post("/delete", {
        projectId: ProjectData._id,
        todolistId: id
      })
      .then((sucessData) => {
        let newProjectData = { ...ProjectData };
        newProjectData.todo.splice(index, 1);
        setProjectData(newProjectData);
        setdeletepopup({ status: false, index: 0 })

      }).catch((err) => {
        console.log(err, "error....")
        return alert('sommething went erong')
      });
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
              <MDBModalTitle>Project Details</MDBModalTitle>
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
                <div className="form-group text-start mb-4 mt-3">
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
                <div className="form-group text-start mb-4">
                  <label className="text-start mb-2">Description</label>
                  <textarea
                    className="form-control text-start"
                    placeholder="Description"
                    name="description"
                    onChange={changeData}
                    value={ProjectData.description}
                  ></textarea>
                </div>

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

                  {ProjectData.todo.map((data, index) => (
                    <section className="row mb-3" >
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
                            ProjectData.todo.length === 1
                              ? { opacity: "0.5", "pointer-events": "none" }
                              : {}
                          }
                          onClick={() => {
                            deleteTodo(index);
                          }}
                          alt=""
                        />
                      </div>

                      {deletepopup.status && deletepopup.index === index &&
                        (
                          <div className="row mt-3">
                            <div className="col-8 d-flex justify-content-center align-items-center">
                              <span className=" text-danger">Are you sure you want to delete ?</span>
                            </div>
                            <div className="col-2">
                              <button className="btn btn-success" onClick={() => { setdeletepopup({ status: false, index: 0 }) }}>No</button>

                            </div>
                            <div className="col-2">
                              <button className="btn btn-danger" onClick={(e) => { e.preventDefault(); hitdeleteRequest(deletepopup.index) }}>Yes</button>
                            </div>
                          </div>
                        )}
                    </section>
                  ))}
                </div>
              </form>

              <div className="row mw-40 justify-content-end">
                <button
                  className="btn btn-secondary btnwidth"
                  onClick={() => {
                    addToDo();
                  }}
                >
                  Add More
                </button>
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              {ProjectData._id ? (
                <></>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    clearChanges()
                  }}
                >
                  {" "}
                  Clear changes
                </button>
              )}

              <button
                className="btn btn-success"
                disabled={
                  ProjectData.todo.every(
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
                {ProjectData._id ? 'Update' : ' Save changes'}

              </button>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>

  );
};

export default Detailview;

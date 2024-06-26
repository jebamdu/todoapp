import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosI from "../instance/axios";
import "../components/home.css";
import Detailview from "./detailView";
import Navbar from "./Navbar";
import ExportView from "./ExportView";
const Home = () => {
  const navigate = useNavigate();
  const [project, setproject] = useState([]);
  const [projectDetailViewFlag, setprojectDetailViewFlag] = useState({
    flag: false,
    action: "create",
    data: {},
  });
  const [OpenExportModel, setOpenExportModel] = useState(null);
  useEffect(() => {
    let jwdAuth = JSON.parse(localStorage.getItem("jwdAuth"));
    console.log(jwdAuth, "jwdAuth");
    if (!jwdAuth) {
      return navigate("/");
    }

    axiosI
      .post("/allprojects")
      .then((data) => {
        const finalList = data.data.projects.map((v) => {
          const todo = v?.todo?.map((todoid) => {
            return data.data.todos.find((v) => v._id === todoid);
          });
          return {
            _id: v._id,
            title: v.title,
            description: v.description,
            totaltask: v?.todo?.length,
            todo,
            completed: todo?.filter((v) => v?.status !== "pending").length,
          };
        });
        console.log(finalList);
        setproject(finalList);
      })
      .catch((e) => {
        console.log(e, "error");
        if (e?.response?.status === 401) {
          localStorage.removeItem('jwdAuth')
          return navigate('/')
        }
        alert("something went wrong");
      });
  }, [navigate]);

  function createProject() {
    setprojectDetailViewFlag({ flag: true, action: "create" });
  }

  function updatePojectState(projectData) {
    let newproject = [...project];
    console.log(projectData, "projectData...");
    let index = project.findIndex((id) => id._id === projectData.data._id);

    if (index !== -1) {
      const newData = {
        _id: projectData.data._id,
        title: projectData.data.title,
        description: projectData.data.description,
        totaltask: projectData.data?.todo?.length,
        todo: projectData.data?.todo,
        completed: projectData.data.todo?.filter((v) => v.status !== "pending")
          .length,
      };
      newproject[index] = newData;
    } else {
      const newData = {
        _id: projectData.data._id,
        title: projectData.data.title,
        description: projectData.data.description,
        totaltask: projectData.data?.todo?.length,
        todo: projectData.data?.todo,
        completed: projectData.data.todo?.filter((v) => v.status !== "pending")
          .length,
      };
      newproject.unshift(newData);
    }
    setproject(newproject);
    setprojectDetailViewFlag({ flag: false, action: "create" });
  }

  function openDetailedProjectView(action, data) {
    console.log("check....", data, action);
    if (action === "create") {
      setprojectDetailViewFlag({ flag: true, action, data: {} });
    } else {
      setprojectDetailViewFlag({ flag: true, action, data });
    }
  }

  const showProjects = () => {
    setprojectDetailViewFlag({ flag: false, action: "create" });
    console.log("sucesss");
  };

  function sentRequiredParams(data, action) {
    if (action === "create") {
      return {
        title: "",
        description: "",
        todo: [{ status: "", description: "" }],
      };
    }
    return {
      _id: data._id ? data._id : "",
      title: data.title,
      description: data.description,
      todo: data.todo,
    };
  }



  document.addEventListener("DOMContentLoaded", function () {
    const items = document.querySelectorAll(".section");

    items.forEach((item) => {
      const exportButton = item.querySelector(".exportbtn");

      item.addEventListener("mouseenter", () => {
        exportButton.style.opacity = "1";
      });

      item.addEventListener("mouseleave", () => {
        exportButton.style.opacity = "0";
      });
    });
  });

  return (
    <>
      <Navbar createProject={createProject} />
      {projectDetailViewFlag.flag && (
        <Detailview
          action={projectDetailViewFlag.action}
          data={
            sentRequiredParams(
              projectDetailViewFlag.data,
              projectDetailViewFlag.action
            ) || {}
          }
          showProjects={showProjects}
          updateState={updatePojectState}
        />
      )}
      <ExportView OpenExportModel={OpenExportModel} setOpenExportModel={setOpenExportModel} />

      <div className="home bagroundimage w-100 min-vh-100 row d-flex align-items-center  justify-content-center">
        <div className="w-100 ">
        <div className="w-75 d-flex justify-content-end ">

        <button className="btn btn-secondary " onClick={createProject}>Create project</button>
        </div>
        </div>
        <div className="containerarea row d-flex justify-content-center">
          {project.map((data, index) => (
            <section
              key={data._id}
              className="col-5 section mb-4 p-2 mx-3 border border-succes rounded"
              style={{position:"relative"}}
            >
              <div className="export">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    // createmdFile();
                    setOpenExportModel(data)
                  }}
                  className="btn btn-success exportbtn"
                >
                  Export
                </button>
              </div>
              <div
                className="row"
                onClick={() => {
                  openDetailedProjectView("update", data);
                }}
              >
                <div className="col-9 mt-2">
                  <p className="mb-2 px-2 text-start fw-bold ">{data.title}</p>
                  <p className="text-start px-2 fw-normal oblique-text text-start">
                    {data.description}
                  </p>
                </div>
                <div className="col-3 mt-4">
                  <div className="border countBox  border-secondary rounded-circle  d-flex align-items-center justify-content-center">
                    <span className="fw-semibold">
                      {data.completed}/{data.totaltask}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;

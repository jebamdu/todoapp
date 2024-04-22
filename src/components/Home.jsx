import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import  axiosI  from "../instance/axios";
import "../components/home.css";
import Detailview from "./detailView";
import Navbar from "./Navbar";
const Home = () => {
  const navigate = useNavigate()
  const [project, setproject] = useState([]);
  const [projectDetailViewFlag, setprojectDetailViewFlag] = useState({
    flag: false,
    action: "create",
    data: {},
  });
  // let projectlist = [
  //   {
  //     id: 11,
  //     name: "Angular",
  //     description:
  //       " Angular is a development platform, built on TypeScript. As a platform, Angular includes: A component-based framework for building scalable web applications.",
  //     completed: 2,
  //     totaltask: 5,
  //   },
  //   {
  //     id: 22,
  //     name: "React",
  //     description:
  //       " Angular is a development platform, built on TypeScript. As a platform, Angular includes: A component-based framework for building scalable web applications.",
  //     completed: 2,
  //     totaltask: 5,
  //   },
  //   {
  //     id: 33,
  //     name: "Nest",
  //     description:
  //       " Angular is a development platform, built on TypeScript. As a platform, Angular includes: A component-based framework for building scalable web applications.",
  //     completed: 2,
  //     totaltask: 5,
  //   },
  //   {
  //     id: 44,
  //     name: "Next",
  //     description:
  //       " Angular is a development platform, built on TypeScript. As a platform, Angular includes: A component-based framework for building scalable web applications.",
  //     completed: 2,
  //     totaltask: 5,
  //   },
  //   {
  //     id: 55,
  //     name: "Node",
  //     description:
  //       " Angular is a development platform, built on TypeScript. As a platform, Angular includes: A component-based framework for building scalable web applications.",
  //     completed: 2,
  //     totaltask: 5,
  //   },
  // ];
  useEffect(() => {

    let jwdAuth = JSON.parse(localStorage.getItem('jwdAuth'))
    console.log(jwdAuth,"jwdAuth")
    if(!jwdAuth){
      return navigate('/')
    }

    axiosI.post('/allprojects').then((data)=>{
      const finalList = data.data.projects.map((v) => {
        const todos = v?.todo?.map((todoid) => {
          return data.data.todos.find((v) => v._id == todoid);
        });
        return {
          id: v._id,
          title: v.title,
          description: v.description,
          totaltask: v?.todo?.length,
          todos,
          completed: todos?.filter((v) => v?.status !== "pending").length,
        };
      });
      console.log(finalList);
      setproject(finalList);
    }).catch((e)=>{
      console.log(e,"error")
      alert('something went wrong')
    })

    fetch("http://localhost:3000/allprojects")
      .then((d) => d.json())
      .then((d) => {
        console.log(d);

      })
      .catch((err) => {
        console.error(err);
      });
    // setproject(projectlist);
  }, []);

  function createProject() {
    setprojectDetailViewFlag({ flag: true, action: "create" });
  }

  function updatePojectState(projectData) {
    console.log(projectData, "projectDatta..");
    let newproject = [...project];
    const newData = {
      id: projectData.data._id,
      title: projectData.data.title,
      description: projectData.data.description,
      totaltask: projectData.data?.todo?.length,
      todo: projectData.data?.todo,
      completed: projectData.data.todo?.filter((v) => v.status !== "pending")
        .length,
    };
    newproject.unshift(newData);
    setproject(newproject);
    setprojectDetailViewFlag({ flag: false, action: "create" });
  }

  function openDetailedProjectView(action, data) {
    console.log("check....");
    if (action == "create") {
      setprojectDetailViewFlag({ flag: true, action, data: {} });
    } else {
      setprojectDetailViewFlag({ flag: true, action, data });
    }
  }

  const showProjects = () => {
    setprojectDetailViewFlag({ flag: false, action: "create" });
    console.log("sucesss");
  };
  return (
    <>
      <Navbar />
      {projectDetailViewFlag.flag && (
        <Detailview
          action={projectDetailViewFlag.action}
          data={projectDetailViewFlag.data || {}}
          showProjects={showProjects}
          updateState={updatePojectState}
        />
      )}

      <div className=" w-100  d-flex align-items-center justify-content-end mr-5 ">
        <button
          type="button"
          onClick={() => {
            createProject();
          }}
          className="btn btn-success"
        >
          Create Project
        </button>
      </div>

      <div className="home bagroundimage w-100 min-vh-100 d-flex align-items-center justify-content-center">
        <div className="containerarea row d-flex justify-content-center">
          {project.map((data, index) => (
            <section
              key={data.id}
              className="col-5 section mb-4 p-2 mx-3 border border-succes rounded"
            >
              <div
                className="row"
                onClick={() => {
                  openDetailedProjectView("update", data);
                }}
              >
                <div className="col-9 mt-2">
                  <p className="mb-2 px-2 text-start fw-bold text-star">
                    {data.title}
                  </p>
                  <small className="text-start px-2 fw-normal oblique-text text-star">
                    {data.description}
                  </small>
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

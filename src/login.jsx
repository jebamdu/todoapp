import React, { useRef, useState ,useEffect} from "react";
import loginimage from "./asserts/images/loginImg.svg";
import { useNavigate } from 'react-router-dom';
import "./App.css";
// import { navigate } from '@reach/router';
import { axiosI } from "./instance/axios";
const Login = () => {
  const navigate = useNavigate();
  const [loginCredentials, setloginCredentials] = useState({
    username: "",
    password: "",
  });
  const credInvalidFlag = useRef(0);

  let credInvalidMsg = "Your credentials is invalid !";

  useEffect(() => {
    let jwdAuth = JSON.parse(localStorage.getItem('jwdAuth'))
    console.log(jwdAuth,"jwdAuth")
    if(jwdAuth){
      return navigate('/home')
    }
  }, []);

  function loginverify(event) {
    event.preventDefault();
    if (
      loginCredentials.username.length > 0 &&
      loginCredentials.password.length > 0
    ) {
      axiosI.post('/login',loginCredentials).then((data)=>{
        if(data.error){
          credInvalidFlag.current = 1;
        }else{
          console.log(data.data)
          localStorage.setItem('jwdAuth',JSON.stringify({token:data.data.token,username:loginCredentials.username}))
          navigate('/home')
        }
      }).catch((e)=>{
        console.log(e)
        if(e.response.status == 401){
          credInvalidFlag.current = 1;
         return alert('invalid credentials')
        }
        return alert('something went wrong')
       
      })
    } else {
      return alert('please check the credentials')
    }
  }

  function logincred(event) {
    credInvalidFlag.current = 0;
    const { name, value } = event.target;
    setloginCredentials({ ...loginCredentials, [name]: value });
    console.log(loginCredentials, "loginCredentials");
    event.preventDefault();
  }

  return (
    <div className="maincontainer  w-100 min-vh-100 d-flex align-items-center justify-content-around">
      <div className="container  w-70 h-65 d-flex row">
        <div className="border border-secondary d-flex col-6 align-items-center justify-content-center">
          <img src={loginimage} alt="loginImage" />
        </div>
        <div className="border border-secondary col-6">
          <section className="d-flex align-items-center justify-content-center h-100">
            <form
              className="d-flex flex-column text-start"
              onSubmit={loginverify}
            >
              <div className="form-group mb-2">
                <label>Email address</label>
                <input
                  name="username"
                  value={loginCredentials.username}
                  type="email"
                  className="form-control"
                  onChange={logincred}
                  placeholder="Enter email"
                />
              </div>
              <div className="form-group mb-2">
                <label>Password</label>
                <input
                  name="password"
                  value={loginCredentials.password}
                  type="password"
                  onChange={logincred}
                  className="form-control"
                  placeholder="Password"
                />
              </div>
              <button type="submit" className="btn btn-primary mb-2">
                Submit
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};
export default Login;
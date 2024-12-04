import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import { registerRoute } from "../../utils/APIRoutes"; // Ensure this is correctly defined
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }

  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }

  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }

  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default function Register() {
  const history = useHistory();

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      history.push("/login");
    }
  }, [history]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error("Password and confirm password should be the same.");
      return false;
    } else if (username.length < 3) {
      toast.error("Username should be at least 3 characters long.");
      return false;
    } else if (password.length < 8) {
      toast.error("Password should be at least 8 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (handleValidation()) {
      const { username, password, email } = values;
      try {
        const response = await axios.post(registerRoute, {
          username,
          email,
          password,
        });

        console.log("Response from backend:", response.data);

        if (response.data.status === false) {
          toast.error(response.data.msg); // Hiển thị lỗi nếu backend trả về status false
        }

        if (response.data.status === true) {
          // Hiển thị thông báo đăng ký thành công
          toast.success("Đăng ký thành công!");

          // Reset form sau khi đăng ký thành công
          setValues({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          });

          // Điều hướng đến trang login sau khi đăng ký thành công
          setTimeout(() => {
            history.push("/login");
          }, 1500); // Delay một chút trước khi điều hướng đến trang login
        }
      } catch (error) {
        console.error("An error occurred while registering:", error);
        toast.error("An error occurred while registering.");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <div className="brand">
            <h1>snappy</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={values.username}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={values.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={values.password}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
          />
          <button type="submit">Create User</button>
          <span>
            Already have an account? <Link to="/login">Login</Link>.
          </span>
        </form>
      </FormContainer>

      {/* ToastContainer để hiển thị các thông báo */}
      <ToastContainer />
    </>
  );
}

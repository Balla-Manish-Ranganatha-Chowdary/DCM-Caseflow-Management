import { Link } from "react-router";         
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { users } from "../data/users";

export function LoginForm({
    inputClass,
    submitClass,
    registerLinkContainer,
    registerLinkClass,
    submitBtnName = "Login",
    isUser = null, 
    notjudge = false,}){
    const {
            register,
            handleSubmit,
            reset,
            formState: { errors },
        } = useForm({
            defaultValues: { username: "", email: "", password: "" },
        });

    const navigate = useNavigate();

    const onSubmit = (data) => {
    const inputEmail = (data.email || "").trim().toLowerCase();
    const inputPassword = (data.password || "").trim();
    const inputUsername = (data.username || "").trim().toLowerCase();

    const userFound = users.find((u) => {
    const storedEmail = (u.email || "").trim().toLowerCase();
    const storedPassword = (u.password || "").trim();
    const storedUsername = (u.username || "").trim().toLowerCase();

    if (isUser) {
        

        return (
          storedUsername === inputUsername &&
          storedEmail === inputEmail &&
          storedPassword === inputPassword
        );
      }


      return storedEmail === inputEmail && storedPassword === inputPassword;
    });

    if (userFound) {
      const publicUser = {
        id: userFound.id,
        username: userFound.username,
        email: userFound.email,
      };
      localStorage.setItem("authUser", JSON.stringify(publicUser));

      navigate("/user-login-page/userPage");
      reset();
    } else {
      alert("Invalid username or password. User not registered");
    }
  };


  return (
    <div className="container">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
        {isUser && (
          <input
            type="text"
            placeholder="Username"
            className={inputClass}
            {...register("username", {
              required: { value: true, message: "The field is required" },
              minLength: { value: 3, message: "Min length is 3" },
              maxLength: { value: 9, message: "Max length is 9" },
            })}
          />
        )}
        {errors.username && (
          <div style={{ color: "red", fontSize: "15px" }}>{errors.username.message}</div>
        )}

        <input
          type="email"
          placeholder="Email"
          className={inputClass}
          {...register("email", {
            required: { value: true, message: "The field is required" },
            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" },
          })}
        />
        {errors.email && <div style={{ color: "red", fontSize: "15px" }}>{errors.email.message}</div>}

        <input
          type="password"
          placeholder="Password"
          className={inputClass}
          {...register("password", {
            required: { value: true, message: "The field is required" },
            minLength: { value: 6, message: "Min length is 6" },
          })}
        />
        {errors.password && <div style={{ color: "red", fontSize: "15px" }}>{errors.password.message}</div>}

        {notjudge && (
          <div className={registerLinkContainer}>
            <Link to="/forget-pass" className={registerLinkClass}>
              Forget your password?
            </Link>
          </div>
        )}

        <input type="submit" value={submitBtnName} className={submitClass} />
      </form>
    </div>
  );
}

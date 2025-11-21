import { Link } from "react-router";         
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";

export function LoginForm({
    inputClass,
    submitClass,
    registerLinkContainer,
    registerLinkClass,
    submitBtnName = "Login",
    isUser = null, 
    notjudge = false,
    loginEndpoint = "/api/auth/login/user",
    redirectPath = "/user-login-page/userPage"
}){
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: { username: "", email: "", password: "" },
    });

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const inputEmail = (data.email || "").trim().toLowerCase();
        const inputPassword = (data.password || "").trim();
        const inputUsername = (data.username || "").trim().toLowerCase();

        try {
            const response = await fetch(`http://localhost:8000${loginEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: inputEmail,
                    password: inputPassword
                })
            });

            if (response.ok) {
                const result = await response.json();
                
                // Store user info in localStorage
                localStorage.setItem('token', result.access_token);
                localStorage.setItem('role', result.role);
                localStorage.setItem('userId', result.user_id);
                if (result.username) {
                    localStorage.setItem('username', result.username);
                }

                navigate(redirectPath);
                reset();
            } else {
                const error = await response.json();
                alert(error.detail || "Invalid credentials");
            }
        } catch (error) {
            console.error('Login error:', error);
            alert("Login failed. Please try again.");
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

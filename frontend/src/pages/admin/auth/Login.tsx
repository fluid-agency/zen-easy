import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";
import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';
import { signInAdmin } from "../../../services/adminServices";

type TUserLogin = {
    email: string;
    password: string;
};

const AdminLogin = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TUserLogin>();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState<string | "">("");
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit: SubmitHandler<TUserLogin> = async (data) => {
        try {
            setLoginError("");

            const res = await signInAdmin(data.email, data.password);

            // save token
            if (res.success && res.data) {
                localStorage.setItem("isAdmin", "true");
            }
            // redirect
            navigate("/admin/overview");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setLoginError(err.message);
            } else {
                setLoginError("Something went wrong. Please try again.");
            }
        }
    };


    return (
        <div className="login-container">
            <div className="heading animated-heading">
                <h1 className="animated-item"> <Link className="brand-name" to='/'>Zen Easy BD</Link></h1>
                <h2 className="animated-item">Provide Admin Credentials</h2>
            </div>

            <div className="login-form-section animated-form-section">
                <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                    <div className="form-grid">
                        <div className="form-group animated-item">
                            <label htmlFor="loginEmail">Email</label>
                            <input
                                id="loginEmail"
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "Please enter a valid email address",
                                    },
                                })}
                                placeholder="john.doe@example.com"
                                className={errors.email ? "error" : ""}
                            />
                            {errors.email && (
                                <span className="error-message">{errors.email.message}</span>
                            )}
                        </div>

                        <div className="form-group animated-item password-group">
                            <label htmlFor="loginPassword">Password</label>
                            <input
                                id="loginPassword"
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters long",
                                    },
                                })}
                                placeholder="********"
                                className={errors.password ? "error" : ""}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />} {/* Lucide icons */}
                            </button>
                            {errors.password && (
                                <span className="error-message">{errors.password.message}</span>
                            )}
                        </div>
                    </div>
                    <div className="text-red-500 my-2">
                        {loginError && <span className="error-message">{loginError}</span>}
                    </div>

                    <div className="form-actions animated-item">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="submit-btn btn-primary"
                        >
                            {isSubmitting ? "Logging In..." : "Login"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
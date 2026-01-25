import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNotification } from "../../../context/notification/NotificationContext";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import "./ResetPassword.scss";

type ResetPasswordFormData = {
  email: string;
};

const ResetPassword = () => {
  const authContext = useContext(AuthContext);
  const { showError, showSuccess } = useNotification();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>();

  if (!authContext) {
    throw new Error("Authentication context is not available.");
  }
  const { resetPassword } = authContext;

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
    if (!resetPassword) {
      showError("Reset password function is not available.");
      return;
    }
    try {
      await resetPassword(data.email);
      showSuccess("Password reset link sent to your email. Please check your inbox or spam folder.",2000);
      setTimeout(() => {
        window.location.href = "/auth/login"; 
      }, 2000);
    } catch (error: any) {
      console.error("Firebase Password Reset Error:", error); 
      
      let errorMessage = "Failed to send reset link. Please try again.";

      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = "No user found with that email address.";
            break;
          case 'auth/invalid-email':
            errorMessage = "The email address is not valid.";
            break;
          case 'auth/network-request-failed':
            errorMessage = "Network error. Please check your internet connection.";
            break;
          default:
            errorMessage = error.message; 
            break;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      showError(errorMessage);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h1 className="card-title">Reset Your Password</h1>
        <p className="card-subtitle">Enter your email address to receive a password reset link.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Please enter a valid email address.",
                },
              })}
              placeholder="your.email@example.com"
              className={errors.email ? "error" : ""}
              disabled={isSubmitting}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

            <div className="text-sm font-semibold my-5 text-start text-slate-500">
                <p>If you don't receive the email, please check your spam folder.</p>
            </div>
        <div className="back-to-login">
          Remember your password? <Link to="/auth/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import "./OTPValidate.scss";
import { generateOTP, validateOTP } from "../../../services/authServices";

type TOTPForm = {
  otp: string;
};

const OTPValidate = () => {
  const { id } = useParams<{ id: string }>();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    reset,
  } = useForm<TOTPForm>({
    defaultValues: {
      otp: "",
    },
  });

  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // -------clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startResendTimer = () => {
    setResendTimer(60);
    setCanResend(false);
    setMessage(null);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOrResendOTP = async () => {
    if (!canResend && otpSent) return;

    setMessage(null);
    setCanResend(false);
    setIsSendingOtp(true);
    reset({ otp: "" });
    clearErrors();
// --------------------generate otp ---------------------
    try {
      const response = await generateOTP(id as string);
      setMessage({ type: "success", text: response.message || "OTP sent! Check your email." });
      setOtpSent(true);
      startResendTimer();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to send OTP." });
      setCanResend(true);
      setOtpSent(false);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const onSubmit: SubmitHandler<TOTPForm> = async (data) => {
    setMessage(null);
    clearErrors();

    try {
      const response = await validateOTP(id as string, data.otp); 
      setMessage({
        type: "success",
        text: response.message || "OTP validated successfully!",
      });
      if(response?.success){
        window.location.replace('/');
      }

    } catch (err: any) {
     
      setError("otp", {
        type: "manual",
        message: err.message || "Invalid OTP.",
      });
      setMessage({
        type: "error",
        text: err.message || "OTP validation failed.",
      });
    }
  };

  return (
    <div className="otp-validate-container">
      <div className="otp-card animated-card">
        <div className="otp-header">
          <h2>Verify Your Account</h2>
          <p>
            {!otpSent
              ? "Click the button below to receive an OTP to your email."
              : `An OTP has been sent to your email`}
            {otpSent ? `. Please enter.` : ""}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="otp-form">
          {!otpSent && (
            <div className="form-actions initial-send-otp">
              <button
                type="button"
                onClick={handleSendOrResendOTP}
                className="submit-btn btn-primary"
                disabled={isSendingOtp || isSubmitting}
              >
                {isSendingOtp ? "Sending OTP..." : "Send OTP to Email"}
              </button>
            </div>
          )}

          {otpSent && (
            <>
              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <Controller
                  name="otp"
                  control={control}
                  rules={{
                    required: "OTP is required",
                    pattern: {
                      value: /^\d{6}$/,
                      message: "OTP must be 6 digits.",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="otp"
                      type="text"
                      maxLength={6}
                      placeholder="Enter your 6 digits OTP"
                      className={errors.otp ? "error" : ""}
                    />
                  )}
                />
                {errors.otp && (
                  <span className="error-message">{errors.otp.message}</span>
                )}
              </div>

              {message && (
                <div className={`response-message ${message.type}`}>
                  {message.text}
                </div>
              )}

              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Verifying..." : "Verify OTP"}
                </button>
              </div>

              <div className="resend-section">
                <button
                  type="button"
                  onClick={handleSendOrResendOTP}
                  className="resend-btn"
                  disabled={!canResend || isSendingOtp || isSubmitting}
                >
                  {isSendingOtp
                    ? "Sending..."
                    : canResend
                    ? "Resend OTP"
                    : `Resend in ${resendTimer}s`}
                </button>
                <Link to="/auth/login" className="back-to-login">
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default OTPValidate;
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Form from "../components/common/Form";
import Input from "../components/common/Inputs/Input";
import PasswordInput from "../components/common/Inputs/PasswordInput";
import OtpInput from "../components/common/Inputs/OtpInput";
import Button from "../components/common/Button";
import useApiMutation from "../hooks/useApiMutation";
import HttpService from "../services/http.service";
import ENDPOINTS from "../constants/endpoints";

const emailSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
});
type EmailForm = z.infer<typeof emailSchema>;

const resetSchema = z
  .object({
    opt: z.string().trim().length(6, "Enter the 6-digit OTP"),
    password: z.string().min(5, "Password must be at least 5 characters"),
    conformPassword: z.string().min(5, "Please confirm your new password"),
  })
  .refine((data) => data.password === data.conformPassword, {
    message: "Passwords do not match",
    path: ["conformPassword"],
  });
type ResetForm = z.infer<typeof resetSchema>;

const OTP_VALID_SECONDS = 180; // matches backend generateExpiryDate(3) for forgot-password

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const emailForm = useForm<EmailForm>({ resolver: zodResolver(emailSchema) });
  const resetForm = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: { opt: "", password: "", conformPassword: "" },
  });

  const { mutate: sendOtp, isPending: sending } = useApiMutation(
    (data: EmailForm) => new HttpService(ENDPOINTS.AUTH.FORGOT_PASSWORD, true).post(data),
    {
      onSuccess: () => {
        setStep("reset");
        setSecondsLeft(OTP_VALID_SECONDS);
      },
    }
  );

  const { mutate: verifyOtp, isPending: verifying } = useApiMutation(
    (data: ResetForm) =>
      new HttpService(ENDPOINTS.AUTH.VERIFY_FORGET_PASSWORD, true).post({ email, ...data }),
    {
      onSuccess: () => navigate("/login"),
    }
  );

  const handleResend = () => {
    if (secondsLeft > 0) return;
    sendOtp({ email });
  };

  const formatTime = (total: number) => {
    const m = Math.floor(total / 60).toString().padStart(2, "0");
    const s = (total % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <Form
      title={step === "email" ? "Forgot password" : "Reset password"}
      onSubmit={
        step === "email"
          ? emailForm.handleSubmit((data) => {
              setEmail(data.email);
              sendOtp(data);
            })
          : resetForm.handleSubmit((data) => verifyOtp(data))
      }
    >
      {step === "email" ? (
        <>
          <Input label="Email" name="email" required register={emailForm.register} />
          {emailForm.formState.errors.email && (
            <p className="text-xs text-(--error)">{emailForm.formState.errors.email.message}</p>
          )}
          <Button value={sending ? "Sending..." : "Send OTP"} type="submit" disable={sending} />
        </>
      ) : (
        <>
          <p className="text-sm text-(--text-muted) -mt-2 text-center">
            Enter the OTP sent to <strong>{email}</strong>
          </p>

          <Controller
            name="opt"
            control={resetForm.control}
            render={({ field }) => (
              <OtpInput
                value={field.value}
                onChange={field.onChange}
                error={!!resetForm.formState.errors.opt}
              />
            )}
          />
          {resetForm.formState.errors.opt && (
            <p className="text-xs text-(--error) text-center">{resetForm.formState.errors.opt.message}</p>
          )}

          <PasswordInput label="New password" name="password" register={resetForm.register} />
          {resetForm.formState.errors.password && (
            <p className="text-xs text-(--error)">{resetForm.formState.errors.password.message}</p>
          )}

          <PasswordInput label="Confirm new password" name="conformPassword" register={resetForm.register} />
          {resetForm.formState.errors.conformPassword && (
            <p className="text-xs text-(--error)">{resetForm.formState.errors.conformPassword.message}</p>
          )}

          <div className="flex w-full items-center justify-between text-xs text-(--text-muted)">
            {secondsLeft > 0 ? (
              <span>Resend OTP in {formatTime(secondsLeft)}</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="cursor-pointer text-(--color-primary) hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>

          <Button value={verifying ? "Resetting..." : "Reset password"} type="submit" disable={verifying} />
        </>
      )}

      <Link to="/login" className="text-sm hover:text-(--color-primary)">
        Back to login
      </Link>
    </Form>
  );
};

export default ForgotPassword;
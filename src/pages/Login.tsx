import Button from "../components/common/Button"
import Form from "../components/common/Form"
import Input from "../components/common/Inputs/Input"
import PasswordInput from "../components/common/Inputs/PasswordInput"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validator/login.validator";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/queries/auth.queries";

export interface LoginForm {
  loginId: string;
  password: string;
}

const Login = () => {


  const { mutate } = useLogin()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })

  const handleSubmitData = (data: LoginForm) => {
    mutate(data)
  }

  return (
    <>
      <Form title="Admin login" onSubmit={handleSubmit((data) => handleSubmitData(data))}>

        <Input label="Email or UserId" name="loginId" required register={register} />
        {errors.loginId && <p>{errors.loginId.message}</p>}

        <PasswordInput label="password" name="password" register={register} />
        {errors.password && <p>{errors.password.message}</p>}

        <Link to="/forgot-password" className="flex w-full justify-end text-sm cursor-pointer hover:text-(--color-primary) active:text-(--color-primary-light) transition-all duration-400">
          Forgot password?
        </Link>

        <Button value="Login" type="submit" />
      </Form>
    </>
  )
}

export default Login
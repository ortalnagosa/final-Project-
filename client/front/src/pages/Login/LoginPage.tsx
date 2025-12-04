import bgImage from "../../img/singup-bg.jpg"; 
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../../validations/loginSchema";
import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { userActions } from "../../store/userSlice";
import { Button, Card, Label, TextInput } from "flowbite-react";

export default function Login() {
  const dispatch = useDispatch();
  const nav = useNavigate();

   const initialFormData = {
     email: "",
     password: "",
  };
    const {
      register,
      handleSubmit,
      formState: { errors, isValid },
    } = useForm({
      defaultValues: initialFormData,
        mode: "onChange",
      resolver: joiResolver(loginSchema),
    });

    const submitForm = async (form: typeof initialFormData) => {
      try {
        const tokenRes = await axios.post(
          "http://localhost:8181/api/users/login",
          form,
        );

        const token = tokenRes.data.data.user;
        localStorage.setItem("token", token);
      console.log("Token saved:", token);


        const parsedToken = JSON.parse(atob(token.split(".")[1]));
        axios.defaults.headers.common["x-auth-token"] = token;

       const res = await axios.get(
         "http://localhost:8181/api/users/" + parsedToken._id,
         {
           headers: {"x-auth-token":token},
         },
       );
  
console.log(res.data);

        dispatch(userActions.login(res.data));
              toast.success("כניסה מוצלחת!!");
        nav("/");
      } catch (error) {
        console.error("Error submitting form", error);
        toast.error("הכניסה נכשלה");
      }
    };
  return (
      <div
        className="flex min-h-screen items-center justify-center bg-cover bg-center p-4"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <Card className="w-full max-w-md bg-white/10 p-6 shadow-lg backdrop-blur-sm">
          <h2 className="mb-6 text-center text-3xl font-bold text-black/80">
            התחברות
          </h2>
          <form
            onSubmit={handleSubmit(submitForm)}
            className="flex flex-col gap-4"
          >
            <div>
              <Label>אימייל</Label>
              <TextInput
                type="email"
                {...register("email")}
                color={errors.email ? "failure" : undefined}
              />
              <p className="text-sm text-red-500">{errors.email?.message}</p>
            </div>
            <div>
              <Label>סיסמה</Label>
              <TextInput
                type="password"
                {...register("password")}
                color={errors.password ? "failure" : undefined}
              />
              <p className="text-sm text-red-500">{errors.password?.message}</p>
            </div>
            <Button
              type="submit"
              disabled={!isValid}
              className="w-full bg-black/60 hover:bg-black/80"
            >
              התחברות
            </Button>
          </form>
        </Card>
      </div>
  );
}
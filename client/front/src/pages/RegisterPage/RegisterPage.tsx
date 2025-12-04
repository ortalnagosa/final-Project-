import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { registerSchema } from "../../validations/registerSchema";
import { Button, TextInput, Label, Card, Spinner, Textarea} from "flowbite-react";
import { TUser } from "../../types/user";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import bgImage from "../../img/bg.jpg"; // נתיב יחסי מהקובץ שלך




export default function SignupFormNew() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TUser>({
    mode: "onChange",
    resolver: joiResolver(registerSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();


  const onSubmit = async (data: TUser) => {
        console.log("Form submitted", data);
    setIsSubmitting(true);


    try {
      await axios.post("http://localhost:8181/api/users/register", data);

       console.log("Success");
      toast.success("הרשמה הושלמה בהצלחה!");
      navigate("/login");
    } catch (err: any) {
        const msg =err?.response?.data?.message || "ההרשמה נכשלה. אנא נסה שוב";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div
      className="flex min-h-screen  items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Card className="w-full max-w-2xl bg-white/10 p-6 text-white/80 shadow-lg  backdrop-blur-sm">
        <h2 className="mb-6 text-center text-3xl font-bold text-white/80">
          צור חשבון חדש
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <div>
            <div>
              <Label className=" text-white/80">שם פרטי</Label>
              <TextInput
                {...register("name.first")}
                color={errors.name?.first ? "failure" : undefined}
              />
              <p className="text-sm text-red-500">
                {errors.name?.first?.message}
              </p>
            </div>
            <div>
              <Label className=" text-white/80">שם אמצעי</Label>
              <TextInput
                {...register("name.middle")}
                color={errors.name?.middle ? "failure" : undefined}
              />
              <p className="text-sm text-red-500">
                {errors.name?.middle?.message}
              </p>
            </div>
            <div className="md:col-span-2">
              <Label className=" text-white/80">שם משפחה</Label>
              <TextInput
                {...register("name.last")}
                color={errors.name?.last ? "failure" : undefined}
              />
              <p className="text-sm text-red-500">
                {errors.name?.last?.message}
              </p>
            </div>
          </div>
          <div>
            <div>
              <Label className=" text-white/80">אימייל</Label>
              <TextInput
                type="email"
                {...register("email")}
                color={errors.email ? "failure" : undefined}
              />
              <p className="text-sm text-red-500">{errors.email?.message}</p>
            </div>
            <div>
              <Label className=" text-white/80">טלפון</Label>
              <TextInput
                {...register("phone")}
                color={errors.phone ? "failure" : undefined}
              />
              <p className="text-sm text-red-500">{errors.phone?.message}</p>
            </div>
            <div>
              <Label className=" text-white/80">גיל</Label>
              <TextInput
                {...register("age")}
                color={errors.age ? "failure" : undefined}
              />
              <p className="text-sm text-red-500">{errors.age?.message}</p>
            </div>
          </div>
          <div>
            <Label className=" text-white/80">העלת תמונה</Label>
            <TextInput
              type="text"
              {...register("image.url")}
              color={errors.image?.url ? "failure" : undefined}
            />
            <p className="text-sm text-red-500">{errors.image?.url?.message}</p>
          </div>
          <div>
            <Label className=" text-white/80">תיאור תמונה</Label>
            <TextInput
              type="text"
              {...register("image.alt")}
              color={errors.image?.alt ? "failure" : undefined}
            />
            <p className="text-sm text-red-500">{errors.image?.alt?.message}</p>
          </div>

          <div>
            <Label className=" text-white/80">תאריך לידה</Label>
            <TextInput
              type="date"
              {...register("birthDate")}
              color={errors.birthDate ? "failure" : undefined}
            />
            <p className="text-sm text-red-500">{errors.birthDate?.message}</p>
          </div>

          <div>
            <Label className=" text-white/80">עיר מגורים</Label>
            <TextInput
              type="text"
              {...register("city")}
              color={errors.city ? "failure" : undefined}
            />
            <p className="text-sm text-red-500">{errors.city?.message}</p>
          </div>

          <div>
            <Label className=" text-white/80">יחידה בצבא</Label>
            <TextInput
              type="text"
              {...register("armyUnit")}
              color={errors.armyUnit ? "failure" : undefined}
            />
            <p className="text-sm text-red-500">{errors.armyUnit?.message}</p>
          </div>

          <div>
            <Label className=" text-white/80">תאריך שחרור מהצבא</Label>
            <TextInput
              type="date"
              {...register("releaseDate")}
              color={errors.releaseDate ? "failure" : undefined}
            />
            <p className="text-sm text-red-500">
              {errors.releaseDate?.message}
            </p>
          </div>

          <div>
            <Label className=" text-white/80">קצת עלי</Label>
            <Textarea
              {...register("about")}
              color={errors.about ? "failure" : undefined}
              className="h-24 w-full"
            />
            {errors.about && (
              <p className="text-sm text-red-500">שדה זה חובה</p>
            )}
          </div>

          <div>
            <div className="flex flex-col md:col-span-2">
              <Label className=" text-white/80">סיסמה</Label>
              <TextInput
                type="password"
                {...register("password")}
                color={errors.password ? "failure" : undefined}
              />
              <p className="text-sm text-red-500">{errors.password?.message}</p>
            </div>
            <div className="flex flex-col md:col-span-2">
              <Label className=" text-white/80 ">אישור סיסמה</Label>
              <TextInput
                type="password"
                {...register("confirmPassword")}
                color={errors.confirmPassword ? "failure" : undefined}
              />
              <p className="text-sm text-red-500">
                {errors.confirmPassword?.message}
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-center md:col-span-2">
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full bg-black/60 hover:bg-black/80 md:w-1/2"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Spinner size="sm" /> טוען...
                </span>
              ) : (
                "הרשמה"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

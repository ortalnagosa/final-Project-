import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { createJobSchema } from "../../validations/createJobsSchema";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { TRootState } from "../../store/store";
import { TcreateJob } from "../../types/createJobs";
import { useNavigate } from "react-router-dom";

export default function CreateJobPage() {
  const user = useSelector((state: TRootState) => state.userSlice.user);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TcreateJob>({
    resolver: joiResolver(createJobSchema),
    mode: "onChange",
  });

  const onSubmit = async (formData: any) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8181/api/jobs/create",
        {
          ...formData,
          user_id: user?._id,
        },
        {
          headers: { "x-auth-token": token || "" },
        },
      );

      toast.success("המשרה פורסמה בהצלחה!");
      navigate("/MyJobs");
      reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "שגיאה בפרסום המשרה");
    }
  };


  return (
    <div
      dir="rtl"
      className="min-h-screen w-full bg-gradient-to-b from-green-50 to-green-200 px-4 py-10 dark:from-gray-900 dark:to-gray-800"
    >
      <h1 className="mb-10 text-center text-4xl font-extrabold text-sky-700 drop-shadow-md dark:text-sky-400">
        פרסום משרה חדשה
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto grid max-w-4xl grid-cols-1 gap-6 rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur-sm dark:bg-gray-800 dark:text-white sm:grid-cols-2"
      >
        {/* כותרת */}
        <div className="sm:col-span-2 ">
          <label className="form-label  dark:text-white">כותרת *</label>
          <input
            className="form-input dark:text-black"
            {...register("title")}
          />
          {errors.title && <p className="form-error">{errors.title.message}</p>}
        </div>

        {/* כותרת משנה */}
        <div className="sm:col-span-2">
          <label className="form-label  dark:text-white">כותרת משנה</label>
          <input
            className="form-input  dark:text-black"
            {...register("subtitle")}
          />
        </div>

        {/* חברה */}
        <div>
          <label className="form-label  dark:text-white">שם החברה *</label>
          <input
            className="form-input  dark:text-black"
            {...register("company")}
          />
          {errors.company && (
            <p className="form-error  dark:text-white">
              {errors.company.message}
            </p>
          )}
        </div>

        {/* אתר */}
        <div>
          <label className="form-label  dark:text-white">אתר החברה *</label>
          <input className="form-input  dark:text-black" {...register("web")} />
          {errors.web && <p className="form-error">{errors.web.message}</p>}
        </div>

        {/* תיאור */}
        <div className="sm:col-span-2">
          <label className="form-label  dark:text-white">תיאור *</label>
          <textarea
            rows={5}
            className="form-input  dark:text-black"
            {...register("description")}
          ></textarea>
          {errors.description && (
            <p className="form-error">{errors.description.message}</p>
          )}
        </div>

        {/* הכתובת */}
        <div>
          <label className="form-label  dark:text-white">עיר *</label>
          <input
            className="form-input  dark:text-black"
            {...register("address.city")}
          />
        </div>
        <div>
          <label className="form-label  dark:text-white">רחוב *</label>
          <input
            className="form-input  dark:text-black"
            {...register("address.street")}
          />
        </div>
        <div>
          <label className="form-label  dark:text-white">מספר *</label>
          <input
            className="form-input  dark:text-black"
            {...register("address.houseNumber")}
          />
        </div>
        <div>
          <label className="form-label  dark:text-white">מיקוד</label>
          <input
            className="form-input  dark:text-black"
            {...register("address.zip")}
          />
        </div>

        {/* תמונה */}
        <div>
          <label className="form-label  dark:text-white">תמונה URL *</label>
          <input
            className="form-input  dark:text-black"
            {...register("image.url")}
          />
        </div>
        <div>
          <label className="form-label  dark:text-white">ALT *</label>
          <input
            className="form-input  dark:text-black"
            {...register("image.alt")}
          />
        </div>

        {/* טלפון */}
        <div>
          <label className="form-label  dark:text-white">טלפון</label>
          <input
            className="form-input  dark:text-black"
            {...register("phone")}
          />
        </div>

        {/* אימייל */}
        <div>
          <label className="form-label  dark:text-white">אימייל</label>
          <input
            className="form-input  dark:text-black"
            {...register("email")}
          />
        </div>

        {/* שכר */}
        <div className="sm:col-span-2">
          <label className="form-label  dark:text-white">שכר</label>
          <input
            className="form-input  dark:text-black"
            {...register("salary")}
          />
        </div>

        <button className="btn-primary sm:col-span-2">פרסום משרה</button>
      </form>

      <style>{`
      .form-input {
        width: 100%;
        padding: 10px 14px;
        background-color: #fff;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        transition: 0.25s;
      }
      .form-input:focus {
        outline: none;
        border-color: #16a34a;
        box-shadow: 0 0 0 3px rgba(22,163,74,0.2);
      }

      .form-label {
        display: block;
        margin-bottom: 6px;
        font-weight: 600;
        color: #065f46;
      }

      .form-error {
        font-size: 0.75rem;
        color: #dc2626;
        margin-top: 4px;
      }

      .btn-primary {
        font-size: 1.1rem;
        padding: 12px;
        font-weight: bold;
        background-color: #16a34a;
        color: white;
        border-radius: 12px;
        transition: background-color 0.25s;
      }
      .btn-primary:hover {
        background-color: #15803d;
      }
    `}</style>
    </div>
  );
}

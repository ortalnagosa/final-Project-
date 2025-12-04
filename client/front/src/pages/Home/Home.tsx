import { useState } from "react";
import bgHome from "../../img/singup-bg.jpg";
import { useSelector } from "react-redux";
import { TRootState } from "../../store/store";
import { Link } from "react-router-dom";
import { Briefcase, Search, UserCheck } from "lucide-react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type ContactForm = {
  name: string;
  email: string;
  phone?: string;
  age?: number;
  message: string;
};

export default function Home() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>();

  const handleContactSubmit = async (data: ContactForm) => {
    try {
      await axios.post("http://localhost:8181/api/users/contact", data);

      toast.success("ההודעה נשלחה בהצלחה!");
      reset(); 
    } catch (err) {
      toast.error("שגיאה בשליחת ההודעה");
    }
  };
  const user = useSelector((state: TRootState) => state.userSlice.user);
  const jobs = useSelector((state: TRootState) => state.jobsSlice.jobs);

const userId = user?._id || "";
const newJobs = jobs ? jobs.filter(
  (job) => !job.appliedByUserIds.includes(userId),
).length : 0;
const lastAppliedJobObj = jobs
  .filter((job) => job.appliedByUserIds.includes(userId))
  .slice(-1)[0]; // לוקח את האחרונה
  const lastAppliedJob = lastAppliedJobObj?._id || null;
  
  // המלצות / תגובות
  const [recommendations, setRecommendations] = useState([
    { name: "Ortal",age: 28, text: "לא רק לחיילים, יכול לעזור לכולם!" },
    {
      name:"מיכל",age:21,
      text: "מצאתי את המשרה הראשונה שלי הודות ל-Hachayalim Jobs!",
    },
    {
      name: "יוסי",age:35,
      text: "מערכת חכמה שעוזרת להתאים משרות בדיוק למה שמתאים לי",
    },
    {
      name: "שי",age:30,
      text: "התרשמתי מאוד מהקלילות באתר וההתאמה לעבודה, תודה על ההכוונה",
    },
  ]);

  const [newRecommendation, setNewRecommendation] = useState("");

  const handleAddRecommendation = () => {
    if (newRecommendation.trim() === "") return;
    setRecommendations([
      { name: user?.name.first || "משתמש",age:user?.age || 0, text: newRecommendation  },
      ...recommendations,
    ]);
    setNewRecommendation("");
  };



  return (
    <div
      className="min-h-screen bg-cover bg-center text-right dark:bg-gray-500"
      style={{ backgroundImage: `url(${bgHome})` }}
      dir="rtl"
    >
      <div className="flex min-h-screen flex-col items-center bg-black/40 p-6">
        {/* ברכת פתיחה */}
        <section className="mt-28 max-w-2xl rounded-3xl bg-white/80 p-10 shadow-xl backdrop-blur dark:bg-gray-300">
          <h1 className="mb-4 text-4xl font-black leading-tight text-sky-800">
            {user
              ? `ברוכה הבאה, ${user.name.first}!`
              : "ברוכה הבאה ל־Hachayalim Jobs!"}
          </h1>
          <p className="mb-6 text-lg text-sky-900">
            {user
              ? "הנה כל מה שמחכה לך היום באתר — המשיכי במסע התעסוקתי שלך!"
              : "מצא/י הזדמנויות חדשות, בחר/י מסלול תעסוקתי שמתאים לך והתחל/י היום."}
          </p>

          {/* CTA */}
          <div className="flex flex-col gap-4 dark:bg-gray-300  md:flex-row">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="flex-1 rounded-xl bg-sky-600 py-3 text-center text-lg text-white shadow-lg transition hover:bg-sky-700"
                >
                  התחברי לחשבון
                </Link>
                <Link
                  to="/jobs"
                  className="flex-1 rounded-xl bg-emerald-600 py-3 text-center text-lg text-white shadow-lg transition hover:bg-emerald-700"
                >
                  מצאי משרה
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/jobs"
                  className="flex-1 rounded-xl bg-emerald-600 py-3 text-center text-lg text-white shadow-lg transition hover:bg-emerald-700"
                >
                  למשרות הפתוחות ({newJobs})
                </Link>

                {lastAppliedJob && (
                  <Link
                    to={`/jobs/${lastAppliedJob}`}
                    className="flex-1 rounded-xl bg-yellow-500 py-3 text-center text-lg text-white shadow-lg transition hover:bg-yellow-600"
                  >
                    המשך משרה שהתחלת
                  </Link>
                )}

                {user.resume && (
                  <Link
                    to={`/profile/${user._id}/resume`}
                    className="flex-1 rounded-xl bg-sky-600 py-3 text-center text-lg text-white shadow-lg transition hover:bg-sky-700"
                  >
                    צפה בקורות חיים
                  </Link>
                )}
              </>
            )}
          </div>
        </section>

        {/* יתרונות / מאפיינים */}
        <section className="mt-20 grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 ">
          <div className="rounded-3xl bg-white/80 p-6 text-center shadow-xl backdrop-blur">
            <Search className="mx-auto mb-4 h-12 w-12 text-sky-700" />
            <h3 className="mb-2 text-xl font-bold text-sky-800">חיפוש חכם</h3>
            <p className="text-sky-900">
              מנוע חיפוש מתקדם שיעזור לך למצוא את המשרה המושלמת.
            </p>
          </div>
          <div className="rounded-3xl bg-white/80 p-6 text-center shadow-xl backdrop-blur">
            <Briefcase className="mx-auto mb-4 h-12 w-12 text-sky-700" />
            <h3 className="mb-2 text-xl font-bold text-sky-800">מאות משרות</h3>
            <p className="text-sky-900">מאגר משרות איכותי שמתעדכן מדי יום.</p>
          </div>
          <div className="rounded-3xl bg-white/80 p-6 text-center shadow-xl backdrop-blur">
            <UserCheck className="mx-auto mb-4 h-12 w-12 text-sky-700" />
            <h3 className="mb-2 text-xl font-bold text-sky-800">התאמה אישית</h3>
            <p className="text-sky-900">
              מערכת שמציגה משרות לפי הפרופיל האישי שלך.
            </p>
          </div>
        </section>

        <section className="mt-20 max-w-5xl space-y-6">
          <h2 className="mb-4 text-3xl font-bold text-white">סיפורי הצלחה</h2>

          {user && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newRecommendation}
                onChange={(e) => setNewRecommendation(e.target.value)}
                placeholder="כתוב המלצה חדשה..."
                className="flex-1 rounded-lg border border-sky-300 p-3"
              />
              <button
                onClick={handleAddRecommendation}
                className="rounded-lg bg-sky-600 px-4 text-white transition hover:bg-sky-700"
              >
                שלח
              </button>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur"
              >
                <p className="text-center text-sky-900">"{rec.text}"</p>
                <p className="mt-2 text-center font-semibold text-sky-700">
                  - {rec.name}, {rec.age}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 w-full max-w-4xl rounded-3xl bg-white/90 p-8 shadow-xl backdrop-blur  dark:bg-gray-300">
          <h2 className="mb-4 text-2xl font-bold text-sky-800">צור קשר</h2>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(handleContactSubmit)}
          >
            <input
              type="text"
              placeholder="שם מלא"
              className="rounded-lg border border-sky-300 p-3"
              {...register("name", { required: "שדה חובה" })}
            />
            {errors.name?.message && (
              <p className="text-red-600">{errors.name.message}</p>
            )}

            <input
              type="email"
              placeholder="דוא״ל"
              className="rounded-lg border border-sky-300 p-3"
              {...register("email", { required: "שדה חובה" })}
            />
            {errors.email?.message && (
              <p className="text-red-600">{errors.email.message}</p>
            )}

            <input
              type="phone"
              placeholder="טלפון"
              className="rounded-lg border border-sky-300 p-3"
              {...register("phone")}
            />

            <input
              type="number"
              placeholder="גיל"
              className="rounded-lg border border-sky-300 p-3"
              {...register("age")}
            />

            <textarea
              placeholder="הודעה"
              className="rounded-lg border border-sky-300 p-3"
              rows={4}
              {...register("message", { required: "שדה חובה" })}
            ></textarea>
            {errors.message?.message && (
              <p className="text-red-600">{errors.message.message}</p>
            )}

            <button
              type="submit"
              className="rounded-lg bg-sky-600 py-3 text-white transition hover:bg-sky-700"
            >
              שלח
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

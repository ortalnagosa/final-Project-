// LikesPage.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import GlobalSpinner from "../../components/GlobalSpinner";
import JobCard from "../../components/JobCard";
import { toast } from "react-toastify";
import { TJob } from "../../types/job";
import { useSelector } from "react-redux";
import { TRootState } from "../../store/store";

export default function LikesPage() {
  const [jobs, setJobs] = useState<TJob[]>([]);
  const [loading, setLoading] = useState(true);

  // משתמש שמחובר
  const user = useSelector((state: TRootState) => state.userSlice.user) || {
    _id: null,
    role: "user",
  };

  const handleUnlike = (jobId: string) => {
    setTimeout(() => {
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    }, 300);
  };


  const loadLikedJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8181/api/jobs/liked", {
        headers: { "x-auth-token": token || "" },
      });

      setJobs(res.data.data || res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("שגיאה בטעינת משרות");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLikedJobs();
  }, []);

  if (loading) return <GlobalSpinner />;

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-1 dark:bg-gray-400 min-h-screen">
      <h1 className="mb-4 text-2xl font-bold">המשרות שאהבת</h1>

      {jobs.length === 0 ? (
        <p>לא סימנת לייק על אף משרה 😔</p>
      ) : (
        <div className="mx-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              userId={user._id}
              userRole={user.role}
              setJobs={setJobs} // מאפשר עדכון לייק
              onUnlike={handleUnlike} // ⬅️ חדש!
            />
          ))}
        </div>
      )}
    </div>
  );
}

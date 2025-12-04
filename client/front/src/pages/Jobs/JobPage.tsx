import { useEffect, useState } from "react";
import axios from "axios";
import { TJob } from "../../types/job";
import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../../store/store";
import GlobalSpinner from "../../components/GlobalSpinner";
import { searchActions } from "../../store/searchSlice";
import JobCard from "../../components/JobCard";

const JobsPage = () => {
  const dispatch = useDispatch();
  const [jobs, setJobs] = useState<TJob[]>([]);
  const [loading, setLoading] = useState(true);

  const searchWord = useSelector(
    (state: TRootState) => state.searchSlice.searchWord,
  );

  // אם המשתמש לא מחובר, נשתמש בברירת מחדל
  const user = useSelector((state: TRootState) => state.userSlice.user) || {
    _id: null,
    role: "user",
  };

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 8;

  // סינון לפי חיפוש + רק משרות active למשתמש רגיל
  const filteredJobs = jobs
    .filter((job) => (user?.role === "user" ? job.status === "active" : true))
    .filter(
      (job) =>
        job.title.toLowerCase().includes(searchWord.toLowerCase()) ||
        job.subtitle?.toLowerCase().includes(searchWord.toLowerCase()),
    );

  // חישוב אינדקסים לפגינציה
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // אפקט לאיפוס עמוד כשמחפשים
  useEffect(() => {
    setCurrentPage(1);
  }, [searchWord]);

  // Fetch jobs מהשרת
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8181/api/jobs", {
          headers: token ? { "x-auth-token": token } : {},
        });
            console.log("MY JOBS:", res.data);
        setJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
        dispatch(searchActions.setSearchWord("")); // אופציונלי לאפס חיפוש
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <GlobalSpinner />;

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-1  dark:bg-gray-400">
      <h1 className="mb-4 text-2xl font-bold">כל המשרות</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-600">אין משרות כרגע.</p>
      ) : (
        <>
          <div className="mx-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {currentJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                userRole={user.role}
                userId={user._id}
                setJobs={setJobs}
              />
            ))}
          </div>

          {/* פגינציה */}
          <div className="mt-4 flex justify-center gap-2">
            {Array.from(
              { length: Math.ceil(filteredJobs.length / jobsPerPage) },
              (_, i) => (
                <button
                  key={i}
                  className={`rounded border px-3 py-1 ${currentPage === i + 1 ? "bg-green-500 text-white" : ""}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ),
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default JobsPage;

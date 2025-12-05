import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "flowbite-react";
import { useSelector } from "react-redux";
import { TRootState } from "../../store/store";
import { TJob } from "../../types/job";
import EditJobModal from "../Jobs/EditJobForm";


export default function AdminJobsPage() {
  const user = useSelector((state: TRootState) => state.userSlice.user);
  const [jobs, setJobs] = useState<TJob[]>([]);
const [editingJobId, setEditingJobId] = useState<string | null>(null);

  
  
  const loadJobs = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:8181/api/jobs/", {
      headers: { "x-auth-token": token || "" },
    });
        console.log(res.data);
      
    setJobs(res.data);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <p className="mt-10 text-center text-xl text-red-600">
        רק אדמין יכול להיכנס לניהול משרות
      </p>
    );
  }

  const handleDelete = async (jobId: string) => {
    if (!window.confirm("את/ה בטוח/ה שברצונך למחוק את המשרה?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8181/api/jobs/${jobId}`, {
        headers: { "x-auth-token": token || "" },
      });
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      console.error("Failed to delete job", err);
    }
  };

  

  return (
    <div
      dir="rtl"
      className="min-h-screen p-6 dark:bg-gray-700 dark:text-white"
    >
      <h1 className="mb-6 text-center text-3xl font-bold">ניהול משרות</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {jobs.map((job: any) => (
          <Card key={job._id} className="text-right">
            <img
              src={job.image.url}
              alt={job.image.alt}
              className="rounded-lg"
            />
            <h3 className="mt-2 font-bold">{job.title}</h3>
            <p className="text-sm">{job.company}</p>
            <p className="text-sm">{job.address?.city}</p>
            <p className="text-sm">
              מגישים: {job.appliedByUserIds?.length || 0}
            </p>

            <div className="mt-4 flex justify-between">
              <div>
                <button onClick={() => setEditingJobId(job._id)}>✏️</button>
              </div>

              <div>
                <button onClick={() => handleDelete(job._id)}>🗑️</button>
              </div>
            </div>

            {editingJobId === job._id && (
              <EditJobModal
                job={job}
                onClose={() => setEditingJobId(null)}
                onSave={(updatedJob) => {
                  setJobs((prev) =>
                    prev.map((j) =>
                      j._id === updatedJob._id ? updatedJob : j,
                    ),
                  );
                  setEditingJobId(null);
                }}
              />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import axios from "axios";
import { TJob } from "../types/job";
import EditJobModal from "../pages/Jobs/EditJobForm";
import { toast } from "react-toastify";


interface JobCardProps {
  job: TJob;
  userRole: "user" | "employer" | "admin";
  userId: string | null;
  setJobs: React.Dispatch<React.SetStateAction<TJob[]>>;
  onUnlike?: (id: string) => void;
}

const JobCard = ({ job, userRole, userId, setJobs, onUnlike }: JobCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);



  const liked = userId ? job.likes?.includes(userId) : false;


  const handleApply = async () => {
  if (!cvFile) {
    toast.error("בחרי קובץ קורות חיים לפני השליחה");
    return;
    }
  
  const token = localStorage.getItem("token");
  try {
    const formData = new FormData();
    formData.append("cv", cvFile);
    

    await axios.post(
      `http://localhost:8181/api/jobs/${job._id}/apply`,
      formData,
      { headers: { "x-auth-token": token || "", "Content-Type": "multipart/form-data" } }
    );

    toast.success("המועמדות נשלחה בהצלחה!");
    setIsApplyModalOpen(false);
    setCvFile(null);
  } catch (err) {
    console.error("Failed to apply", err);
    toast.error("נכשל בשליחת המועמדות. נסה/י שוב מאוחר יותר.");
  }
};


  const toggleLike = async () => {
    if (!userId) return;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.patch(
        `http://localhost:8181/api/jobs/${job._id}/like`,
        {},
        { headers: { "x-auth-token": token || "" } },
      );
      setJobs((prev) => prev.map((j) => (j._id === job._id ? res.data : j)));
    const likeRemoved = !res.data.likes.includes(userId);
      if (likeRemoved && onUnlike) {
        onUnlike(job._id);
      }
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("את/ה בטוח/ה שברצונך למחוק את המשרה?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8181/api/jobs/${job._id}`, {
        headers: { "x-auth-token": token || "" },
      });
      setJobs((prev) => prev.filter((j) => j._id !== job._id));
    } catch (err) {
      console.error("Failed to delete job", err);
    }
  };

  return (
    <div className="flex h-[500px] flex-col justify-between rounded border bg-white/40 p-4 shadow transition hover:shadow-lg dark:border-gray-500 dark:bg-gray-600/80 dark:text-white">
      {/* תמונה */}
      {job.image?.url && (
        <img
          src={job.image.url}
          alt={job.image.alt}
          className="mb-2 h-32 w-full rounded object-contain"
        />
      )}

      {/* כותרות */}
      <div className="text-center">
        <h2 className="text-xl font-bold">{job.title}</h2>
        <h3 className="text-lg font-medium">{job.subtitle}</h3>
      </div>

      {/* תיאור עם "קרא עוד" */}
      <p className="mt-2 line-clamp-3 text-sm text-gray-700">
        {job.description}
      </p>

      <button
        className="mt-1 text-sm text-blue-500"
        onClick={() => setShowModal(true)}
      >
        קרא עוד
      </button>

      {/* שאר האלמנטים של הכרטיס נשארים מחוץ ל-div הזה */}
      <div className="mt-2 text-center text-sm text-gray-700 dark:text-gray-300">
        <p>חברה: {job.company}</p>
        {job.web && (
          <p>
            אתר:{" "}
            <a href={job.web} target="_blank" className="text-blue-500">
              {job.web}
            </a>
          </p>
        )}
        <p>
          כתובת: {job.address.city}, {job.address.street}
          {job.address.houseNumber}
        </p>
        <p>טלפון: {job.phone}</p>
        <p>דוא"ל: {job.email || "-"}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button onClick={toggleLike}>{liked ? "❤️" : "🤍"}</button>
        {(userRole === "admin" || job.user_id === userId) && (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(true)}>✏️</button>
          </div>
        )}
        {["admin"].includes(userRole) && (
          <div className="flex gap-2">
            <button onClick={handleDelete}>🗑️</button>
          </div>
        )}
        {userRole === "user" && (
          <button
            className="rounded bg-sky-300 px-3 py-1 text-white"
            onClick={() => setIsApplyModalOpen(true)}
          >
            הגש מועמדות
          </button>
        )}
      </div>

      {isEditing && (
        <EditJobModal
          job={job}
          onClose={() => setIsEditing(false)}
          onSave={(updatedJob) => {
            setJobs((prev) =>
              prev.map((j) => (j._id === updatedJob._id ? updatedJob : j)),
            );
            setIsEditing(false);
          }}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[80vh] w-full max-w-lg overflow-auto rounded border border-gray-300 bg-white/90 p-6 shadow-lg">
            <h2 className="mb-2 text-xl font-bold">{job.title}</h2>
            <p className="text-gray-700">{job.description}</p>
            <button
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
              onClick={() => setShowModal(false)}
            >
              סגור
            </button>
          </div>
        </div>
      )}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[80vh] w-full max-w-lg overflow-auto rounded border border-gray-300 bg-white/90 p-6 shadow-lg">
            <h2 className="mb-2 text-xl font-bold">
              הגש מועמדות ל-{job.title}
            </h2>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setCvFile(e.target.files?.[0] || null)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="rounded bg-blue-600 px-4 py-2 text-white"
                onClick={handleApply}
              >
                שלח
              </button>
              <button
                className="rounded bg-gray-300 px-4 py-2"
                onClick={() => setIsApplyModalOpen(false)}
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;

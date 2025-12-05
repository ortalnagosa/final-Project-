import { useEffect, useState } from "react";
import { TJob } from "../../types/job";
import { useSelector } from "react-redux";
import { TRootState } from "../../store/store";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, Pagination, Spinner } from "flowbite-react";
 import bgHome from "../../img/about.jpg";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { GrEdit } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";
import EditJobModal from "../Jobs/EditJobForm";




function MyJobsPage() {
    
  const [jobs, setJobs] = useState<TJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3;
  const [isEditing, setIsEditing] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<TJob | null>(null!);


 
    const searchWord = useSelector((state: TRootState) => state.searchSlice.searchWord);
    const user = useSelector((state: TRootState) => state.userSlice.user);
    
    const fetchMyJobs = async () => {
        try {
            const token = localStorage.getItem("token");
            axios.defaults.headers.common["x-auth-token"] = token;
            
            const { data } = await axios.get("http://localhost:8181/api/jobs/myJobs");
            console.log("DATA FROM SERVER:", data);

            setJobs(data.jobs);
        } catch (err) {
            console.error("שגיאה בטיענת המשרות", err);
            toast.error("שגיאה בטעינת המשרות, נסה שוב");
        } finally {
            setLoading(false);
        }
    };

        useEffect(() => {
        fetchMyJobs();
    }, []);

    const confirmDelete = (jobId: string) => {
        setJobToDelete(jobId);
        setIsDeleteModalOpen(true);
    };
    
    const handleDeleteConfirmed = async () => {
        if (!jobToDelete) return;

        try {
               const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8181/api/jobs/${jobToDelete}`,
        {
          headers: {
            "x-auth-token": token,
          },
        },
      );
    toast.success("המשרה נמחקה בהצלחה");
     fetchMyJobs();
    } catch (error) {
      toast.error("שגיאה במחיקת המשרה, נסה שוב");
      console.error("Delete error:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setJobToDelete(null);
    }
    };
    
     const filteredJobs = jobs.filter(
       (job) =>
         job.title.toLowerCase().includes(searchWord.toLowerCase()) ||
         job.subtitle?.toLowerCase().includes(searchWord.toLowerCase()),
    );
    

    const likeOrUnlikeJob = async (jobId: string) => {
      try {
        const token = localStorage.getItem("token");
        axios.defaults.headers.common["x-auth-token"] = token;

        await axios.patch(`http://localhost:8181/api/jobs/${jobId}/like`);

        const updatedJobs = [...jobs];
        const jobIndex = updatedJobs.findIndex((job) => job._id === jobId);

        if (jobIndex !== -1) {
          const job = updatedJobs[jobIndex];
          const isLiked = job.likes?.includes(user?._id + "");

          if (isLiked) {
            job.likes = job.likes?.filter((like) => like !== user?._id + "");
            toast.success("הלייק הוסר מהכרטיס");
          } else {
            job.likes = [...job.likes , user?._id + ""];
            toast.success("נוסף לייק לכרטיס");
          }

          updatedJobs[jobIndex] = job;
          setJobs(updatedJobs);
        }
      } catch (error) {
        console.error("שגיאה בלייק/אנלייק:", error);
        toast.error("שגיאה, נסי שוב");
      }
    };


  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
    <div>
        <Spinner size="xl" aria-label="Loading" />
        <p className="mt-4">טוען את המשרה...</p>
      </div>
    );
  }
    
    return (
      <>
        <div
          className="flex flex-col items-center justify-center bg-cover bg-center p-4 dark:bg-gray-800"
          style={{ backgroundImage: `url(${bgHome})` }}
        >
          <h1 className="mb-16 text-4xl font-bold  dark:text-white">
            המשרות שלי
          </h1>
          {loading && (
            <div className="my-10 flex justify-center">
              <Spinner size="xl" color="purple" />
            </div>
          )}

          {!loading && filteredJobs.length === 0 && (
            <div className="flex h-screen w-full items-center justify-center  dark:text-white">
              <p className="text-xl font-medium dark:text-white">
                לא נמצאו משרות שיצרת..
              </p>
            </div>
          )}

          <div className="grid w-full max-w-4xl grid-cols-1 gap-6 px-2 sm:px-0  md:grid-cols-2 lg:grid-cols-3">
            {currentJobs.map((job) => {
              const isLiked = job.likes?.includes(user?._id + "");
              return (
                <div
                  key={job?._id}
                  className="rounded-2xl border border-black bg-white/70 p-4 text-center shadow"
                >
                  <img
                    src={job.image?.url}
                    alt={job.image?.alt || "תמונה"}
                    className="mb-4 aspect-video w-full rounded object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/default.jpg";
                    }}
                  />
                  <h2 className="text-xl font-semibold">{job.title}</h2>
                  <p className="text-gray-600">{job.subtitle}</p>
                  <p className="mt-2 text-sm">{job.description}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    טלפון: {job.phone}
                  </p>
                  <p className="text-sm text-gray-500">אימייל: {job.email}</p>

                  <div className="mt-8 flex justify-center gap-5">
                    <GrEdit
                      onClick={() => {
                        setJobToEdit(job);
                        setIsEditing(true);
                      }}
                      className="size-7 cursor-pointer"
                    />

                    <RiDeleteBin6Line
                      color="failure"
                      onClick={() => confirmDelete(job._id!)}
                      className="size-7 cursor-pointer"
                    />
                    <FaHeart
                      className={`cursor-pointer text-2xl sm:text-3xl ${
                        isLiked ? "text-red-500" : "text-gray-500"
                      }`}
                      onClick={() => likeOrUnlikeJob(job._id)}
                    />
                  </div>
                  <Link
                    to={`/jobs/${job._id}/participants`}
                    className="cursor-pointer mt-4 inline-block text-brown-600 underline"
                  >
                    👥מועמדים למשרה 
                  </Link>
                </div>
              );
            })}
          </div>
          {isEditing && jobToEdit && (
            <EditJobModal
              job={jobToEdit}
              onClose={() => {
                setJobToEdit(null);
                setIsEditing(false);
              }}
              onSave={(updatedJob) => {
                setJobs((prev) =>
                  prev.map((j) => (j._id === updatedJob._id ? updatedJob : j)),
                );
                setJobToEdit(null);
                setIsEditing(false);
              }}
            />
          )}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                showIcons
              />
            </div>
          )}
        </div>
        <Modal
          show={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <Modal.Header>Deletion confirmation</Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete the job?</p>
          </Modal.Body>
          <Modal.Footer>
            <button
              onClick={handleDeleteConfirmed}
              className="rounded bg-red-600 px-4 py-2 text-white"
            >
              כן
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="rounded bg-gray-300 px-4 py-2"
            >
              לא
            </button>
          </Modal.Footer>
        </Modal>
      </>
    );
}

export default MyJobsPage;

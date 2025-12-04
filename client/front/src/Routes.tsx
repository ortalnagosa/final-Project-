import Home from "./pages/Home/Home";
import Login from "./pages/Login/LoginPage";
import Register from "./pages/RegisterPage/RegisterPage";
import Jobs from "./pages/Jobs/JobPage";
import Likes from "./pages/Likes/likePage";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import { userActions } from "./store/userSlice";
import About from "./pages/About/about";
import { Route, Routes } from "react-router-dom";
import Profile from "./pages/Profile/ProfilePage";
import GlobalSpinner from "./components/GlobalSpinner";
import { loadingActions } from "./store/loadingSlice";
import { TRootState } from "./store/store";
import MyJobsPage from "./pages/Employer/myJobsPage";
import CreateJobPage from "./pages/Jobs/createJob";
import ParticipantsPage from "./pages/Employer/ParticipantsPage";
import EmployerRequests from "./pages/Admin/EmployerRequests";
import AdminUsersPage from "./pages/Admin/AdminUsersPage";
import AdminJobsPage from "./pages/Admin/AdminJobsPage";

const AppRoutes = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(
    (state: TRootState) => state.loadingSlice.isLoading,
  );
  const [isUserReady, setIsUserReady] = useState(false);

  useEffect(() => {
    const initUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsUserReady(true);
        return;
      }

      dispatch(loadingActions.startLoading());
      axios.defaults.headers.common["x-auth-token"] = token;

      try {
        const parsedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = parsedToken._id;

        if (!userId) throw new Error("Invalid token");

        const { data } = await axios.get(
          `http://localhost:8181/api/users/${userId}`,
        );
        dispatch(userActions.login(data));
      } catch (err) {
        console.error("User fetch failed", err);
        localStorage.removeItem("token");
      } finally {
        dispatch(loadingActions.stopLoading());
        setIsUserReady(true);
      }
    };

    initUser();
  }, [dispatch]);

  if (!isUserReady || isLoading) {
    return <GlobalSpinner />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/favorites" element={<Likes />} />
      <Route path="/MyJobs" element={<MyJobsPage />} />
      <Route path="/create" element={<CreateJobPage />} />
      <Route path="/jobs/:jobId/participants" element={<ParticipantsPage />} />
      <Route path="/admin/employer-requests" element={<EmployerRequests />} />
      <Route path="/admin/users" element={<AdminUsersPage />} />
      <Route path="/admin/jobs" element={<AdminJobsPage />} />
    </Routes>
  );
};

export default AppRoutes;

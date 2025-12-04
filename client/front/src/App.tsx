import { useDispatch, useSelector } from "react-redux";
import Footer from "./components/Footer/Footer.tsx"
import AppNavbar from "./components/Navbar/Navbar.tsx"
import AppRoutes from "./Routes.tsx"
import { useEffect } from "react";
import { themeActions } from "./store/themeSlice";
import { TRootState } from "./store/store";
import { ToastContainer } from "react-toastify";



const App = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state: TRootState) => state.themeSlice.isDark);

  useEffect(() => {
    const savedTheme = localStorage.getItem("isDark");
    if (savedTheme !== null) {
      dispatch(themeActions.setDarkMode(JSON.parse(savedTheme)));
    }
  }, [dispatch]);

  return (
    <div
      className={isDark ? "text-white dark:bg-gray-900" : "bg-white text-black"}
    >
      <AppNavbar />

      <AppRoutes />

      <Footer />
      <ToastContainer />
    </div>
  );
};
export default App;

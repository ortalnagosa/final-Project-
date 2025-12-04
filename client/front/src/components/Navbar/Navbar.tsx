import {  Navbar,  NavbarBrand,  NavbarCollapse,  NavbarToggle,  TextInput,  Dropdown,  Avatar,  Button,  DarkThemeToggle,} from "flowbite-react";
import { MdSearch } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../../store/store";
import { userActions } from "../../store/userSlice";
import { searchActions } from "../../store/searchSlice";
import { loadingActions } from "../../store/loadingSlice";
import defaultProfile from "../../img/profile.jpg";


export default function AppNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: TRootState) => state.userSlice.user);
  const searchWord = useSelector(
    (state: TRootState) => state.searchSlice.searchWord,
  );

  const role = user?.role || null;
  const firstName = user?.name?.first || user?.firstName || "";



  const handleLogout = () => {
    dispatch(loadingActions.startLoading());
    dispatch(userActions.logout());
    localStorage.removeItem("token");
    dispatch(searchActions.setSearchWord(""));
    setTimeout(() => {
      dispatch(loadingActions.stopLoading());
      navigate("/");
    }, 800);
  };
  



  return (
    <Navbar fluid rounded className="w-full bg-white px-4 shadow-md">
      {/* Brand */}
      <NavbarBrand
        className="cursor-pointer"
        onClick={() => {
          dispatch(searchActions.setSearchWord(""));
          setTimeout(() => navigate("/"), 300);
        }}
      >
        <span className="text-2xl font-bold text-sky-700 hover:scale-95 dark:text-gray-200">
          Hachayalim
        </span>
      </NavbarBrand>

      {/* Right toggle */}
      <div className="flex items-center gap-2 ">
        <NavbarToggle />
      </div>

      {/* Search input */}
      <div className="hidden w-1/4 md:block ">
        <TextInput
          placeholder="חפש משרה..."
          rightIcon={MdSearch}
          value={searchWord}
          onChange={(e) =>
            dispatch(searchActions.setSearchWord(e.target.value))
          }
        />
      </div>

      <NavbarCollapse>
        <div className="mb-3 md:hidden">
          <TextInput
            placeholder="חפש משרה..."
            rightIcon={MdSearch}
            value={searchWord}
            onChange={(e) =>
              dispatch(searchActions.setSearchWord(e.target.value))
            }
          />
        </div>

        <div className="flex flex-col gap-4 text-lg font-light md:flex-row md:items-center md:gap-6">
          {/* קישורים בסיסיים */}
          <Link to="/" className="hover:scale-95 dark:text-gray-200">
            בית
          </Link>
          <Link to="/about" className="hover:scale-95 dark:text-gray-200">
            אודות
          </Link>
          <Link to="/jobs" className="hover:scale-95 dark:text-gray-200">
            משרות
          </Link>

          {/* למשתמש רגיל / לא מאושר */}
          {user && (role === "user" || role === "employer") && (
            <>
              <Link
                to="/favorites"
                className="hover:scale-95 dark:text-gray-200"
              >
                מועדפים
              </Link>

              <Link
                to="/profile"
                className="flex items-center  dark:text-gray-200"
              >
                פרופיל
              </Link>
            </>
          )}

          {/* אדמין */}
          {user && role === "admin" && (
            <div className="flex flex-col gap-4 text-sm font-light md:flex-row md:items-center md:gap-6">
              <Link to="/admin/users">ניהול משתמשים</Link>
              <Link to="/admin/jobs">ניהול משרות</Link>
              <Link to="/admin/employer-requests">ניהול מעסיקים</Link>
            </div>
          )}

          {/* פרופיל / התחברות */}
          {user ? (
            <Dropdown
              inline
              label={
                <Avatar
                  rounded
                  title={firstName || "User"}
                  img={user?.image?.url || defaultProfile}
                  className="h-12 w-12 bg-gradient-to-br from-slate-100 to-slate-300 p-1 shadow-lg transition hover:scale-105"
                />
              }
            >
              <Dropdown.Header>
                <span className="block truncate text-sm font-medium text-sky-300">
                  {firstName.toUpperCase()}
                </span>
              </Dropdown.Header>


              {user && (role === "admin" || role === "employer") && (
                <>
                  <Dropdown.Item>
                    <Link to="/MyJobs" className="flex items-center">
                       המשרות שלי
                    </Link>
                  </Dropdown.Item>

                  <Dropdown.Item>
                    <Link to="/create" className="flex items-center">
                       העלה משרה
                    </Link>
                  </Dropdown.Item>
                 
                </>
              )}
           
              {role === "admin" && (
              
                  <Dropdown.Item>
                    <Link to="/profile">פרופיל</Link>
                  </Dropdown.Item>
      
              )}

              <Dropdown.Item onClick={handleLogout}>התנתק</Dropdown.Item>
            </Dropdown>
          ) : (
            <>
              <Link to="/login">
                <Button size="sm" gradientDuoTone="cyanToBlue">
                  התחבר
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" outline>
                  הרשמה
                </Button>
              </Link>
            </>
          )}

          <DarkThemeToggle />
        </div>
      </NavbarCollapse>
    </Navbar>
  );
}

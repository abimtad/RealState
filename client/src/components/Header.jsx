import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const user = useSelector((state) => state.user.currentUser);
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="flex flex-wrap font-bold text-sm sm:text-xl ">
            <span className="text-slate-500">Abel</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form className="flex items-center rounded-lg bg-slate-100 p-4">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>

        <ul className="flex gap-4 items-center">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to={user ? "/profile" : "/sign-in"}>
            {user ? (
              <img
                src={user.avatar}
                alt="profile"
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-slate-700 hover:underline">Sign In</span>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

function Profile() {
  const inputRef = useRef();
  const [file, setfile] = useState();
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [showListingError, setShowListingError] = useState();
  const [userListings, setUserListings] = useState([]);
  const [expand, setExpand] = useState(false);
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    if (file.size > 2 * 1024 * 1024) {
      alert("File must be <2MB!");
      return;
    }

    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, `abel/avatars/${fileName}`);
    console.log(storageRef);
    console.log("under reff");
    const uploadTask = new uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (_) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl });
        });
      }
    );
  };

  // QUESTIONS: why you didnt use the traditional function declaration over this?

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    dispatch(deleteUserStart());

    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      console.log(res);
      const data = await res.json(res);
      console.log(data);
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      console.log("am in catch");
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async (e) => {
    e.preventDefault();
    dispatch(signOutUserStart());

    try {
      // NOTE: Browsers and proxies may cache or prefetch GET requests, which could log the user out unexpectedly.
      const res = await fetch("/api/auth/signOut", { method: "POST" });
      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowUserListing = async () => {
    setShowListingError(false);
    setExpand(!expand);

    try {
      const res = await fetch(`/api/listing/${currentUser._id}`);

      const data = await res.json(res);

      if (data.success === false) {
        setShowListingError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  };
  return (
    <div className="max-w-lg  mx-auto mt-32">
      <h1 className="font-semibold text-3xl text-center mb-8">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          ref={inputRef}
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => setfile(e.target.files[0])}
        />
        <img
          className="w-24 h-24 self-center rounded-full  my-6 object-cover cursor-pointer"
          src={formData.avatar || currentUser.avatar}
          alt="profile picture"
          onClick={() => inputRef.current.click()}
        />

        {/* TODO:   make it not glitch when the uploading a wrong file and reach 100%*/}
        <p className="text-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error while uploading! (File must be &lt;2MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">Uploading {filePerc}%</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">File upload completed!</span>
          ) : null}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-600 text-white p-3 text-center rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          to="/create-listing"
        >
          create listing
        </Link>
      </form>
      <div className="flex justify-between mt-3">
        <button className="text-red-400" onClick={handleDelete}>
          Delete Account
        </button>
        <button className="text-red-400" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700">
        {updateSuccess ? "Profile Updated successfully" : ""}
      </p>
      <button
        onClick={handleShowUserListing}
        className="text-green-700 w-full text-center mt-8"
      >
        Show listings
      </button>
      <p>{showListingError && "Error showing listing !"}</p>
      {console.log(userListings)}
      {userListings.length == 0 ? (
        <p className="text-center py-8 text-gray-500">
          No listings found. Create your first listing!
        </p>
      ) : expand ? (
        userListings.map((listing) => (
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-center mt-7">
              Your Listings
            </h1>
            <div
              key={listing._id}
              className="flex gap-4 p-4 border rounded-lg items-center"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </Link>
              <Link to={`/listing/${listing._id}`} className="flex-1">
                <p className="font-semibold hover:underline text-lg">
                  {listing.name}
                </p>
              </Link>
              <div className="flex flex-col gap-2">
                <button className="px-4 py-2 uppercase text-white bg-red-700 rounded hover:bg-red-800 transition">
                  Delete
                </button>
                <button className="px-4 py-2 uppercase text-black bg-yellow-300 rounded hover:bg-yellow-400 transition">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        ""
      )}
    </div>
  );
}

export default Profile;

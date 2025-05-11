import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

function Profile() {
  const inputRef = useRef();
  const [file, setfile] = useState();
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  console.log(file);

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
  const user = useSelector((state) => state.user.currentUser);

  return (
    <div className="max-w-lg  mx-auto mt-32">
      <h1 className="font-semibold text-3xl text-center mb-8">Profile</h1>
      <form action="" className="flex flex-col gap-5">
        <input
          ref={inputRef}
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => setfile(e.target.files[0])}
        />
        <img
          className="w-24 h-24 self-center rounded-full  my-6 object-cover cursor-pointer"
          src={formData.avatar || user.avatar}
          alt="profile picture"
          onClick={() => inputRef.current.click()}
        />
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
          className="border p-3 rounded-lg"
          id="username"
        />
        <input
          type="email"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          type="text"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
        <button className="bg-green-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          create listing
        </button>
      </form>
      <div className="flex justify-between mt-3">
        <span className="text-red-400">Delete Account</span>
        <span className="text-red-400">Sign Out</span>
      </div>
      <div className="text-blue-600 text-center mt-8">Show listings</div>
    </div>
  );
}

export default Profile;

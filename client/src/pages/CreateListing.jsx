import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";

function CreateListing() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "rent",
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
    imageUrls: [],
  });
  const [imageUploading, setImageUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadImageError, setUploadImageError] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

  console.log(formData);

  const handleImageUpload = () => {
    setUploadImageError(false);
    setImageUploading(true);
    const promises = [];

    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      console.log("valid file size");
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      console.log("loop run");
      // NOTE: a best example to see the use of finally in a promise.
      // NOTE: No matter the promises are fulfilled or not I can guaranty that the code will get executed.
      // NOTE: If it wasnt for finally since promise is async it will get executed before even the promise is settled.
      Promise.all(promises)
        .then((urls) => {
          console.log(urls);
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
        })
        .catch((error) => setUploadImageError(error.message))
        .finally(() => setImageUploading(false));
    } else {
      setImageUploading(false);
      console.log("present");
      setUploadImageError("Images must be 6 at most in number !");
    }
  };

  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, `abel/listing/${fileName}`);
      const uploadTask = new uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              resolve(url);
            })
            .catch((error) => reject(error));
        }
      );
    });
  };

  const handleDelete = (id) => {
    console.log("got in handleDelete");
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, Id) => Id !== id),
    });
    console.log("after delete: ", formData.imageUrls);
  };

  const handleChange = (e) => {
    if (e.target.id === "rent" || e.target.id === "sell") {
      setFormData({ ...formData, type: e.target.id });
    } else if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    } else if (
      e.target.type === "text" ||
      e.target.type === "textarea" ||
      e.target.type === "number"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.offer && formData.discountedPrice >= formData.regularPrice) {
      return setError("Discounted price must be less than regular price !");
    }

    if (formData.imageUrls.length < 1) {
      return setError("image field required !");
    }
    setLoading(true);
    setError(false);
    try {
      const response = await fetch("/api/listing/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = await response.json();

      if (data.success === false) {
        setError(data.message);
        return;
      }

      setLoading(false);
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <main className="max-w-4xl m-auto p-3">
      <h1 className="text-center font-semibold text-3xl my-8">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex flex-col gap-3">
            <input
              className="p-5 w-full border rounded-lg"
              placeholder="Name"
              minLength={10}
              maxLength={62}
              type="text"
              id="name"
              required
              onChange={handleChange}
            />
            <textarea
              className="p-5 w-full border rounded-lg"
              id="description"
              placeholder="Description"
              required
              type="text"
              onChange={handleChange}
            />
            <input
              className="p-5 w-full border rounded-lg"
              placeholder="Address"
              type="text"
              required
              id="address"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-wrap gap-4 my-5">
            <div className="flex gap-2">
              <input
                checked={formData.type === "sell"}
                type="checkbox"
                id="sell"
                className="w-16"
                onChange={handleChange}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                checked={formData.type === "rent"}
                type="checkbox"
                id="rent"
                className="w-16"
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                checked={formData.parking}
                type="checkbox"
                id="parking"
                className="w-16"
                onChange={handleChange}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                checked={formData.furnished}
                type="checkbox"
                id="furnished"
                className="text-2xl w-16"
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                checked={formData.offer}
                type="checkbox"
                id="offer"
                className="text-2xl w-16"
                onChange={handleChange}
              />
              <span>offer</span>
            </div>
          </div>
          <div className="flex gap-4 flex-wrap">
            <div className="flex gap-2">
              <input
                value={formData.bedrooms}
                type="number"
                id="bedrooms"
                className="text-2xl border border-gray-300"
                min={1}
                max={10}
                required
                onChange={handleChange}
              />
              <span>Beds</span>
            </div>
            <div className="flex gap-2">
              <input
                value={formData.bathrooms}
                type="number"
                id="bathrooms"
                className="border border-gray-300 text-2xl"
                min={1}
                max={10}
                required
                onChange={handleChange}
              />
              <span>Baths</span>
            </div>
            <div className="flex gap-2">
              <input
                value={formData.regularPrice}
                type="number"
                id="regularPrice"
                className="text-2xl border border-gray-300"
                min={1}
                max={60}
                required
                onChange={handleChange}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span>($/Month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex gap-2">
                <input
                  value={formData.discountedPrice}
                  type="number"
                  id="discountedPrice"
                  className="text-2xl border border-gray-300"
                  min={0}
                  max={10000000}
                  required
                  onChange={handleChange}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span>($/Month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 flex-col flex-1">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-600">
              The first Image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              id="images"
              accept="image/*"
              className="p-3 border border-gray-300 w-full rounded"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type="button"
              disabled={imageUploading}
              onClick={handleImageUpload}
              className={
                imageUploading
                  ? "opacity-50 cursor-wait"
                  : "border rounded border-green-700 text-green-700 p-3 uppercase hover:shadow-lg disabled:opacity-80"
              }
            >
              {imageUploading ? "uploading..." : "upload"}
            </button>
          </div>
          <p className="text-red-700 font-normal">
            {uploadImageError && uploadImageError}
          </p>
          <dv className="flex flex-col gap-4">
            {formData.imageUrls.map((url, idx) => (
              <div key={url} className="flex justify-between border p-4">
                <Link to={url}>
                  <img src={url} alt="listing image" className="w-20 h-20" />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  className="uppercase text-red-700 text-3xl p-3 hover:opacity-60"
                >
                  delete
                </button>
              </div>
            ))}
          </dv>
          <button
            disabled={loading || imageUploading}
            className="text-white bg-slate-700 p-4 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "create listing..." : "create listing"}
          </button>
          <p className="text-red-700">{error && error}</p>
        </div>
      </form>
    </main>
  );
}

export default CreateListing;

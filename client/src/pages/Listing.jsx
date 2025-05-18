import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

function Listing() {
  SwiperCore.use(Navigation);
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(false);
  const params = useParams();
  const [loading, setLoading] = useState();
  const [copied, setCopied] = useState();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [contact, setContact] = useState(null);

  // QUESTIONS: If there is a string rendered conditionally I think it
  // is treated as some kinda of component by the browser?

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/listing/get/${params.id}`);

        const data = await response.json();

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }

        setListing(data);
        console.log(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, []);

  if (loading) {
    return <p className="mt-7 text-center  text-3xl">Loading...</p>;
  }

  if (error)
    return (
      <p className="mt-7 text-center  text-red-700 text-3xl">
        Something went wrong !
      </p>
    );

  return (
    <main>
      {listing && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}

          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountedPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full w-[180px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="text-white w-full w-[180px] bg-green-700 max-w-[200px] text-center p-1 rounded-md">
                  ${listing.regularPrice - listing.discountedPrice} discount
                </p>
              )}
            </div>
            <p>
              <span className="font-semibold">Description - </span>
              {listing.description}
            </p>
            <ul className="flex gap-5 items-center flex-wrap text-green-600 text-sm">
              <li className="flex gap-1 items-center justify-center">
                <FaBed /> {listing.bedrooms > 1 ? "Beds" : "Bed"}
              </li>
              <li className="flex gap-1 items-center justify-center">
                <FaBath /> {listing.bedrooms > 1 ? "Baths" : "Bath"}
              </li>
              <li className="flex gap-1 items-center justify-center">
                <FaParking />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex gap-1 items-center justify-center">
                <FaChair />
                {listing.furnished ? "Furnished" : "Not Furnished"}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                className="bg-slate-700 uppercase upper w-full text-white p-4 rounded-md hover:opacity-85"
                onClick={() => setContact(true)}
              >
                contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}

export default Listing;

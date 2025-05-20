import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

function ListingItem({ listing }) {
  console.log(listing);
  function checkUrl(str) {
    try {
      // Add https:// prefix if missing to validate domains like "example.com"
      const urlStr = str.includes("://") ? str : `https://${str}`;
      const url = new URL(urlStr);

      // Basic validation (optional - customize as needed)
      if (!url.hostname.includes(".")) return false; // Reject single-word domains
      if (!["http:", "https:"].includes(url.protocol)) return false; // Allow only HTTP/HTTPS

      return url; // Return the URL object
    } catch (err) {
      return false;
    }
  }
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            checkUrl(listing.imageUrls[0]) ||
            "https://metropolitanaddis.com/wp-content/uploads/2018/02/Fotolia_6901293_Subscription_Yearly_M_PLUS.jpg"
          }
          alt="listing cover"
          className="w-full object-cover hover:scale-105 transition-scale duration-300"
        />
      </Link>
      <div className="p-3 flex flex-col gap-2">
        <p className="truncate text-lg font-semibold text-slate-700">
          {listing.name}
        </p>
        <div className="flex items-center gap-1">
          <MdLocationOn className="h-4 w-4 text-green-700" />
          <p className="text-sm text-gray-600 truncate w-full">
            {listing.address}
          </p>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">
          {listing.description}
        </p>
        <p className="text-slate-500 mt-2 font-semibold ">
          $
          {listing.offer
            ? listing.discountedPrice.toLocaleString("en-US")
            : listing.regularPrice.toLocaleString("en-US")}
          {listing.type === "rent" && " / month"}
        </p>
        <div className="text-slate-700 flex gap-4">
          <div className="font-bold text-xs">
            {console.log("bedrooms: ", listing.bathrooms)}
            {listing.bedrooms > 1
              ? `${listing.bedrooms} beds `
              : `${listing.bedrooms} bed `}
          </div>
          <div className="font-bold text-xs">
            {listing.bathrooms > 1
              ? `${listing.bathrooms} baths `
              : `${listing.bathrooms} bath `}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingItem;

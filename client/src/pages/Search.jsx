import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

function Search() {
  const navigate = useNavigate();
  const [showMoreListing, setShowMoreListing] = useState(false);
  const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    offer: false,
    parking: false,
    furnished: false,
    sort: "createdAt",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);

  console.log("listings:", listings);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setSideBarData({
      ...sideBarData,
      searchTerm: searchParams.get("searchTerm") || "",
      type: searchParams.get("type") || "all",
      offer: searchParams.get("offer") === "true" ? true : false,
      parking: searchParams.get("parking") === "true" ? true : false,
      furnished: searchParams.get("furnished") === "true" ? true : false,
      sort: searchParams.get("sort") || "createdAt",
      order: searchParams.get("order") || "desc",
    });

    const fetchListing = async () => {
      try {
        setLoading(true);
        setShowMoreListing(false);
        const searchQuery = searchParams.toString();
        const res = await fetch(`api/listing?${searchQuery}`);

        const data = await res.json();

        if (data.success === false) {
          console.log(data.message);
          setLoading(false);
          return;
        }

        setLoading(false);
        setListings(data);
        if (data.length > 8) {
          setShowMoreListing(true);
        } else {
          setShowMoreListing(false);
        }
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };

    fetchListing();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    // Handle type (radio button behavior)
    if (id === "all" || id === "sell" || id === "rent") {
      setSideBarData({ ...sideBarData, type: id });
    }
    // Handle checkboxes
    else if (id === "parking" || id === "furnished" || id === "offer") {
      setSideBarData({ ...sideBarData, [id]: checked });
    }
    // Handle sort order
    else if (id === "sort_order") {
      const [sort, order] = value.split("_");
      setSideBarData({ ...sideBarData, sort, order });
    }
    // Handle name input
    else if (id === "searchTerm") {
      setSideBarData({ ...sideBarData, searchTerm: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchQuery = new URLSearchParams(sideBarData).toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreListing = async () => {
    const startIndex = listings.length;
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("startIndex", startIndex);
    searchParams.toString();

    try {
      const res = await fetch(`/api/listing?${searchParams}`);
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
      }

      if (data.length < 9) {
        setShowMoreListing(false);
      }
      setListings([...listings, ...data]);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <main className="">
      <div className="flex flex-col gap-4 md:flex-row p-3 ">
        <div className="border-b-4 md:border-r-4 md:min-h-screen p-3">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="flex gap-3 items-center">
              <label className="font-semibold whitespace-nowrap">
                Search Term:{" "}
              </label>
              <input
                id="searchTerm"
                type="text"
                value={sideBarData.searchTerm}
                className="rounded-lg p-3 w-full"
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="font-semibold">Type: </label>
              <div className="flex gap-2">
                <span>Sell & Rent</span>
                <input
                  id="all"
                  onChange={handleChange}
                  className="w-4"
                  type="checkbox"
                  checked={sideBarData.type === "all"}
                />
              </div>
              <div className="flex gap-2">
                <span>Sell</span>
                <input
                  id="sell"
                  checked={sideBarData.type === "sell"}
                  onChange={handleChange}
                  className="w-4"
                  type="checkbox"
                />
              </div>
              <div className="flex gap-2">
                <span>Rent</span>
                <input
                  id="rent"
                  onChange={handleChange}
                  checked={sideBarData.type === "rent"}
                  className="w-4 rent"
                  type="checkbox"
                />
              </div>
              <div className="flex gap-2">
                <span>Offer</span>
                <input
                  id="offer"
                  onChange={handleChange}
                  checked={sideBarData.offer}
                  className="w-4"
                  type="checkbox"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="font-semibold">Amenities: </label>
              <div className="flex gap-2">
                <span>Parking</span>
                <input
                  id="parking"
                  onChange={handleChange}
                  checked={sideBarData.parking}
                  className="w-4"
                  type="checkbox"
                />
              </div>
              <div className="flex gap-2">
                <span>Furnished</span>
                <input
                  id="furnished"
                  onChange={handleChange}
                  checked={sideBarData.furnished}
                  className="w-4"
                  type="checkbox"
                />
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <label className="font-semibold">Sort:</label>
              <select
                defaultValue="createdAt_desc"
                id="sort_order"
                onChange={handleChange}
                value={sideBarData.sort + "_" + sideBarData.order}
              >
                <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to high</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </div>
            <button className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-85">
              Submit
            </button>
          </form>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <h1 className="font-semibold text-3xl">Listing Results :</h1>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {!loading && listings.length === 0 && (
              <p className="col-span-3 text-center text-gray-600 text-2xl w-full font-normal">
                No listings found !
              </p>
            )}

            {loading && listings.length == 0 && (
              <p className="col-span-3 text-center text-gray-600 text-2xl w-full font-normal">
                Loading...
              </p>
            )}

            {!loading &&
              listings.length > 0 &&
              listings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            {showMoreListing && (
              <button
                onClick={() => onShowMoreListing()}
                className="sm:col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-3 w-full hover:underline text-green-700 "
              >
                Show More
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Search;

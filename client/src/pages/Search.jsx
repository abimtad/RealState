import React from "react";

function Search() {
  return (
    <main className="">
      <div className="flex flex-col gap-4 md:flex-row p-3 ">
        <div className="border-b-4 md:border-r-4 md:min-h-screen p-3">
          <form className="flex flex-col gap-8">
            <div className="flex gap-3 items-center">
              <label className="whitespace-nowrap">Search Term: </label>
              <input
                id="search"
                type="text"
                className="rounded-lg p-3 w-full"
              />
            </div>

            <div className="flex flex-row gap-4">
              <label>Type: </label>
              <div className="flex gap-2">
                <span>Sell & Rent</span>
                <input className="w-4" type="checkbox" />
              </div>
              <div className="flex gap-2">
                <span>Sell</span>
                <input className="w-4" type="checkbox" />
              </div>
              <div className="flex gap-2">
                <span>Rent</span>
                <input className="w-4" type="checkbox" />
              </div>
              <div className="flex gap-2">
                <span>Offer</span>
                <input className="w-4" type="checkbox" />
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <label>Amenities: </label>
              <div className="flex gap-2">
                <span>Parking</span>
                <input className="w-4" type="checkbox" />
              </div>
              <div className="flex gap-2">
                <span>Furnished</span>
                <input className="w-4" type="checkbox" />
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <label>Sort:</label>
              <select id="sort_order" className="p-3 rounded-lg">
                <option value="">Price high to low</option>
                <option value="">Price low to high</option>
                <option value="">Latest</option>
                <option value="">Oldest</option>
              </select>
            </div>
            <button className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-85">
              Submit
            </button>
          </form>
        </div>
        <div className="col-span-2">
          <h1 className="font-semibold text-3xl">Listing Results :</h1>
          <div className="grid grid-cols-3"></div>
        </div>
      </div>
    </main>
  );
}

export default Search;

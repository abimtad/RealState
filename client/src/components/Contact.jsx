import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Contact({ listing }) {
  const [landlord, setLandlord] = useState();
  const [message, setMessage] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/get/${listing.userRef}`);

        const data = await res.json();

        if (data.success === false) {
          console.log(data.message);
          return;
        }

        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [listing.userRef]);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    landlord && (
      <div className="flex flex-col gap-3">
        <p>
          Contact <span className="font-semibold">{landlord.username}</span> for{" "}
          <span className="font-semibold">{listing.name.toLowerCase()}</span>
        </p>
        <textarea
          row="2"
          name="message"
          id="message"
          className="w-full border p-3 rounded-lg"
          value={message}
          onChange={handleChange}
          placeholder="Enter your message here..."
        ></textarea>
        <Link
          to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
        >
          Send Message
        </Link>
      </div>
    )
  );
}

export default Contact;

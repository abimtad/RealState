import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();
  return (
    <div className="mt-5 py-16 px-6 max-w-6xl mx-auto bg-gradient-to-b from-white to-slate-50 rounded-3xl shadow-lg">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-slate-800">
          Welcome to <span className="text-slate-500">Abel Estate</span>
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-slate-300 mx-auto mb-8"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-3 text-slate-800">
              Your Dream, Our Blueprint
            </h2>
            <p className="text-slate-600 leading-relaxed">
              At Abel Estate, we don't just sell properties - we craft futures.
              With a passionate team of local experts, we transform the complex
              journey of buying or selling into an inspiring adventure. Our
              boutique approach means every client receives white-glove service
              tailored to their unique story.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-3 text-slate-800">
              Market Masters
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We eat, sleep, and breathe real estate. Our proprietary market
              insights and negotiation strategies consistently deliver
              exceptional results. Whether it's a cozy starter home or a luxury
              penthouse, we navigate the market's tides to anchor you in your
              perfect harbor.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-3 text-slate-800">
              The Abel Difference
            </h2>
            <p className="text-slate-600 leading-relaxed">
              What sets us apart? Heart. We measure success not just in
              transactions closed, but in lives enriched. Our clients become
              family, and we celebrate every milestone together. From first-time
              buyers to seasoned investors, we're your trusted guides through
              every market condition.
            </p>
          </div>

          <div className="p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500">
            <h2 className="text-2xl font-semibold mb-3 text-blue-700">
              Our Promise to You
            </h2>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Transparent communication at every step</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Cutting-edge market analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Creative problem-solving</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">✓</span>
                <span>Unwavering advocacy for your interests</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <button
          onClick={() => navigate("/search")}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-slate-700 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Discover Your Perfect Property
        </button>
      </div>
    </div>
  );
}

export default About;

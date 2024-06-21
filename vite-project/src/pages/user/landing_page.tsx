import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div>
      <p>Landing Page</p>
      <Link className="underline" to={"/dashboard"}>
        Go to Dashboard
      </Link>
    </div>
  );
};

export default LandingPage;

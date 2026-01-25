import { Link } from "react-router-dom";
import "./NotFound.scss";
import { Home } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="go-home-div">
        <Link className="flex items-center gap-1" to="/"><Home/> Go Home</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

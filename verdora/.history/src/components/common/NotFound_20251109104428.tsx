import React from "react";
import { useNavigate } from "react-router-dom";
// import { Helmet } from "react-helmet";
import "../../styles/global.css";
import "./NotFound.css";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* <Helmet>
        <title>404 | Verdora</title>
      </Helmet> */}

      <div
        className="d-flex justify-content-center align-items-center vh-100 bg-white text-dark notfound-container"
        style={{ fontFamily: "var(--font-family-form)", background: "#ffff" }}
      >
        <div className="d-flex flex-column flex-md-row align-items-center gap-5 px-3 fade-in">
          <h1
            className="display-1 fw-bold text-secondary mb-0 float-404"
            style={{ opacity: 0.5, fontSize: "12rem", lineHeight: 1 }}
          >
            404
          </h1>

          <div className="text-center text-md-start slide-up">
            <h2
              className="fw-bold mb-3"
              style={{ color: "var(--color-green-darkest)" }}
            >
              Oops! You’re Lost in Verdora
            </h2>
            <p
              className="text-muted mb-4"
              style={{ color: "var(--color-green-darkest)" }}
            >
              The page you’re looking for doesn’t exist or may have been moved.
            </p>

            <button
              className="btn btn-dark px-4 py-2 rounded-pill"
              style={{ backgroundColor: "var(--color-green-darkest)" }}
              onClick={() => navigate("/home")}
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;

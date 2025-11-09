import { RiLogoutCircleLine } from "react-icons/ri";
import { Link } from "react-router-dom";

export default function Todashboard() {
  const userEmail = localStorage.getItem("userEmail");
  const adminEmail = "admin@gmail.com";

  if (userEmail !== adminEmail) return null;

  return (
    <>
      <Link to="/admin" style={{ textDecoration: "none" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            width: "100%",
            marginTop: "30px",
            marginLeft: "10px",
            cursor: "pointer",
            color: "var(--color-green-darkest)",
          }}
        >
          <div className="d-flex gap-2">
            <RiLogoutCircleLine size={24} />
            <p
              style={{
                color: "var(--color-green-darkest)",
                fontFamily: " var(--font-family-serif)",
              }}
            >
              Go to Dashboard
            </p>
          </div>
        </div>
      </Link>
    </>
  );
}

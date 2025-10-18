import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

const User: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>("http://localhost:5000/users");
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="mt-4">
      <h4 className="text-center text-muted mb-4">
        All Users ({users.length})
      </h4>

      {loading ? (
        <p className="text-center text-muted">Loading users...</p>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : users.length === 0 ? (
        <p className="text-center text-muted">No users found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped text-center">
            <thead className="table-success">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td
                    className={
                      user.role === "admin"
                        ? "fw-bold text-success"
                        : "text-muted"
                    }
                  >
                    {user.role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default User;

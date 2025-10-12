import React, { useState, useEffect } from "react";
import { IoCallOutline, IoSaveOutline } from "react-icons/io5";
import { MdEdit, MdCancel } from "react-icons/md";
import { FaRegAddressCard } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import "./Profile.css";

interface UserData {
  id: number;
  address: string;
  name: {
    Name: string;
  };
  phone: string;
}

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    Name: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    const savedImage = localStorage.getItem("profileImage");

    if (savedImage) setProfileImage(savedImage);

    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUserData(parsed);
      setFormData({
        Name: parsed.name?.Name || "",
        address: parsed.address || "",
        phone: parsed.phone || "",
      });
      setLoading(false);
    } else {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId") || "1";
      const response = await fetch(`https://fakestoreapi.com/users/${userId}`);

      if (!response.ok) throw new Error("Failed to fetch user data");

      const data: UserData = await response.json();
      setUserData(data);
      setFormData({
        Name: data.name.Name,
        address: data.address,
        phone: data.phone,
      });
    } catch (err) {
      setError("Failed to load user data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfileImage(base64);
        localStorage.setItem("profileImage", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (userData) {
      setFormData({
        Name: userData.name.Name,
        address: userData.address,
        phone: userData.phone,
      });
    }
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSaving(true);
      const userId = localStorage.getItem("userId") || "1";

      const updateData = {
        address: formData.address,
        name: { Name: formData.Name },
        phone: formData.phone,
      };

      const response = await fetch(`https://fakestoreapi.com/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      // تحديث البيانات في localStorage بدون أي معلومات حساسة
      const newUserData = {
        id: userId,
        name: { Name: formData.Name },
        address: formData.address,
        phone: formData.phone,
        profileImage: profileImage || "",
      };

      setUserData(newUserData);
      localStorage.setItem("userData", JSON.stringify(newUserData));
      localStorage.setItem("userName", formData.Name); // لتحديث الاسم في النافبار

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="avatar-image" />
            ) : (
              <div className="avatar-placeholder">+</div>
            )}

            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="upload-input"
              />
            )}
          </div>
          <h2>{userData?.name.Name}</h2>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="Name">
              <MdOutlineDriveFileRenameOutline /> Name
            </label>
            <input
              type="text"
              id="Name"
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">
              <FaRegAddressCard /> Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              <IoCallOutline /> Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-actions">
            {!isEditing ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleEdit}
              >
                <MdEdit size={20} /> Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  <MdCancel size={20} /> Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  {saving ? (
                    "Saving..."
                  ) : (
                    <>
                      <IoSaveOutline size={20} /> Save
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;

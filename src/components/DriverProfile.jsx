import { useEffect, useState } from "react";
console.log("API URL:", import.meta.env.VITE_API_URL);

function DriverProfile() {
  const [profile, setProfile] = useState(null);
  const [userId, setUserId] = useState(null);

  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [drivingExperience, setDrivingExperience] = useState("");

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedUser = localStorage.getItem("drivexUser");

        if (!savedUser) {
          throw new Error("User session not found");
        }

        const user = JSON.parse(savedUser);
        setUserId(user.id);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/driver/profile/${user.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load driver profile"
          );
        }

        const loadedProfile = data.profile;

        setProfile(loadedProfile);

        setPhone(loadedProfile.phone || "");

        setDateOfBirth(
          loadedProfile.dateOfBirth
            ? loadedProfile.dateOfBirth.split("T")[0]
            : ""
        );

        setLicenseNumber(
          loadedProfile.licenseNumber || ""
        );

        setDrivingExperience(
          loadedProfile.drivingExperience ?? ""
        );
      } catch (error) {
        console.error(
          "Load driver profile error:",
          error
        );

        setError(
          error.message ||
            "Failed to load driver profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleEdit = () => {
    setSuccess("");
    setError("");
    setEditing(true);
  };

  const handleCancel = () => {
    if (profile) {
      setPhone(profile.phone || "");

      setDateOfBirth(
        profile.dateOfBirth
          ? profile.dateOfBirth.split("T")[0]
          : ""
      );

      setLicenseNumber(
        profile.licenseNumber || ""
      );

      setDrivingExperience(
        profile.drivingExperience ?? ""
      );
    }

    setError("");
    setSuccess("");
    setEditing(false);
  };

  const handleSave = async () => {
    if (!userId) {
      setError("User session not found");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/driver/profile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            dateOfBirth: dateOfBirth || null,
            licenseNumber,
            drivingExperience:
              drivingExperience === ""
                ? 0
                : Number(drivingExperience),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update driver profile"
        );
      }

      setProfile(data.profile);

      setSuccess(
        "Profile updated successfully."
      );

      setEditing(false);
    } catch (error) {
      console.error(
        "Save driver profile error:",
        error
      );

      setError(
        error.message ||
          "Failed to save driver profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="dashboard-section">
        <h2>👤 Driver Profile</h2>
        <p>Loading profile...</p>
      </section>
    );
  }

  if (error && !profile) {
    return (
      <section className="dashboard-section">
        <h2>👤 Driver Profile</h2>
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className="dashboard-section driver-profile-section">
      <div className="profile-header">
        <div>
          <h2>👤 Driver Profile</h2>
          <p>
            Your personal driving information
          </p>
        </div>

        {!editing && (
          <button
            type="button"
            className="profile-edit-button"
            onClick={handleEdit}
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      <div className="profile-card">
        {!editing ? (
          <>
            <div className="profile-info">
              <span>Phone Number</span>
              <strong>
                {profile.phone ||
                  "Not provided"}
              </strong>
            </div>

            <div className="profile-info">
              <span>Date of Birth</span>
              <strong>
                {profile.dateOfBirth
                  ? new Date(
                      profile.dateOfBirth
                    ).toLocaleDateString()
                  : "Not provided"}
              </strong>
            </div>

            <div className="profile-info">
              <span>License Number</span>
              <strong>
                {profile.licenseNumber ||
                  "Not provided"}
              </strong>
            </div>

            <div className="profile-info">
              <span>Driving Experience</span>
              <strong>
                {profile.drivingExperience}{" "}
                years
              </strong>
            </div>
          </>
        ) : (
          <>
            <div className="profile-field">
              <label>Phone Number</label>

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="Enter phone number"
              />
            </div>

            <div className="profile-field">
              <label>Date of Birth</label>

              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) =>
                  setDateOfBirth(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="profile-field">
              <label>License Number</label>

              <input
                type="text"
                value={licenseNumber}
                onChange={(e) =>
                  setLicenseNumber(
                    e.target.value
                  )
                }
                placeholder="Enter license number"
              />
            </div>

            <div className="profile-field">
              <label>
                Driving Experience (years)
              </label>

              <input
                type="number"
                min="0"
                value={drivingExperience}
                onChange={(e) =>
                  setDrivingExperience(
                    e.target.value
                  )
                }
                placeholder="Enter years"
              />
            </div>

            {error && (
              <p className="profile-error">
                {error}
              </p>
            )}

            <div className="profile-actions">
              <button
                type="button"
                className="profile-cancel-button"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="profile-save-button"
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </>
        )}
      </div>

      {!editing && success && (
        <p className="profile-success">
          ✓ {success}
        </p>
      )}
    </section>
  );
}

export default DriverProfile;
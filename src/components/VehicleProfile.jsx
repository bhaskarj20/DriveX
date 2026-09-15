import { useEffect, useState } from "react";

function VehicleProfile() {
  const [vehicle, setVehicle] = useState(null);

  const [formData, setFormData] = useState({
    vehicleNumber: "",
    make: "",
    model: "",
    year: "",
    fuelType: "PETROL",
  });

  const [driverProfileId, setDriverProfileId] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const savedUser =
          localStorage.getItem("drivexUser");

        if (!savedUser) {
          throw new Error(
            "User session not found"
          );
        }

        const user = JSON.parse(savedUser);

        // First get the driver's profile
        const profileResponse = await fetch(
          `${API_URL}/api/driver/profile/${user.id}`
        );

        const profileData =
          await profileResponse.json();

        if (!profileResponse.ok) {
          throw new Error(
            profileData.message ||
              "Failed to load driver profile"
          );
        }

        const profileId =
          profileData.profile._id;

        setDriverProfileId(profileId);

        // Then get the vehicle
        const vehicleResponse = await fetch(
          `${API_URL}/api/vehicle/${profileId}`
        );

        const vehicleData =
          await vehicleResponse.json();

        // No vehicle yet — show creation form
        if (vehicleResponse.status === 404) {
          setVehicle(null);
          setCreating(true);
          return;
        }

        if (!vehicleResponse.ok) {
          throw new Error(
            vehicleData.message ||
              "Failed to load vehicle"
          );
        }

        setVehicle(vehicleData.vehicle);

        setFormData({
          vehicleNumber:
            vehicleData.vehicle.vehicleNumber ||
            "",
          make:
            vehicleData.vehicle.make || "",
          model:
            vehicleData.vehicle.model || "",
          year:
            vehicleData.vehicle.year || "",
          fuelType:
            vehicleData.vehicle.fuelType ||
            "PETROL",
        });
      } catch (error) {
        console.error(
          "Load vehicle error:",
          error
        );

        setError(
          error.message ||
            "Failed to load vehicle"
        );
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [API_URL]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setSuccess("");
    setError("");

    setFormData({
      vehicleNumber:
        vehicle.vehicleNumber || "",
      make: vehicle.make || "",
      model: vehicle.model || "",
      year: vehicle.year || "",
      fuelType:
        vehicle.fuelType || "PETROL",
    });

    setEditing(true);
  };

  const handleCancel = () => {
    if (vehicle) {
      setFormData({
        vehicleNumber:
          vehicle.vehicleNumber || "",
        make: vehicle.make || "",
        model: vehicle.model || "",
        year: vehicle.year || "",
        fuelType:
          vehicle.fuelType || "PETROL",
      });
    } else {
      setFormData({
        vehicleNumber: "",
        make: "",
        model: "",
        year: "",
        fuelType: "PETROL",
      });
    }

    setError("");
    setSuccess("");

    if (vehicle) {
      setEditing(false);
    } else {
      setCreating(true);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/vehicle/${vehicle._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vehicleNumber:
              formData.vehicleNumber,
            make: formData.make,
            model: formData.model,
            year: Number(formData.year),
            fuelType: formData.fuelType,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update vehicle"
        );
      }

      setVehicle(data.vehicle);

      setFormData({
        vehicleNumber:
          data.vehicle.vehicleNumber || "",
        make: data.vehicle.make || "",
        model: data.vehicle.model || "",
        year: data.vehicle.year || "",
        fuelType:
          data.vehicle.fuelType || "PETROL",
      });

      setEditing(false);

      setSuccess(
        "Vehicle details updated successfully"
      );
    } catch (error) {
      console.error(
        "Update vehicle error:",
        error
      );

      setError(
        error.message ||
          "Failed to update vehicle"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!driverProfileId) {
        throw new Error(
          "Driver profile not found"
        );
      }

      const response = await fetch(
        `${API_URL}/api/vehicle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            driverProfileId,
            vehicleNumber:
              formData.vehicleNumber,
            make: formData.make,
            model: formData.model,
            year: Number(formData.year),
            fuelType: formData.fuelType,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create vehicle"
        );
      }

      setVehicle(data.vehicle);

      setFormData({
        vehicleNumber:
          data.vehicle.vehicleNumber || "",
        make: data.vehicle.make || "",
        model: data.vehicle.model || "",
        year: data.vehicle.year || "",
        fuelType:
          data.vehicle.fuelType || "PETROL",
      });

      setCreating(false);

      setSuccess(
        "Vehicle added successfully"
      );
    } catch (error) {
      console.error(
        "Create vehicle error:",
        error
      );

      setError(
        error.message ||
          "Failed to create vehicle"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="dashboard-section">
        <h2>🚗 Vehicle</h2>
        <p>Loading vehicle...</p>
      </section>
    );
  }

  if (error && !vehicle && !creating) {
    return (
      <section className="dashboard-section">
        <h2>🚗 Vehicle</h2>
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <div className="profile-header">
        <h2>🚗 Vehicle</h2>

        {vehicle && !editing && (
          <button
            className="profile-edit-button"
            onClick={handleEdit}
          >
            ✏️ Edit Vehicle
          </button>
        )}
      </div>

      {success && (
        <p className="profile-success">
          {success}
        </p>
      )}

      {error && (
        <p className="profile-error">
          {error}
        </p>
      )}

      {creating ? (
        <form
          className="profile-card"
          onSubmit={handleCreate}
        >
          <div className="profile-info">
            <span>Vehicle Number</span>

            <input
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              required
              placeholder="e.g. WB01AB1234"
            />
          </div>

          <div className="profile-info">
            <span>Make</span>

            <input
              name="make"
              value={formData.make}
              onChange={handleChange}
              required
              placeholder="e.g. Tata"
            />
          </div>

          <div className="profile-info">
            <span>Model</span>

            <input
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              placeholder="e.g. Nexon"
            />
          </div>

          <div className="profile-info">
            <span>Year</span>

            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              placeholder="e.g. 2024"
            />
          </div>

          <div className="profile-info">
            <span>Fuel Type</span>

            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
            >
              <option value="PETROL">
                Petrol
              </option>

              <option value="DIESEL">
                Diesel
              </option>

              <option value="ELECTRIC">
                Electric
              </option>

              <option value="HYBRID">
                Hybrid
              </option>
            </select>
          </div>

          <div className="profile-actions">
            <button
              type="submit"
              className="profile-save-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Add Vehicle"}
            </button>
          </div>
        </form>
      ) : editing ? (
        <form
          className="profile-card"
          onSubmit={handleSave}
        >
          <div className="profile-info">
            <span>Vehicle Number</span>

            <input
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="profile-info">
            <span>Make</span>

            <input
              name="make"
              value={formData.make}
              onChange={handleChange}
              required
            />
          </div>

          <div className="profile-info">
            <span>Model</span>

            <input
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </div>

          <div className="profile-info">
            <span>Year</span>

            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </div>

          <div className="profile-info">
            <span>Fuel Type</span>

            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
            >
              <option value="PETROL">
                Petrol
              </option>

              <option value="DIESEL">
                Diesel
              </option>

              <option value="ELECTRIC">
                Electric
              </option>

              <option value="HYBRID">
                Hybrid
              </option>
            </select>
          </div>

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
              type="submit"
              className="profile-save-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-card">
          <div className="profile-info">
            <span>Vehicle Number</span>
            <strong>
              {vehicle.vehicleNumber}
            </strong>
          </div>

          <div className="profile-info">
            <span>Make</span>
            <strong>{vehicle.make}</strong>
          </div>

          <div className="profile-info">
            <span>Model</span>
            <strong>{vehicle.model}</strong>
          </div>

          <div className="profile-info">
            <span>Year</span>
            <strong>{vehicle.year}</strong>
          </div>

          <div className="profile-info">
            <span>Fuel Type</span>
            <strong>{vehicle.fuelType}</strong>
          </div>
        </div>
      )}
    </section>
  );
}

export default VehicleProfile;
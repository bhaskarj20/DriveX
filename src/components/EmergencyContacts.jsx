import { useEffect, useState } from "react";

import ContactCard from "./ContactCard";

function EmergencyContacts() {
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");

  const [driverProfileId, setDriverProfileId] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const savedUser =
          localStorage.getItem("drivexUser");

        if (!savedUser) {
          setError("User session not found");
          setLoading(false);
          return;
        }

        const user = JSON.parse(savedUser);

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

        const contactsResponse =
          await fetch(
            `${API_URL}/api/emergency-contacts/${profileId}`
          );

        const contactsData =
          await contactsResponse.json();

        if (!contactsResponse.ok) {
          throw new Error(
            contactsData.message ||
              "Failed to load emergency contacts"
          );
        }

        setContacts(
          contactsData.contacts.map(
            (contact) => ({
              ...contact,
              relation:
                contact.relationship,
              primary:
                contact.isPrimary,
            })
          )
        );
      } catch (error) {
        console.error(
          "Load emergency contacts error:",
          error
        );

        setError(
          error.message ||
            "Failed to load emergency contacts"
        );
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, [API_URL]);

  const addContact = async () => {
    if (!name || !relation || !phone) {
      return;
    }

    if (!driverProfileId) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/emergency-contacts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            driverProfileId,
            name,
            relationship: relation,
            phone,
            isPrimary: false,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create contact"
        );
      }

      const newContact = {
        ...data.contact,
        relation:
          data.contact.relationship,
        primary:
          data.contact.isPrimary,
      };

      setContacts((prev) => [
        ...prev,
        newContact,
      ]);

      setName("");
      setRelation("");
      setPhone("");
      setShowForm(false);
      setError("");
    } catch (error) {
      console.error(
        "Add emergency contact error:",
        error
      );

      setError(
        error.message ||
          "Failed to add contact"
      );
    }
  };

  const setPrimaryContact = async (contact) => {
    try {
      const response = await fetch(
        `${API_URL}/api/emergency-contacts/${contact._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isPrimary: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to set primary contact"
        );
      }

      setContacts((prev) =>
        prev.map((item) => ({
          ...item,
          primary:
            item._id === contact._id,
        }))
      );

      setError("");
    } catch (error) {
      console.error(
        "Set primary contact error:",
        error
      );

      setError(
        error.message ||
          "Failed to set primary contact"
      );
    }
  };

  const removeContact = async (contact) => {
    if (contacts.length <= 1) {
      setError(
        "At least one emergency contact is required."
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/emergency-contacts/${contact._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete contact"
        );
      }

      setContacts((prev) =>
        prev.filter(
          (item) =>
            item._id !== contact._id
        )
      );

      setError("");
    } catch (error) {
      console.error(
        "Delete emergency contact error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete contact"
      );
    }
  };

  if (loading) {
    return (
      <div className="contacts-section">
        <h2>👥 Emergency Contacts</h2>
        <p>Loading contacts...</p>
      </div>
    );
  }

  return (
    <div className="contacts-section">
      <div className="contacts-header">
        <h2>👥 Emergency Contacts</h2>

        <button
          className="add-contact-button"
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          + Add Contact
        </button>
      </div>

      {error && (
        <p className="contact-error">
          {error}
        </p>
      )}

      {showForm && (
        <div className="contact-form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Relation"
            value={relation}
            onChange={(e) =>
              setRelation(e.target.value)
            }
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />

          <button onClick={addContact}>
            Save Contact
          </button>
        </div>
      )}

      {contacts.map((contact) => (
        <ContactCard
          key={contact._id}
          name={contact.name}
          relation={contact.relation}
          phone={contact.phone}
          primary={contact.primary}
          canRemove={contacts.length > 1}
          onSetPrimary={() =>
            setPrimaryContact(contact)
          }
          onRemove={() =>
            removeContact(contact)
          }
        />
      ))}
    </div>
  );
}

export default EmergencyContacts;
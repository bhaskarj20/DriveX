import { useState } from "react";
import contactsData from "../data/contactsData";
import ContactCard from "./ContactCard";

function EmergencyContacts() {
  const [contacts, setContacts] = useState(contactsData);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");

  const addContact = () => {
    if (!name || !relation || !phone) {
      return;
    }

    const newContact = {
      name,
      relation,
      phone,
      primary: false,
    };

    setContacts([...contacts, newContact]);

    setName("");
    setRelation("");
    setPhone("");
    setShowForm(false);
  };

  return (
    <div className="contacts-section">
      <div className="contacts-header">
        <h2>👥 Emergency Contacts</h2>

        <button
          className="add-contact-button"
          onClick={() => setShowForm(!showForm)}
        >
          + Add Contact
        </button>
      </div>

      {showForm && (
        <div className="contact-form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Relation"
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button onClick={addContact}>
            Save Contact
          </button>
        </div>
      )}

{contacts.map((contact) => (
  <ContactCard
    key={contact.phone}
    name={contact.name}
    relation={contact.relation}
    phone={contact.phone}
    primary={contact.primary}
    onRemove={() => {
      setContacts(
        contacts.filter(
          (item) => item.phone !== contact.phone
        )
      );
    }}
  />
))}
    </div>
  );
}

export default EmergencyContacts;
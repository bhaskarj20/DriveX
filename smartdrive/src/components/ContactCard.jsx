function ContactCard({ name, relation, phone, primary, onRemove }) {
  return (
    <div className="contact-card">
      <div>
        <h3>{name}</h3>
        <p>{relation}</p>
        <p>{phone}</p>
      </div>

      <div>
        {primary && (
          <span className="primary-badge">
            Primary
          </span>
        )}

        {!primary && (
          <button
            className="remove-button"
            onClick={onRemove}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

export default ContactCard;
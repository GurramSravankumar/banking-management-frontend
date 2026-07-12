import React from "react";

const emptyProfileForm = {
    fullName: "",
    phone: "",
    occupation: "",
    annualIncome: "",
    nationality: "",
    houseNo: "",
    street: "",
    city: "",
    district: "",
    state: "",
    country: "",
    pincode: "",
};

function EditProfileForm({
    profileForm,
    handleProfileFormChange,
    submitProfileUpdate,
    loading,
    onCancel,
}) {
    return (
        <form className="form-grid" onSubmit={submitProfileUpdate}>
            {Object.keys(emptyProfileForm).map((field) => (
                <div key={field} className="field-group" style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.25rem", textTransform: "capitalize" }}>
                        {field.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                        name={field}
                        type={field === "annualIncome" ? "number" : "text"}
                        value={profileForm[field] || ""}
                        onChange={handleProfileFormChange}
                    />
                </div>
            ))}
            <div className="button-group" style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="submit" disabled={loading}>Save profile</button>
                <button type="button" className="danger" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
}

export default EditProfileForm;

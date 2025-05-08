import React, { useState, useEffect } from "react";
import { Container, Card, Button, Spinner, Alert, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "../Css/NFCConfiguration.css";

const products = [
  { id: 1, name: "Keychain" },
  { id: 2, name: "Visiting Card" },
  { id: 3, name: "Band" },
  { id: 4, name: "Table Standee" },
  { id: 5, name: "Badge" },
];

function NFCConfiguration() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const { profileData } = location.state || {};

  useEffect(() => {
    if (!profileData) {
      navigate("/profile-display");
    }
  }, [profileData, navigate]);

  useEffect(() => {
    if (!("NDEFReader" in window)) {
      setError(
        "Web NFC is not supported on this device. Try Chrome on Android."
      );
    }
  }, []);

  const generateProfileUrl = () => {
    if (!selectedProduct || !profileData) return "";

    const uniqueId = profileData.id || Math.random().toString(36).substr(2, 9);
    const firstName = profileData.personalDetails.firstName.toLowerCase();
    const lastName = profileData.personalDetails.lastName.toLowerCase();

    // For business products, only include business details
    if (
      selectedProduct === "Visiting Card" ||
      selectedProduct === "Table Standee"
    ) {
      return `${firstName}-${lastName}-${uniqueId}-business`;
    }

    // For other products, include all profile details
    return `${firstName}-${lastName}-${uniqueId}-full`;
  };

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
    setSuccess(false); // Reset success state when product changes
  };

  const handleConfigureNFC = async () => {
    if (!("NDEFReader" in window)) {
      setError("Web NFC is not supported on this device/browser.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      //   const ndef = new NDEFReader();
      const ndef = new window.NDEFReader();
      await ndef.write(`${window.location.origin}/profile/${profileUrl}`);

      setSuccess(true);
    } catch (err) {
      console.error("NFC Write Error:", err);
      setError(
        "Failed to configure NFC tag. Please try again with a supported device."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!profileData) {
    return null;
  }

  const profileUrl = generateProfileUrl();

  return (
    <Container fluid className="p-5 nfc-config-main-bg">
      <h2 className="text-center mb-4 text-white">Configure Your NFC Tag</h2>

      <Card className="mb-4">
        <Card.Header className="nfc-config-card-header">
          Select Product and Configure
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-4">
            <Form.Label className="text-white">Select Product</Form.Label>
            <Form.Select
              value={selectedProduct}
              onChange={handleProductChange}
              className="bg-dark text-white border-secondary"
            >
              <option value="">Choose a product...</option>
              {products.map((product) => (
                <option key={product.id} value={product.name}>
                  {product.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {selectedProduct && (
            <>
              <div className="text-center mb-4">
                <p className="mb-2 text-white">
                  Your profile will be accessible at:
                </p>
                <code className="bg-light p-2 rounded d-block">
                  {window.location.origin}/profile/{profileUrl}
                </code>
                <p className="mt-2 text-muted">
                  {selectedProduct === "Visiting Card" ||
                  selectedProduct === "Table Standee"
                    ? "This URL will show only your business details"
                    : "This URL will show your complete profile details"}
                </p>
              </div>

              <div className="text-center">
                <p className="mb-4 text-white">
                  Tap your NFC tag to your device to configure it with your
                  profile URL.
                </p>

                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}

                {success ? (
                  <Alert variant="success" className="mb-4">
                    NFC tag successfully configured! Your profile is now
                    accessible via the NFC tag.
                  </Alert>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleConfigureNFC}
                    disabled={loading}
                    className="px-5"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Configuring...
                      </>
                    ) : (
                      "Configure NFC Tag"
                    )}
                  </Button>
                )}
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      <div className="text-center">
        <Button
          variant="outline-light"
          onClick={() => navigate("/profile-display")}
        >
          Back to Profile
        </Button>
      </div>
    </Container>
  );
}

export default NFCConfiguration;

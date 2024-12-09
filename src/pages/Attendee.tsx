import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";

export const FindYourPhotos: React.FC = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const handleCapture = () => {
    if (webcamRef.current) {
      const capturedImage = webcamRef.current.getScreenshot();
      setImage(capturedImage);
    }
  };

  const handleNextStep = () => {
    if (!name.trim()) {
      alert("Name is required.");
      return;
    }

    if (!email.trim() && (!phoneNumber.trim() || phoneNumber.length !== 10)) {
      alert("Please provide a valid email or a 10-digit phone number.");
      return;
    }

    setStep(3); // Proceed to the next step if validation passes
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please capture a photo.");
      return;
    }

    if (!consent) {
      alert("You must accept the terms and conditions.");
      return;
    }

    setLoading(true);

    try {
      // Prepare FormData to send
      const formData = new FormData();
      formData.append("name", name);
      if (email) formData.append("email", email);
      if (phoneNumber) formData.append("phoneNumber", phoneNumber);
      if (image) {
        const file = dataURLtoFile(image, "profile-image.jpg");
        formData.append("image", file);
      }

      // Make POST request to the API
      const response = await axios.post("http://localhost:8000/api/v1/attendees", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Attendee created successfully!");
    //   console.log("Response:", response.data);
      setStep(1); // Reset to the first step after successful submission
    } catch (error) {
      console.error("Failed to submit form:", error);
      alert("Failed to create attendee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Utility function to convert data URL to File
  const dataURLtoFile = (dataUrl: string, filename: string) => {
    const [header, base64Data] = dataUrl.split(",");
    const mime = header.match(/:(.*?);/)?.[1] || "";
    const byteString = atob(base64Data);
    const arrayBuffer = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      arrayBuffer[i] = byteString.charCodeAt(i);
    }

    return new File([arrayBuffer], filename, { type: mime });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {step === 1 && (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          <h1 className="text-xl font-bold mb-4">Find Your Photos</h1>
          <p className="text-gray-600 mb-6">
            Instant Photo Gallery uses advanced image recognition to help you
            find and view photos from events, gatherings, and more. Simply
            upload a photo, and let us do the work!
          </p>
          <button
            className="bg-blue-500 text-white w-full py-2 rounded"
            onClick={() => setStep(2)}
          >
            Get started now
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-2 rounded mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p className="text-gray-600 mb-2">Sign up with Email, Phone number, or both</p>
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone"
            className="w-full border p-2 rounded mb-4"
            maxLength={10}
            value={phoneNumber}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value)) setPhoneNumber(e.target.value);
            }}
          />
          <button
            className="bg-blue-500 text-white w-full py-2 rounded"
            onClick={handleNextStep}
          >
            Upload a photo
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          {!image && (
            <div>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full rounded mb-4"
              />
              <button
                className="bg-blue-500 text-white w-full py-2 rounded mb-2"
                onClick={handleCapture}
              >
                Capture Photo
              </button>
            </div>
          )}
          {image && (
            <div>
              <img src={image} alt="Captured" className="w-full rounded mb-4" />
              <button
                className="bg-gray-500 text-white w-full py-2 rounded mb-2"
                onClick={() => setImage(null)}
              >
                Retake
              </button>
            </div>
          )}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              className="mr-2"
              checked={consent}
              onChange={() => setConsent(!consent)}
            />
            <label className="text-gray-600">
              By checking this box, I consent to Spot My Photo's use of the image.
            </label>
          </div>
          <button
            className={`w-full py-2 rounded text-white ${
              consent ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={handleSubmit}
            disabled={!consent || loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      )}
    </div>
  );
};

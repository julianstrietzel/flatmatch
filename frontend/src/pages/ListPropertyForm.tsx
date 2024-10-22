import Basics from "../components/FlatProfile/Basics";
import FlatDetails from "../components/FlatProfile/FlatDetails";
import Requirements from "../components/FlatProfile/Requirements";
import UploadImages from "../components/FlatProfile/UploadImages";
import "../styles/ListPropertyForm.css";
import Footer from "../components/Footer";
import { FormProvider, useFormContext } from "../contexts/FormContext.tsx";
import FlatProfileStepper from "../components/FlatProfile/FlatProfileStepper";
import { Box, Divider } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import { useNotification } from "../hooks/useNotification.ts";
import { createFlatProfile } from "../services/profilesService.ts";
import { LandlordUser } from "../types/User.ts";

const ListPropertyForm: React.FC = () => {
  return (
    <FormProvider>
      <FormWrapper />
    </FormProvider>
  );
};

const FormWrapper: React.FC = () => {
  const { formData, errors, validateFormData } = useFormContext();
  const [currentStep, setCurrentStep] = useState(0);
  const { user, setUser } = useAuth();
  const basicsRef = useRef<HTMLDivElement>(null);
  const flatDetailsRef = useRef<HTMLDivElement>(null);
  const requirementsRef = useRef<HTMLDivElement>(null);
  const uploadImagesRef = useRef<HTMLDivElement>(null);
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const formSections = useMemo(
    () => [
      { ref: basicsRef, component: <Basics /> },
      { ref: flatDetailsRef, component: <FlatDetails /> },
      { ref: requirementsRef, component: <Requirements /> },
      { ref: uploadImagesRef, component: <UploadImages /> },
    ],
    [basicsRef, flatDetailsRef, requirementsRef, uploadImagesRef]
  );

  useEffect(() => {
    if (!user || user.accountType !== "landlord") {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  const handleSave = useCallback(async () => {
    if (!validateFormData()) {
      console.error("Validation failed", errors);
      showNotification({
        message: "Required fields are empty!",
        severity: "error",
      });
      return;
    }

    const transformedTags = formData.tags.map((tag: { tagKey: string }) => ({
      tagKey: tag.tagKey,
    }));

    console.log("transformedTags", transformedTags);
    const requirements = Array.isArray(formData.requirements)
      ? formData.requirements
      : [];
    const transformedReqs = requirements.map(
      (req: { reqKey: string; weight: number }) => ({
        reqKey: req.reqKey,
        weight: req.weight,
      })
    );
    console.log("transformedReqs", transformedReqs);

    const updatedFormData = {
      ...formData,
      tags: transformedTags,
      requirements: transformedReqs,
      description: (formData.description || "").trim(),
    };

    try {
      const response = await createFlatProfile(updatedFormData);
      const user_temp = user! as LandlordUser;
      user_temp.profiles = [...(user_temp.profiles || []), response._id];
      setUser(user_temp);
      showNotification({
        message: "Profile created successfully",
        severity: "success",
      });
      console.log("Success:", response);
      localStorage.removeItem("formData");
      navigate(`/selection`);
    } catch (error) {
      console.error(error);
      showNotification({
        message: "Failed to create flat profile",
        severity: "error",
      });
    }
  }, [formData, errors, showNotification, navigate, validateFormData]);

  const handleScroll = useCallback(() => {
    const sectionPositions = formSections.map(
      (section) => section.ref.current?.offsetTop || 0
    );
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    const current = sectionPositions.findIndex((position, index) => {
      if (index === sectionPositions.length - 1) {
        return scrollPosition >= position;
      }
      return (
        scrollPosition >= position &&
        scrollPosition < sectionPositions[index + 1]
      );
    });

    setCurrentStep(current);
  }, [formSections]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="form-container">
      <div className="header-container">
        <FlatProfileStepper currentStep={currentStep} />
      </div>
      <Box sx={{ paddingTop: "120px" }}>
        <div className="form-content">
          {formSections.map((section, index) => (
            <div
              key={index}
              ref={section.ref}
              style={{ marginTop: "10px", marginBottom: "100px" }}
            >
              {section.component}
              <Divider
                sx={{ width: "100%", marginTop: "50px", marginBottom: "20px" }}
              />
            </div>
          ))}
          <div className="navigation-buttons">
            <button className="button save" onClick={handleSave}>
              Submit
            </button>
          </div>
          <div style={{ height: "150px" }}></div>
        </div>
      </Box>
      <Footer />
    </div>
  );
};

export default ListPropertyForm;

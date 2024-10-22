import Footer from "../components/Footer";
import { Box, Button, Divider } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import React from "react";
import apiClient from "../api/apiClient.ts";
import { FormProvider, useSearchContext } from "../contexts/SearchContext.tsx";
import SearchProfileStepper from "../components/searchProfile/SearchProfileStepper.tsx";
import Basics from "../components/searchProfile/Basics.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import Documents from "../components/searchProfile/Documents.tsx";
import FlatDetails from "../components/searchProfile/FlatDetails.tsx";
import YourProfile from "../components/searchProfile/YourProfile.tsx";
import { useNotification } from "../hooks/useNotification.ts";
import { useNavigate } from "react-router-dom";
import { TenantUser } from "../types/User.ts";
const SearchProfilePage: React.FC = () => {
  return (
    <FormProvider context="create">
      <FormWrapper />
    </FormProvider>
  );
};

const FormWrapper: React.FC = () => {
  const { searchData, errors, validateFormData } = useSearchContext();
  const [currentStep, setCurrentStep] = useState(0);
  const { user, setUser, setUpdated } = useAuth();
  const basicsRef = useRef<HTMLDivElement>(null);
  const flatDetailsRef = useRef<HTMLDivElement>(null);
  const documentsRef = useRef<HTMLDivElement>(null);
  const yourProfileRef = useRef<HTMLDivElement>(null);
  const { showNotification } = useNotification();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    if (user.accountType !== "tenant") {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  const formSections = [
    { ref: basicsRef, component: <Basics /> },
    { ref: flatDetailsRef, component: <FlatDetails /> },
    { ref: documentsRef, component: <Documents /> },
    { ref: yourProfileRef, component: <YourProfile /> },
  ];

  const handleSave = async () => {
    if (!validateFormData()) {
      console.error("Validation failed", errors);
      showNotification({
        message: "Required fields are empty!",
        severity: "error",
      });
      return;
    }

    const transformedTags = (searchData.tags || []).map(
      (tag: { tagKey: string }) => ({
        tagKey: tag.tagKey,
      })
    );

    const requirements = Array.isArray(searchData.requirements)
      ? searchData.requirements
      : [];
    const transformedReqs = requirements.map(
      (req: { reqKey: string; weight: number }) => ({
        reqKey: req.reqKey,
        weight: req.weight,
      })
    );

    const updatedSearchData = {
      numberOfRooms: searchData.numberOfRooms,
      description: searchData.description,
      size: searchData.size,
      type: searchData.type,
      priceRange: searchData.priceRange,
      city: searchData.city,
      country: searchData.country,
      tags: transformedTags,
      requirements: transformedReqs,
    };
    apiClient
      .post("/v1/search-profiles", updatedSearchData)
      .then((response) => {
        console.log("updatedFormData", updatedSearchData);
        if (response.status !== 201) {
          const errorData = response.data;
          console.error("Error Response:", errorData);
        }

        showNotification({
          message: "Profile created successfully",
          severity: "success",
        });

        const data = response.data;
        console.log("Success:", data);
        localStorage.removeItem("searchData");
        const newUser = user! as TenantUser;
        newUser.profile = response.data._id;
        setUser(newUser);
        setUpdated((prev) => !prev);
        navigate("/tenantLanding");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleScroll = () => {
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
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="form-container">
      <div className="header-container">
        <SearchProfileStepper currentStep={currentStep} />
      </div>
      <Box sx={{ paddingTop: "120px", marginBottom: "10vh" }}>
        <div className="form-content">
          {formSections.map((section, index) => (
            <div
              key={index}
              ref={section.ref}
              style={{ marginTop: "10px", marginBottom: "50px" }}
            >
              {section.component}
              <Divider
                sx={{ width: "100%", marginTop: "50px", marginBottom: "20px" }}
              />{" "}
            </div>
          ))}
          <Box display="flex" justifyContent="flex-end" pb={14} mr={8}>
            <Button variant="contained" color="yellow" onClick={handleSave}>
              Submit
            </Button>
          </Box>
        </div>
      </Box>
      <Footer />
    </div>
  );
};

export default SearchProfilePage;

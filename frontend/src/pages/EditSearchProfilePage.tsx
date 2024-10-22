import React, { useEffect, useMemo, useRef, useState } from "react";
import Footer from "../components/Footer";
import { Box, Button, CircularProgress, Divider } from "@mui/material";
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
import _ from "lodash";

const EditSearchProfilePage: React.FC = () => {
  return (
    <FormProvider context="edit">
      <EditFormWrapper />
    </FormProvider>
  );
};

const EditFormWrapper: React.FC = () => {
  const { searchData, updateSearchData, errors, validateFormData } =
    useSearchContext();
  const [initialFormData, setInitialFormData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();
  const basicsRef = useRef<HTMLDivElement>(null);
  const flatDetailsRef = useRef<HTMLDivElement>(null);
  const documentsRef = useRef<HTMLDivElement>(null);
  const yourProfileRef = useRef<HTMLDivElement>(null);
  const { showNotification } = useNotification();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeactivated, setIsDeactivated] = useState<boolean>(false);

  const navigate = useNavigate();
  const searchProfileId = useMemo(() => {
    return (user as TenantUser)?.profile;
  }, [user]);

  useEffect(() => {
    if (!user || user.accountType !== "tenant") {
      navigate("/");
      return;
    }
    if (searchProfileId) {
      apiClient
        .get(`/v1/search-profiles/${searchProfileId}`)
        .then((response) => {
          const profileData = response.data[0];
          updateSearchData(profileData);
          setInitialFormData(profileData); // Set the initial form data
          setIsDeactivated(profileData.status === "inactive"); // Set deactivated state based on status
          if (profileData.status === "inactive") {
            showNotification({
              message: "This profile is currently deactivated",
              severity: "info",
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching profile data:", error);
        });
    }
  }, [user, navigate, updateSearchData, searchProfileId]);

  const formSections = useMemo(
    () => [
      { ref: basicsRef, component: <Basics /> },
      { ref: flatDetailsRef, component: <FlatDetails /> },
      { ref: documentsRef, component: <Documents /> },
      { ref: yourProfileRef, component: <YourProfile /> },
    ],
    [updateSearchData]
  );

  const handleSave = async () => {
    if (!validateFormData()) {
      console.error("Validation failed", errors);
      showNotification({
        message: "Required fields are empty!",
        severity: "error",
      });
      return;
    }
    if (!user) {
      return;
    }

    setIsUpdating(true);
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

    try {
      const response = await apiClient.patch(
        `/v1/search-profiles/${searchProfileId}`,
        updatedSearchData
      );
      console.log("updatedFormData", updatedSearchData);

      if (response.status === 200) {
        showNotification({
          message: "Profile updated successfully",
          severity: "success",
        });
        navigate("/tenantLanding");
        localStorage.removeItem("searchDataedit");
      } else {
        console.error("Error Response:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleDeactivate = async () => {
    if (!user) {
      return;
    }

    setIsUpdating(true);

    try {
      const response = await apiClient.patch(
        `/v1/search-profiles/${searchProfileId}`,
        { status: "inactive" }
      );

      if (response.status === 200) {
        showNotification({
          message: "Profile deactivated successfully",
          severity: "success",
        });
        setIsDeactivated(true); // Set deactivated state
        navigate("/tenantLanding");
      } else {
        console.error("Error Response:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleActivate = async () => {
    if (!user) {
      return;
    }

    setIsUpdating(true);

    try {
      const response = await apiClient.patch(
        `/v1/search-profiles/${searchProfileId}`,
        { status: "active" }
      );

      if (response.status === 200) {
        showNotification({
          message: "Profile activated successfully",
          severity: "success",
        });
        setIsDeactivated(false); // Set activated state
        navigate("/tenantLanding");
      } else {
        console.error("Error Response:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsUpdating(false);
    }
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

  const hasFormChanged = useMemo(() => {
    const formChanged = !_.isEqual(searchData, initialFormData);
    return formChanged;
  }, [searchData, initialFormData]);

  const handleCancel = () => {
    updateSearchData(initialFormData);
  };

  return (
    <div className="form-container">
      <div className="header-container">
        <SearchProfileStepper currentStep={currentStep} isEditMode={true} />
      </div>
      <Box sx={{ paddingTop: "120px", marginBottom: "20vh" }}>
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
              />
            </div>
          ))}
          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            mt={3}
            mb={14}
            px={8}
            gap={3}
          >
            {isDeactivated ? (
              <Button variant="outlined" onClick={handleActivate}>
                Activate Profile
              </Button>
            ) : (
              <Button variant="outlined" onClick={handleDeactivate}>
                Deactivate Profile
              </Button>
            )}
            <Box display="flex" gap={3}>
              <Button
                variant="outlined"
                color={user!.accountType === "landlord" ? "primary" : "yellow"}
                onClick={handleCancel}
                disabled={!hasFormChanged || isDeactivated}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color={user!.accountType === "landlord" ? "primary" : "yellow"}
                onClick={handleSave}
                disabled={!hasFormChanged || isDeactivated}
              >
                {isUpdating ? <CircularProgress size={24} /> : "Edit"}
              </Button>
            </Box>
          </Box>
        </div>
      </Box>
      <Footer />
    </div>
  );
};

export default EditSearchProfilePage;

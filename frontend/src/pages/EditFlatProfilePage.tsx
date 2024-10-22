import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box, Button, CircularProgress, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import { useNotification } from "../hooks/useNotification.ts";
import apiClient from "../api/apiClient.ts";
import Basics from "../components/FlatProfile/Basics";
import FlatDetails from "../components/FlatProfile/FlatDetails";
import Requirements from "../components/FlatProfile/Requirements";
import UploadImages from "../components/FlatProfile/UploadImages";
import Footer from "../components/Footer";
import { FormProvider, useFormContext } from "../contexts/FormContext.tsx";
import FlatProfileStepper from "../components/FlatProfile/FlatProfileStepper";
import SelectionCarousel from "../components/selecting/SelectionCarousel.tsx";
import "../styles/ListPropertyForm.css";
import { isLandlordUser } from "../types/User.ts";
import {
  CarouselItem,
  fetchCarouselItem,
} from "../services/profilesService.ts";
import { Flat } from "../components/selecting/SelectionCarousel.tsx";

const ListPropertyForm: React.FC = () => {
  return (
    <FormProvider>
      <FormWrapper />
    </FormProvider>
  );
};

const FormWrapper: React.FC = () => {
  const { formData, updateFormData, errors, validateFormData } =
    useFormContext();
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<CarouselItem[]>([]);
  const basicsRef = useRef<HTMLDivElement>(null);
  const flatDetailsRef = useRef<HTMLDivElement>(null);
  const requirementsRef = useRef<HTMLDivElement>(null);
  const uploadImagesRef = useRef<HTMLDivElement>(null);
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [flatProfileId, setFlatProfileId] = useState<string>("");
  const formSections = useMemo(
    () => [
      { ref: basicsRef, component: <Basics flatProfileId={flatProfileId} /> },
      {
        ref: flatDetailsRef,
        component: <FlatDetails flatProfileId={flatProfileId} />,
      },
      {
        ref: requirementsRef,
        component: <Requirements flatProfileId={flatProfileId} />,
      },
      {
        ref: uploadImagesRef,
        component: <UploadImages flatProfileId={flatProfileId} />,
      },
    ],
    [basicsRef, flatDetailsRef, requirementsRef, uploadImagesRef, formData]
  );
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeactivated, setIsDeactivated] = useState<boolean>(false);

  // Fetch and populate form data when URL changes
  useEffect(() => {
    if (!user || user.accountType !== "landlord") {
      navigate("/");
      return;
    }
    if (!profiles || profiles.length === 0) {
      return;
    }

    if (flatProfileId !== "") {
      apiClient
        .get(`/v1/flat-profiles/${flatProfileId}`)
        .then((response) => {
          updateFormData(response.data);
          setIsDeactivated(response.data.status === "inactive");
          if (response.data.status === "inactive") {
            showNotification({
              message: "This profile is currently deactivated",
              severity: "info",
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching profile data:", error);
        });
    } else {
      setFlatProfileId(profiles[0].id);
    }
  }, [user, navigate, updateFormData, flatProfileId, profiles]);

  useEffect(() => {
    const fetchFlats = async () => {
      if (isLandlordUser(user) && user.profiles && user.profiles.length > 0) {
        const flatIds = user.profiles;
        const flatPromises = flatIds.map((id: string) => fetchCarouselItem(id));
        const fetchedFlats = await Promise.all(flatPromises);
        if (!fetchedFlats) {
          navigate("flat-profiles");
        }
        setProfiles(fetchedFlats);
      }
    };

    fetchFlats().catch((error) =>
      console.error("Error fetching flats:", error)
    );
  }, [user]);

  // Update URL with selected flatProfileId
  const handleFlatSelect = (index: number) => {
    setFlatProfileId(profiles![index].id);
  };

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

    const requirements = Array.isArray(formData.requirements)
      ? formData.requirements
      : [];
    const transformedReqs = requirements.map(
      (req: { reqKey: string; weight: number }) => ({
        reqKey: req.reqKey,
        weight: req.weight,
      })
    );

    const updatedFormData = {
      ...formData,
      tags: transformedTags,
      requirements: transformedReqs,
      description: (formData.description || "").trim(),
    };

    try {
      const response = await apiClient.patch(
        `/v1/flat-profiles/${flatProfileId}`,
        updatedFormData
      );
      if (response.status !== 200) {
        const errorData = response.data;
        console.error("Error Response:", errorData);
        throw new Error("Failed to save form data");
      }

      showNotification({
        message: "Profile updated successfully",
        severity: "success",
      });
      const data = response.data;
      console.log("Success:", data);

      localStorage.removeItem("formData");
    } catch (error) {
      console.error("Error:", error);
      showNotification({
        message: "Failed to update profile",
        severity: "error",
      });
    }
  }, [
    formData,
    errors,
    showNotification,
    validateFormData,
    profiles,
    flatProfileId,
  ]);

  const handleDeactivate = async () => {
    if (!user) {
      return;
    }
    setIsUpdating(true);

    try {
      const response = await apiClient.patch(
        `/v1/flat-profiles/${flatProfileId}`,
        { status: "inactive" }
      );
      if (response.status === 200) {
        showNotification({
          message: "Profile deactivated successfully",
          severity: "success",
        });
        setIsDeactivated(true);
        navigate("/selection");
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
        `/v1/flat-profiles/${flatProfileId}`,
        { status: "active" }
      );

      if (response.status === 200) {
        showNotification({
          message: "Profile activated successfully",
          severity: "success",
        });
        setIsDeactivated(false);
        navigate("/selection");
      } else {
        console.error("Error Response:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

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
    <div>
      <FlatProfileStepper currentStep={currentStep} isEditMode={true} />
      <div style={{ height: "112px" }}></div>
      {profiles && (
        <SelectionCarousel
          flats={profiles as Flat[]}
          onSelect={handleFlatSelect}
        />
      )}
      <Box sx={{ paddingTop: "120px" }}>
        <div className="form-content">
          {formSections.map((section, index) => (
            <div
              key={index}
              ref={section.ref}
              style={{ marginTop: "10px", marginBottom: "50px" }}
            >
              {section.component}
              <Divider
                sx={{
                  width: "100%",
                  marginTop: "50px",
                  marginBottom: "20px",
                }}
              />
            </div>
          ))}
          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={isUpdating || isDeactivated}
            >
              {isUpdating ? <CircularProgress size={24} /> : "Update"}
            </Button>
          </Box>
        </div>
      </Box>
      <Footer />
    </div>
  );
};

export default ListPropertyForm;

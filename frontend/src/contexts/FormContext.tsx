import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { FlatProfile } from "../types/FlatProfile.ts";
import { FlatProfileSchema } from "../schemas/validationSchemas.ts";
import { User } from "../types/User.ts";
import { useAuth } from "../hooks/useAuth.ts";

interface FormContextType {
  formData: FlatProfile;
  user: User | null;
  updateFormData: (newData: Partial<FlatProfile>) => void;
  validateFormData: () => boolean;
  errors: Record<string, string>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

interface FormProviderProps {
  children: ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState<FlatProfile>(() => {
    const savedData = localStorage.getItem("formData");
    return savedData
      ? JSON.parse(savedData)
      : {
          account: "",
          name: "",
          description: "",
          tags: [],
          requirements: [],
          address: {
            street: "",
            buildingNumber: 0,
            city: "",
            postalCode: "",
            country: "",
            state: "",
          },
          price: 0,
          additionalCosts: 0,
          totalCosts: 0,
          size: 0,
          type: "",
          images: [],
          numberOfRooms: 0,
        };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  const updateFormData = useCallback((newData: Partial<FlatProfile>) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  }, []);

  const validateFormData = (): boolean => {
    const result = FlatProfileSchema.safeParse(formData);
    if (!result.success) {
      const errorMessages: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        errorMessages[error.path.join(".")] = error.message;
      });
      setErrors(errorMessages);
      return false;
    }
    setErrors({});
    return true;
  };

  return (
    <FormContext.Provider
      value={{ formData, user, updateFormData, validateFormData, errors }}
    >
      {children}
    </FormContext.Provider>
  );
};

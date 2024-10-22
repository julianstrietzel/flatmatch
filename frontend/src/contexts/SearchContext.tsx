import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { SearchProfile } from "../types/SearchProfile";
import { SearchProfileSchema } from "../schemas/validationSchemas";
import { User } from "../types/User";
import { useAuth } from "../hooks/useAuth";

interface SearchContextType {
  searchData: SearchProfile;
  user: User | null;
  updateSearchData: (newData: Partial<SearchProfile>) => void;
  validateFormData: () => boolean;
  errors: Record<string, string>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearchContext = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a FormProvider");
  }
  return context;
};

interface FormProviderProps {
  children: ReactNode;
  context: string;
}

export const FormProvider: React.FC<FormProviderProps> = ({
  children,
  context,
}) => {
  const { user } = useAuth();

  const [searchData, setSearchData] = useState<SearchProfile>(() => {
    const savedData = localStorage.getItem("searchData" + context + user?.id);
    return savedData
      ? JSON.parse(savedData)
      : {
          description: user?.aboutMe || "",
          account: "",
          numberOfRooms: 0,
          size: 0,
          type: "shared_flat",
          priceRange: {
            min: 0,
            max: 0,
          },
          city: "",
          country: "",
        };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (context !== "edit") {
      localStorage.setItem(
        "searchData" + context + user?.id,
        JSON.stringify(searchData)
      );
    }
  }, [searchData]);

  const updateSearchData = useCallback((newData: Partial<SearchProfile>) => {
    setSearchData((prevData) => ({ ...prevData, ...newData }));
  }, []);

  const validateFormData = (): boolean => {
    const result = SearchProfileSchema.safeParse(searchData);
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
    <SearchContext.Provider
      value={{
        searchData,
        user,
        updateSearchData,
        validateFormData,
        errors,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

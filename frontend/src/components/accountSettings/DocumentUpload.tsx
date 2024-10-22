import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Button, Chip, CircularProgress, Typography } from "@mui/material";
import { ChangeEvent, useRef, useState } from "react";
import { IDocument } from "../../types/Account.ts";
import TagButton from "../profiles/TagButton.tsx";
import { useAuth } from "../../hooks/useAuth.ts";

const documentTypes = [
  "Identity",
  "Income",
  "Employment",
  "Rental History",
  "Other",
];

interface DocumentUploadProps {
  uploadedDocuments: IDocument[];
  handleDocumentChange: (documentType: string, file: File | null) => void;
  handleDocumentDelete: (documentId: string) => void;
}

const DocumentUpload = ({
  uploadedDocuments,
  handleDocumentChange,
  handleDocumentDelete,
}: DocumentUploadProps) => {
  const { user } = useAuth();

  const [selectedFiles, setSelectedFiles] = useState<{
    [key: string]: File | null;
  }>({});
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleTagClick = (documentType: string) => {
    const doc = uploadedDocuments.find(
      (doc) => doc.documentType === documentType
    );
    if (doc) {
      window.open(doc.documentURL, "_blank");
    } else {
      fileInputRefs.current[documentType]?.click();
    }
  };

  const handleFileChange = (
    type: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFiles((prev) => ({ ...prev, [type]: file }));
    }
  };

  const handleUploadClick = async () => {
    setIsUploading(true);
    const uploadPromises = Object.entries(selectedFiles).map(([type, file]) => {
      if (file) {
        return handleDocumentChange(type, file);
      }
      return Promise.resolve();
    });

    await Promise.all(uploadPromises);
    setIsUploading(false);
    setSelectedFiles({});
  };

  const handleDelete = (documentId: string) => {
    handleDocumentDelete(documentId);
    const newFiles = selectedFiles;
    const documentType = uploadedDocuments.find(
      (doc) => doc._id === documentId
    )?.documentType;
    if (documentType) {
      delete newFiles[documentType];

      if (fileInputRefs.current[documentType]) {
        fileInputRefs.current[documentType].value = "";
      }
    }
    setSelectedFiles(newFiles);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="start"
      gap={2}
      mb={3}
    >
      <Typography variant="body1" color="textSecondary">
        Upload Documents
      </Typography>
      <Box display="flex" gap={5}>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {documentTypes.map((type) => {
            const lowerType = type.toLowerCase();
            const uploadedDoc = uploadedDocuments.find(
              (doc) => doc.documentType === lowerType
            );
            const backgroundColor = selectedFiles[lowerType]
              ? "green"
              : uploadedDoc
                ? "green"
                : "#D7D7D7";
            const color = selectedFiles[lowerType]
              ? "white"
              : uploadedDoc
                ? "white"
                : "black";
            return (
              <Box key={type} display="flex" alignItems="center" gap={1}>
                {uploadedDoc ? (
                  <TagButton
                    label={type}
                    onButton={() => {
                      handleDelete(uploadedDoc._id);
                    }}
                    onClick={() => handleTagClick(lowerType)}
                    backgroundColor={backgroundColor}
                    color={color}
                  />
                ) : (
                  <Chip
                    label={type}
                    onClick={() => handleTagClick(lowerType)}
                    style={{
                      backgroundColor: backgroundColor,
                      color: color,
                      cursor: "pointer",
                    }}
                  />
                )}
                <input
                  type="file"
                  hidden
                  accept="application/pdf"
                  ref={(el) => (fileInputRefs.current[lowerType] = el)}
                  onChange={(e) => handleFileChange(lowerType, e)}
                />
              </Box>
            );
          })}
        </Box>
        <Button
          variant="contained"
          color={user!.accountType === "landlord" ? "primary" : "yellow"}
          startIcon={
            isUploading ? <CircularProgress size={20} /> : <CloudUploadIcon />
          }
          onClick={handleUploadClick}
          disabled={
            isUploading || Object.values(selectedFiles).every((file) => !file)
          }
        >
          Upload
        </Button>
      </Box>
    </Box>
  );
};

export default DocumentUpload;

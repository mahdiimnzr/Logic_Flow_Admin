import { useState, Fragment, useEffect } from "react";
import { Button, ListGroup, ListGroupItem } from "reactstrap";
import { useDropzone } from "react-dropzone";
import { FileText, X, UploadCloud } from "react-feather";
import { useTranslation } from "react-i18next";

const ImageDropZone = ({ onChange, error, currentImage }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState(currentImage || null);

  useEffect(() => {
    setFile(currentImage || null);
  }, [currentImage]);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        onChange(acceptedFiles);
      }
    },
  });

  const renderFilePreview = (file) => {
    if (!file) return <FileText size={28} />;

    if (typeof file === "string") {
      return (
        <img
          className="rounded"
          src={file}
          alt="Current"
          width={28}
          height={28}
        />
      );
    }

    if (file?.type?.startsWith("image")) {
      return (
        <img
          className="rounded"
          src={URL.createObjectURL(file)}
          alt={file.name}
          width={28}
          height={28}
        />
      );
    }

    return <FileText size={28} />;
  };

  const renderFileSize = (size) => {
    if (!size) return "";

    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`;
    }

    return `${(Math.round(size / 100) / 10).toFixed(1)} kb`;
  };

  const handleRemoveFile = () => {
    setFile(null);
    onChange([]);
  };

  return (
    <div className="w-100 mt-1">
      <div
        {...getRootProps()}
        className={`w-100 rounded ${error ? "border-danger" : ""}`}
        style={{
          border: `2px dashed ${error ? "#ea5455" : "#7367f0"}`,
          background: error
            ? "rgba(234, 84, 85, 0.04)"
            : "rgba(115, 103, 240, 0.04)",
          cursor: "pointer",
          minHeight: "150px",
        }}
      >
        <input {...getInputProps()} />
        <div className="d-flex align-items-center justify-content-center flex-column py-4 gap-1">
          <UploadCloud size={48} color={error ? "#ea5455" : "#7367f0"} />
          <h5 className="mb-0">{t("DropFilesTitle")}</h5>
          <p className="text-secondary mb-0">
            {t("DropFilesSubtitle")}{" "}
            <a href="/" onClick={(e) => e.preventDefault()}>
              {t("DropFilesBrowse")}
            </a>{" "}
            {t("DropFilesSubtitle2")}
          </p>
        </div>
      </div>

      {error && <div className="invalid-feedback d-block mt-25">{error}</div>}

      {file && (
        <Fragment>
          <ListGroup className="my-2">
            <ListGroupItem className="d-flex align-items-center justify-content-between">
              <div className="file-details d-flex align-items-center">
                <div className="file-preview me-1">
                  {renderFilePreview(file)}
                </div>

                <div>
                  <p className="file-name mb-0">
                    {typeof file === "string"
                      ? file.split("/").pop()
                      : file.name}
                  </p>

                  {typeof file !== "string" && (
                    <p className="file-size mb-0">
                      {renderFileSize(file.size)}
                    </p>
                  )}
                </div>
              </div>

              <Button
                color="danger"
                outline
                size="sm"
                className="btn-icon"
                onClick={handleRemoveFile}
              >
                <X size={14} />
              </Button>
            </ListGroupItem>
          </ListGroup>
        </Fragment>
      )}
    </div>
  );
};

export default ImageDropZone;

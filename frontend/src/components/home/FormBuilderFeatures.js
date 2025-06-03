import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  FaMousePointer,
  FaPuzzlePiece,
  FaWrench,
  FaCloudUploadAlt,
} from "react-icons/fa";
import "./formBuilderFeatures.css";
import HomeNavbar from "./HomeNavbar";

const features = [
  {
    icon: <FaMousePointer size={50} className="text-primary mb-3" />,
    title: "Drag-and-Drop Interface",
    description:
      "Effortlessly add, move, and rearrange fields in seconds with our intuitive builder designed for speed and simplicity.",
    mediaType: "video",
    mediaSrc: "/assets/draganddrop.mp4",
  },
  {
    icon: <FaPuzzlePiece size={50} className="text-success mb-3" />,
    title: "Rich Field Variety",
    description:
      "Select from a wide range of fields including text, numbers, dropdowns, checkboxes, dates, and file uploads.",
    mediaType: "image",
    mediaSrc: "/assets/fields.png",
  },
  {
    icon: <FaWrench size={50} className="text-warning mb-3" />,
    title: "Advanced Customization",
    description:
      "Implement conditional logic, validations, prefilled values, placeholders, and default selections effortlessly.",
    mediaType: "image",
    mediaSrc: "/assets/custom.png",
  },

  {
    icon: <FaCloudUploadAlt size={50} className="text-primary mb-3" />,
    title: "Use our Templates",
    description:
      "Jumpstart your workflow with ready-made templates you can customize and reuse in seconds.",
    mediaType: "image",
    mediaSrc: "/assets/templates.png",
  },
];

const FormBuilderFeatures = () => {
  return (
    <>
      <HomeNavbar />
      <section
        className="form-builder-section py-5"
        role="region"
        aria-labelledby="form-builder-heading"
      >
        <Container>
          <div className="text-center mb-5">
            <h2
              id="form-builder-heading"
              className="fw-bold display-5 text-gradient"
            >
              Build Smarter Forms with FormX360
            </h2>
            <p className="lead text-muted">
              Create advanced, user-friendly forms with our intuitive
              drag-and-drop builder — no coding required.
            </p>
          </div>

          <Row className="gy-4">
            {features.map((feature, index) => (
              <Col key={index} md={9} lg={6}>
                <Card
                  className="feature-card shadow-sm h-100 text-center p-4"
                  role="article"
                  aria-label={feature.title}
                >
                  {feature.icon}
                  <h5 className="fw-semibold">{feature.title}</h5>
                  <p className="text-secondary">{feature.description}</p>

                  {feature.mediaType === "image" ? (
                    <img
                      src={feature.mediaSrc}
                      alt={`Illustration for ${feature.title}`}
                      className="img-fluid rounded mt-3"
                      style={{ Height: "300px", objectFit: "cover" }}
                    />
                  ) : (
                    <video
                      src={feature.mediaSrc}
                      className="img-fluid rounded mt-3"
                      style={{
                        height: "300px",

                        objectFit: "cover",
                      }}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                    />
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default FormBuilderFeatures;

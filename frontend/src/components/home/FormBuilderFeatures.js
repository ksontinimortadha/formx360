import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  FaMousePointer,
  FaPuzzlePiece,
  FaWrench,
  FaEye,
  FaMobileAlt,
  FaCloudUploadAlt,
} from "react-icons/fa";
import "./formBuilderFeatures.css";

const features = [
  {
    icon: <FaMousePointer size={50} className="text-primary mb-3" />,
    title: "Drag-and-Drop Interface",
    description:
      "Effortlessly add, move, and rearrange fields in seconds with our intuitive builder designed for speed and simplicity.",
    mediaType: "image",
    mediaSrc: "/assets/images/features/drag-drop.gif",
  },
  {
    icon: <FaPuzzlePiece size={50} className="text-success mb-3" />,
    title: "Rich Field Variety",
    description:
      "Select from a wide range of fields including text, email, dropdowns, checkboxes, ratings, signatures, and file uploads.",
    mediaType: "video",
    mediaSrc: "/assets/videos/features/fields-demo.mp4",
  },
  {
    icon: <FaWrench size={50} className="text-warning mb-3" />,
    title: "Advanced Customization",
    description:
      "Implement conditional logic, validations, prefilled values, placeholders, and default selections effortlessly.",
    mediaType: "image",
    mediaSrc: "/assets/images/features/customization.png",
  },
  {
    icon: <FaEye size={50} className="text-info mb-3" />,
    title: "Real-time Preview",
    description:
      "Instantly preview your form as you build, ensuring a seamless and user-friendly experience every time.",
    mediaType: "video",
    mediaSrc: "/assets/videos/features/preview.mp4",
  },
  {
    icon: <FaMobileAlt size={50} className="text-danger mb-3" />,
    title: "Responsive & Mobile-Ready",
    description:
      "Create forms that look and perform flawlessly across desktops, tablets, and mobile devices.",
    mediaType: "image",
    mediaSrc: "/assets/images/features/responsive.png",
  },
  {
    icon: <FaCloudUploadAlt size={50} className="text-primary mb-3" />,
    title: "Save & Reuse Templates",
    description:
      "Store your favorite form templates and reuse them to streamline repetitive form creation.",
    mediaType: "video",
    mediaSrc: "/assets/videos/features/templates.mp4",
  },
];


const FormBuilderFeatures = () => {
  return (
    <section
      className="form-builder-section py-5"
      role="region"
      aria-labelledby="form-builder-heading"
    >
      <Container>
        <div
          className="text-center mb-5"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
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

        <Row className="gy-4 ">
          {features.map((feature, index) => (
            <Col key={index} md={6} lg={4}>
              <div
                className="feature-card-wrapper"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
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
                      style={{ maxHeight: "180px", objectFit: "cover" }}
                    />
                  ) : (
                    <video
                      src={feature.mediaSrc}
                      controls
                      muted
                      className="img-fluid rounded mt-3"
                      style={{ maxHeight: "200px", objectFit: "cover" }}
                    />
                  )}
                </Card>
              </div>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-5">
          <div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              size="lg"
              variant="primary"
              href="/builder"
              className="btn-gradient"
              aria-label="Try the FormX360 Form Builder"
            >
              Try the Form Builder Now
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FormBuilderFeatures;

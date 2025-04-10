import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { FaChartBar } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";
import NavbarComponent from "../NavbarComponent";

function ReportDashboard() {
  const { reportId, formId } = useParams();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFormResponses();
  }, [reportId]);

  const fetchFormResponses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://formx360.onrender.com/responses/form/${formId}`
      );
      setResponses(response.data);
    } catch (error) {
      console.error("Error fetching form responses:", error);
      toast.error("Failed to fetch form responses.");
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = () => {
    const responseCounts = {};

    responses.forEach((submission) => {
      const date = new Date(submission.submitted_at).toLocaleDateString();
      responseCounts[date] = (responseCounts[date] || 0) + 1;
    });

    const sortedDates = Object.keys(responseCounts).sort();

    return {
      labels: sortedDates,
      datasets: [
        {
          label: "Responses",
          data: sortedDates.map((date) => responseCounts[date]),
          fill: true,
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "rgba(75,192,192,1)",
          tension: 0.3,
        },
      ],
    };
  };

  const generateQuestionStats = (field_name) => {
    const questionResponses = responses.flatMap((submission) =>
      submission.responses.filter(
        (response) => response.field_name === field_name
      )
    );
    const totalResponses = questionResponses.length;
    const mostCommonResponse = findMostCommonResponse(questionResponses);

    return {
      totalResponses,
      mostCommonResponse,
    };
  };

  const findMostCommonResponse = (responses) => {
    const responseCount = responses.reduce((acc, response) => {
      acc[response.value] = (acc[response.value] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(responseCount).reduce((a, b) =>
      responseCount[a] > responseCount[b] ? a : b
    );
  };
  const convertChartData = (chartData) => {
    if (
      !chartData ||
      !chartData.labels ||
      !Array.isArray(chartData.labels) ||
      !chartData.datasets ||
      !Array.isArray(chartData.datasets) ||
      chartData.datasets.length === 0
    ) {
      return { labels: [], values: [] };
    }

    return {
      labels: chartData.labels,
      values: chartData.datasets[0].data, // ✅ Fixed here
    };
  };

  const chartData = generateChartData();
  const simplifiedChartData = convertChartData(chartData);

  console.log("simplifiedChartData", simplifiedChartData);

  return (
    <>
      <NavbarComponent />
      <Container fluid className="p-4">
        <h2 className="mb-4 text-center text-dark">
          <FaChartBar className="me-2" />
          Report Statistics Dashboard
        </h2>

        {loading && (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" variant="primary" />
          </div>
        )}

        {!loading && responses.length === 0 && (
          <div className="text-center text-muted mt-5">
            <h4>No responses found</h4>
          </div>
        )}

        <Row>
          {responses.length > 0 &&
            Array.from(
              new Set(
                responses.flatMap((submission) =>
                  submission.responses.map((response) => response.field_name)
                )
              )
            ).map((field_name) => {
              const stats = generateQuestionStats(field_name);
              return (
                <Col md={4} className="mb-4" key={field_name}>
                  <Card className="shadow-lg border-0 rounded">
                    <Card.Body>
                      <Card.Title className="text-center">
                        {field_name}
                      </Card.Title>
                      <div className="text-center">
                        <h5>Total Responses: {stats.totalResponses}</h5>
                        <h5>
                          Most Common Response:{" "}
                          <strong>
                            {typeof stats.mostCommonResponse === "String"
                              ? stats.mostCommonResponse
                              : JSON.stringify(stats.mostCommonResponse)}
                          </strong>
                        </h5>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
        </Row>
      </Container>
    </>
  );
}

export default ReportDashboard;

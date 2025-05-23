const predefinedForms = [
  {
    title: "Employee Feedback",
    description:
      "Gather insights from your employees regarding workplace satisfaction.",
    category: "HR",

    fields: [
      {
        id: "q1",
        name: "q1",
        label: "How satisfied are you with your current role?",
        type: "radio-group",
        className: "form-control",
        required: true,
        options: [
          { label: "Very Satisfied", value: "Very Satisfied", selected: false },
          { label: "Satisfied", value: "Satisfied", selected: false },
          { label: "Neutral", value: "Neutral", selected: false },
          { label: "Dissatisfied", value: "Dissatisfied", selected: false },
          {
            label: "Very Dissatisfied",
            value: "Very Dissatisfied",
            selected: false,
          },
        ],
      },
      {
        id: "q2",
        name: "q2",
        label: "What do you like most about working here?",
        type: "textarea",
        className: "form-control",
        required: false,
        options: [],
      },
      {
        id: "q3",
        name: "q3",
        label: "Any suggestions for improvement?",
        type: "textarea",
        className: "form-control",
        required: false,
        options: [],
      },
      {
        id: "q4",
        name: "q4",
        label: "Would you recommend this company to a friend?",
        type: "radio-group",
        className: "form-control",
        required: true,
        options: [
          { label: "Yes", value: "Yes", selected: false },
          { label: "No", value: "No", selected: false },
          { label: "Maybe", value: "Maybe", selected: false },
        ],
      },
      {
        type: "button",
        subtype: "button",
        label: "Submit",
        name: "button-submit-employee-feedback",
        className: "btn-primary btn",
        style: "primary",
        required: false,
        access: [],
        multiple: false,
        inline: false,
        _id: "submit-employee-feedback",
        options: [],
      },
    ],
  },
  {
    title: "Customer Satisfaction",
    description:
      "Understand your customers' experience with your products or services.",
    category: "Marketing",

    fields: [
      {
        id: "q1",
        name: "q1",
        label: "How would you rate our product/service?",
        type: "radio-group",
        className: "form-control",
        required: true,
        options: [
          { label: "Excellent", value: "Excellent", selected: false },
          { label: "Good", value: "Good", selected: false },
          { label: "Average", value: "Average", selected: false },
          { label: "Poor", value: "Poor", selected: false },
          { label: "Very Poor", value: "Very Poor", selected: false },
        ],
      },
      {
        id: "q2",
        name: "q2",
        label: "What feature do you like the most?",
        type: "text",
        className: "form-control",
        required: false,
        options: [],
      },
      {
        id: "q3",
        name: "q3",
        label: "What issues have you faced (if any)?",
        type: "textarea",
        className: "form-control",
        required: false,
        options: [],
      },
      {
        id: "q4",
        name: "q4",
        label: "How likely are you to recommend us?",
        type: "select",
        className: "form-control",
        required: true,
        options: [
          { label: "Very Likely", value: "Very Likely", selected: false },
          { label: "Likely", value: "Likely", selected: false },
          { label: "Neutral", value: "Neutral", selected: false },
          { label: "Unlikely", value: "Unlikely", selected: false },
          { label: "Very Unlikely", value: "Very Unlikely", selected: false },
        ],
      },
      {
        type: "button",
        subtype: "button",
        label: "Submit",
        name: "button-submit-customer-satisfaction",
        className: "btn-primary btn",
        style: "primary",
        required: false,
        access: [],
        multiple: false,
        inline: false,
        _id: "submit-customer-satisfaction",
        options: [],
      },
    ],
  },
  {
    title: "IT Support Request",
    description:
      "Streamline technical issue reporting with this structured form.",
    category: "IT",

    fields: [
      {
        id: "q1",
        name: "q1",
        label: "Your Name",
        type: "text",
        className: "form-control",
        required: true,
        options: [],
      },
      {
        id: "q2",
        name: "q2",
        label: "Department",
        type: "select",
        className: "form-control",
        required: true,
        options: [
          { label: "IT", value: "IT", selected: false },
          { label: "HR", value: "HR", selected: false },
          { label: "Sales", value: "Sales", selected: false },
          { label: "Marketing", value: "Marketing", selected: false },
          { label: "Finance", value: "Finance", selected: false },
          { label: "Other", value: "Other", selected: false },
        ],
      },
      {
        id: "q3",
        name: "q3",
        label: "Type of Issue",
        type: "select",
        className: "form-control",
        required: true,
        options: [
          { label: "Hardware", value: "Hardware", selected: false },
          { label: "Software", value: "Software", selected: false },
          { label: "Network", value: "Network", selected: false },
          { label: "Access", value: "Access", selected: false },
          { label: "Other", value: "Other", selected: false },
        ],
      },
      {
        id: "q4",
        name: "q4",
        label: "Description of the issue",
        type: "textarea",
        className: "form-control",
        required: true,
        options: [],
      },
      {
        id: "q5",
        name: "q5",
        label: "Urgency Level",
        type: "radio-group",
        className: "form-control",
        required: true,
        options: [
          { label: "Low", value: "Low", selected: false },
          { label: "Medium", value: "Medium", selected: false },
          { label: "High", value: "High", selected: false },
          { label: "Critical", value: "Critical", selected: false },
        ],
      },
      {
        type: "button",
        subtype: "button",
        label: "Submit",
        name: "button-submit-it-support",
        className: "btn-primary btn",
        style: "primary",
        required: false,
        access: [],
        multiple: false,
        inline: false,
        _id: "submit-it-support",
        options: [],
      },
    ],
  },
  {
    title: "Project Evaluation",
    description:
      "Evaluate completed projects based on performance and outcomes.",
    fields: [
      {
        id: "q1",
        name: "q1",
        label: "Project Name",
        type: "text",
        className: "form-control",
        required: true,
        options: [],
      },
      {
        id: "q2",
        name: "q2",
        label: "Overall project success",
        type: "radio-group",
        className: "form-control",
        required: true,
        options: [
          {
            label: "Very Successful",
            value: "Very Successful",
            selected: false,
          },
          { label: "Successful", value: "Successful", selected: false },
          { label: "Neutral", value: "Neutral", selected: false },
          { label: "Unsuccessful", value: "Unsuccessful", selected: false },
          {
            label: "Very Unsuccessful",
            value: "Very Unsuccessful",
            selected: false,
          },
        ],
      },
      {
        id: "q3",
        name: "q3",
        label: "Key achievements",
        type: "textarea",
        className: "form-control",
        required: false,
        options: [],
      },
      {
        id: "q4",
        name: "q4",
        label: "Areas for improvement",
        type: "textarea",
        className: "form-control",
        required: false,
        options: [],
      },
      {
        id: "q5",
        name: "q5",
        label: "Would you work on a similar project again?",
        type: "radio-group",
        className: "form-control",
        required: true,
        options: [
          { label: "Yes", value: "Yes", selected: false },
          { label: "No", value: "No", selected: false },
          { label: "Maybe", value: "Maybe", selected: false },
        ],
      },
      {
        type: "button",
        subtype: "button",
        label: "Submit",
        name: "button-submit-project-eval",
        className: "btn-primary btn",
        style: "primary",
        required: false,
        access: [],
        multiple: false,
        inline: false,
        _id: "submit-project-evaluation",
        options: [],
      },
    ],
  },
  // Healthcare Feedback Form
  {
    title: "Healthcare Patient Feedback",
    description: "Collect patient feedback to improve healthcare services.",
    fields: [
      {
        id: "q1",
        name: "q1",
        label: "How would you rate the quality of care you received?",
        type: "radio-group",
        className: "form-control",
        required: true,
        options: [
          { label: "Excellent", value: "Excellent", selected: false },
          { label: "Good", value: "Good", selected: false },
          { label: "Average", value: "Average", selected: false },
          { label: "Poor", value: "Poor", selected: false },
        ],
      },
      {
        id: "q2",
        name: "q2",
        label: "Were the staff courteous and helpful?",
        type: "radio-group",
        className: "form-control",
        required: true,
        options: [
          { label: "Yes", value: "Yes", selected: false },
          { label: "No", value: "No", selected: false },
        ],
      },
      {
        id: "q3",
        name: "q3",
        label: "Any suggestions to improve our service?",
        type: "textarea",
        className: "form-control",
        required: false,
        options: [],
      },
      {
        id: "submit",
        name: "submit",
        label: "Submit",
        type: "button",
        subtype: "button",
        className: "btn-primary btn",
        style: "primary",
        required: false,
        options: [],
        access: [],
      },
    ],
  },

  // Education Course Evaluation Form
  {
    title: "Education Course Evaluation",
    description: "Evaluate the effectiveness of a course or instructor.",
    fields: [
      {
        id: "q1",
        name: "q1",
        label: "How would you rate the course content?",
        type: "radio-group",
        className: "form-control",
        required: true,
        options: [
          { label: "Excellent", value: "Excellent", selected: false },
          { label: "Good", value: "Good", selected: false },
          { label: "Fair", value: "Fair", selected: false },
          { label: "Poor", value: "Poor", selected: false },
        ],
      },
      {
        id: "q2",
        name: "q2",
        label: "Was the instructor clear and engaging?",
        type: "radio-group",
        className: "form-control",
        required: true,
        options: [
          { label: "Yes", value: "Yes", selected: false },
          { label: "No", value: "No", selected: false },
        ],
      },
      {
        id: "q3",
        name: "q3",
        label: "Suggestions for improving the course?",
        type: "textarea",
        className: "form-control",
        required: false,
        options: [],
      },
      {
        id: "submit",
        name: "submit",
        label: "Submit",
        type: "button",
        subtype: "button",
        className: "btn-primary btn",
        style: "primary",
        required: false,
        options: [],
        access: [],
      },
    ],
  },

  // Retail Product Feedback Form
  {
    title: "Retail Product Feedback",
    description:
      "Gather customer opinions about products and shopping experience.",
    fields: [
      {
        id: "q1",
        name: "q1",
        label: "How satisfied are you with the product quality?",
        type: "radio-group",
        className: "form-control",
        required: true,
        options: [
          { label: "Very Satisfied", value: "Very Satisfied", selected: false },
          { label: "Satisfied", value: "Satisfied", selected: false },
          { label: "Neutral", value: "Neutral", selected: false },
          { label: "Dissatisfied", value: "Dissatisfied", selected: false },
          {
            label: "Very Dissatisfied",
            value: "Very Dissatisfied",
            selected: false,
          },
        ],
      },
      {
        id: "q2",
        name: "q2",
        label: "Was the staff helpful during your visit?",
        type: "radio-group",
        className: "form-control",
        required: true,
        options: [
          { label: "Yes", value: "Yes", selected: false },
          { label: "No", value: "No", selected: false },
        ],
      },
      {
        id: "q3",
        name: "q3",
        label: "Additional comments or suggestions",
        type: "textarea",
        className: "form-control",
        required: false,
        options: [],
      },
      {
        id: "submit",
        name: "submit",
        label: "Submit",
        type: "button",
        subtype: "button",
        className: "btn-primary btn",
        style: "primary",
        required: false,
        options: [],
        access: [],
      },
    ],
  },

  // Hospitality Guest Feedback Form
  {
    title: "Hospitality Guest Feedback",
    description:
      "Capture guest feedback to enhance hotel or restaurant services.",
    fields: [
      {
        id: "q1",
        name: "q1",
        label: "Rate your overall experience with us.",
        type: "radio-group",
        className: "form-control",
        required: true,
        options: [
          { label: "Excellent", value: "Excellent", selected: false },
          { label: "Good", value: "Good", selected: false },
          { label: "Average", value: "Average", selected: false },
          { label: "Poor", value: "Poor", selected: false },
        ],
      },
      {
        id: "q2",
        name: "q2",
        label: "How likely are you to visit us again?",
        type: "select",
        className: "form-control",
        required: true,
        options: [
          { label: "Very Likely", value: "Very Likely", selected: false },
          { label: "Likely", value: "Likely", selected: false },
          { label: "Unlikely", value: "Unlikely", selected: false },
          { label: "Very Unlikely", value: "Very Unlikely", selected: false },
        ],
      },
      {
        id: "q3",
        name: "q3",
        label: "What did you like most about your stay?",
        type: "textarea",
        className: "form-control",
        required: false,
        options: [],
      },
      {
        id: "submit",
        name: "submit",
        label: "Submit",
        type: "button",
        subtype: "button",
        className: "btn-primary btn",
        style: "primary",
        required: false,
        options: [],
        access: [],
      },
    ],
  },

  // Manufacturing Quality Control Form
  {
    title: "Manufacturing Quality Control",
    description: "Report and track quality issues on the production line.",
    fields: [
      {
        id: "q1",
        name: "q1",
        label: "Date of inspection",
        type: "date",
        className: "form-control",
        required: true,
        options: [],
      },
      {
        id: "q2",
        name: "q2",
        label: "Product batch number",
        type: "text",
        className: "form-control",
        required: true,
        options: [],
      },
      {
        id: "q3",
        name: "q3",
        label: "Describe the quality issue found",
        type: "textarea",
        className: "form-control",
        required: true,
        options: [],
      },
      {
        id: "q4",
        name: "q4",
        label: "Severity of issue",
        type: "select",
        className: "form-control",
        required: true,
        options: [
          { label: "Low", value: "Low", selected: false },
          { label: "Medium", value: "Medium", selected: false },
          { label: "High", value: "High", selected: false },
          { label: "Critical", value: "Critical", selected: false },
        ],
      },
      {
        id: "submit",
        name: "submit",
        label: "Submit",
        type: "button",
        subtype: "button",
        className: "btn-primary btn",
        style: "primary",
        required: false,
        options: [],
        access: [],
      },
    ],
  },
  {
    title: "Remote Work Feedback",
    description:
      "Collect feedback on remote working conditions and productivity.",
    category: "HR",
    fields: [
      {
        id: "q1",
        name: "work_environment",
        label: "How would you rate your home office setup?",
        type: "radio-group",
        required: true,
        options: [
          { label: "Excellent", value: "excellent" },
          { label: "Good", value: "good" },
          { label: "Average", value: "average" },
          { label: "Poor", value: "poor" },
        ],
      },
      {
        id: "q2",
        name: "productivity",
        label:
          "Has your productivity increased, decreased, or stayed the same?",
        type: "select",
        required: true,
        options: [
          { label: "Increased", value: "increased" },
          { label: "Decreased", value: "decreased" },
          { label: "Stayed the same", value: "same" },
        ],
      },
      {
        id: "q3",
        name: "challenges",
        label: "What are the main challenges you face while working remotely?",
        type: "textarea",
        required: false,
      },
      {
        id: "q4",
        name: "improvements",
        label: "What could the company do to better support remote work?",
        type: "textarea",
        required: false,
      },
      {
        type: "button",
        subtype: "submit",
        label: "Submit Feedback",
        className: "btn-primary",
      },
    ],
  },

  {
    title: "Event Registration",
    description: "Register participants for upcoming events and workshops.",
    category: "Event Management",
    fields: [
      {
        id: "full_name",
        name: "full_name",
        label: "Full Name",
        type: "text",
        required: true,
      },
      {
        id: "email",
        name: "email",
        label: "Email Address",
        type: "email",
        required: true,
      },
      {
        id: "event_choice",
        name: "event_choice",
        label: "Select the event you want to attend",
        type: "select",
        required: true,
        options: [
          { label: "Web Development Workshop", value: "web_dev" },
          { label: "Marketing Seminar", value: "marketing" },
          { label: "Leadership Training", value: "leadership" },
        ],
      },
      {
        id: "dietary_restrictions",
        name: "dietary_restrictions",
        label: "Do you have any dietary restrictions?",
        type: "textarea",
        required: false,
      },
      {
        id: "newsletter",
        name: "newsletter",
        label: "Subscribe to our newsletter?",
        type: "checkbox",
        options: [{ label: "Yes, sign me up!", value: "yes" }],
        required: false,
      },
      {
        type: "button",
        subtype: "submit",
        label: "Register",
        className: "btn-success",
      },
    ],
  },

  {
    title: "Product Return Request",
    description: "Submit a request to return a purchased product.",
    category: "Customer Service",
    fields: [
      {
        id: "order_id",
        name: "order_id",
        label: "Order Number",
        type: "text",
        required: true,
      },
      {
        id: "product_name",
        name: "product_name",
        label: "Product Name",
        type: "text",
        required: true,
      },
      {
        id: "reason",
        name: "reason",
        label: "Reason for Return",
        type: "select",
        required: true,
        options: [
          { label: "Damaged", value: "damaged" },
          { label: "Incorrect Item", value: "incorrect" },
          { label: "Not as Described", value: "not_described" },
          { label: "Other", value: "other" },
        ],
      },
      {
        id: "additional_details",
        name: "additional_details",
        label: "Additional Details",
        type: "textarea",
        required: false,
      },
      {
        id: "refund_method",
        name: "refund_method",
        label: "Preferred Refund Method",
        type: "radio-group",
        required: true,
        options: [
          { label: "Original Payment Method", value: "original" },
          { label: "Store Credit", value: "store_credit" },
          { label: "Exchange", value: "exchange" },
        ],
      },
      {
        type: "button",
        subtype: "submit",
        label: "Submit Request",
        className: "btn-warning",
      },
    ],
  },

  {
    title: "Volunteer Signup",
    description: "Sign up to volunteer for community events and programs.",
    category: "Community",
    fields: [
      {
        id: "name",
        name: "name",
        label: "Full Name",
        type: "text",
        required: true,
      },
      {
        id: "contact_number",
        name: "contact_number",
        label: "Contact Number",
        type: "tel",
        required: true,
      },
      {
        id: "email",
        name: "email",
        label: "Email Address",
        type: "email",
        required: true,
      },
      {
        id: "areas_of_interest",
        name: "areas_of_interest",
        label: "Areas of Interest",
        type: "checkbox-group",
        required: false,
        options: [
          { label: "Event Setup", value: "event_setup" },
          { label: "Fundraising", value: "fundraising" },
          { label: "Community Outreach", value: "outreach" },
          { label: "Administrative Support", value: "admin_support" },
        ],
      },
      {
        id: "availability",
        name: "availability",
        label: "Availability (Days/Times)",
        type: "textarea",
        required: true,
      },
      {
        type: "button",
        subtype: "submit",
        label: "Sign Up",
        className: "btn-primary",
      },
    ],
  },

  {
    title: "Software Bug Report",
    description: "Report bugs or issues encountered in software applications.",
    category: "IT",
    fields: [
      {
        id: "reporter_name",
        name: "reporter_name",
        label: "Your Name",
        type: "text",
        required: true,
      },
      {
        id: "email",
        name: "email",
        label: "Your Email",
        type: "email",
        required: true,
      },
      {
        id: "software_version",
        name: "software_version",
        label: "Software Version",
        type: "text",
        required: false,
      },
      {
        id: "bug_description",
        name: "bug_description",
        label: "Describe the issue or bug",
        type: "textarea",
        required: true,
      },
      {
        id: "steps_to_reproduce",
        name: "steps_to_reproduce",
        label: "Steps to reproduce the issue",
        type: "textarea",
        required: false,
      },
      {
        id: "severity",
        name: "severity",
        label: "Severity Level",
        type: "select",
        required: true,
        options: [
          { label: "Low", value: "low" },
          { label: "Medium", value: "medium" },
          { label: "High", value: "high" },
          { label: "Critical", value: "critical" },
        ],
      },
      {
        type: "button",
        subtype: "submit",
        label: "Report Bug",
        className: "btn-danger",
      },
    ],
  },
  // Lead Generation
  {
    category: "Lead Generation",
    title: "Webinar Signup",
    description: "Register to attend our upcoming educational webinar.",
    fields: [
      {
        id: "full_name",
        name: "full_name",
        label: "Full Name",
        type: "text",
        required: true,
      },
      {
        id: "email",
        name: "email",
        label: "Email Address",
        type: "email",
        required: true,
      },
      {
        id: "company",
        name: "company",
        label: "Company Name",
        type: "text",
        required: false,
      },
      {
        id: "job_title",
        name: "job_title",
        label: "Job Title",
        type: "text",
        required: false,
      },
      {
        id: "interests",
        name: "interests",
        label: "Areas of Interest",
        type: "checkbox-group",
        options: [
          { label: "Product Updates", value: "product_updates" },
          { label: "Industry News", value: "industry_news" },
          { label: "Special Offers", value: "special_offers" },
        ],
      },
      {
        type: "button",
        subtype: "submit",
        label: "Register Now",
        className: "btn-primary",
      },
    ],
  },

  // Business
  {
    category: "Business",
    title: "Partnership Inquiry",
    description: "Submit your interest in a business partnership with us.",
    fields: [
      {
        id: "contact_name",
        name: "contact_name",
        label: "Contact Name",
        type: "text",
        required: true,
      },
      {
        id: "email",
        name: "email",
        label: "Email",
        type: "email",
        required: true,
      },
      {
        id: "phone",
        name: "phone",
        label: "Phone Number",
        type: "tel",
        required: false,
      },
      {
        id: "company_name",
        name: "company_name",
        label: "Company Name",
        type: "text",
        required: true,
      },
      {
        id: "business_type",
        name: "business_type",
        label: "Type of Business",
        type: "select",
        options: [
          { label: "Technology", value: "technology" },
          { label: "Finance", value: "finance" },
          { label: "Retail", value: "retail" },
          { label: "Healthcare", value: "healthcare" },
          { label: "Other", value: "other" },
        ],
        required: true,
      },
      {
        id: "message",
        name: "message",
        label: "Message",
        type: "textarea",
        required: false,
      },
      {
        type: "button",
        subtype: "submit",
        label: "Send Inquiry",
        className: "btn-success",
      },
    ],
  },

  // E-commerce
  {
    category: "E-commerce",
    title: "Custom T-Shirt Order Form",
    description:
      "Order your personalized custom t-shirt with your preferred design and size.",
    fields: [
      {
        id: "customer_name",
        name: "customer_name",
        label: "Full Name",
        type: "text",
        required: true,
      },
      {
        id: "email",
        name: "email",
        label: "Email Address",
        type: "email",
        required: true,
      },
      {
        id: "phone",
        name: "phone",
        label: "Phone Number",
        type: "tel",
        required: false,
      },
      {
        id: "shirt_size",
        name: "shirt_size",
        label: "Shirt Size",
        type: "select",
        options: [
          { label: "Small", value: "S" },
          { label: "Medium", value: "M" },
          { label: "Large", value: "L" },
          { label: "Extra Large", value: "XL" },
        ],
        required: true,
      },
      {
        id: "shirt_color",
        name: "shirt_color",
        label: "Shirt Color",
        type: "color",
        required: true,
      },
      {
        id: "custom_text",
        name: "custom_text",
        label: "Custom Text",
        type: "text",
        required: false,
      },
      {
        id: "design_upload",
        name: "design_upload",
        label: "Upload Design (optional)",
        type: "file",
        required: false,
      },
      {
        type: "button",
        subtype: "submit",
        label: "Place Order",
        className: "btn-warning",
      },
    ],
  },

  // Feedback
  {
    category: "Feedback",
    title: "Customer Satisfaction Survey",
    description:
      "Help us improve by providing your feedback on our products and services.",
    fields: [
      {
        id: "customer_name",
        name: "customer_name",
        label: "Name",
        type: "text",
        required: false,
      },
      {
        id: "email",
        name: "email",
        label: "Email",
        type: "email",
        required: false,
      },
      {
        id: "product_used",
        name: "product_used",
        label: "Product Used",
        type: "text",
        required: true,
      },
      {
        id: "satisfaction_rating",
        name: "satisfaction_rating",
        label: "Overall Satisfaction",
        type: "radio-group",
        options: [
          { label: "Very Satisfied", value: "5" },
          { label: "Satisfied", value: "4" },
          { label: "Neutral", value: "3" },
          { label: "Dissatisfied", value: "2" },
          { label: "Very Dissatisfied", value: "1" },
        ],
        required: true,
      },
      {
        id: "comments",
        name: "comments",
        label: "Additional Comments",
        type: "textarea",
        required: false,
      },
      {
        type: "button",
        subtype: "submit",
        label: "Submit Feedback",
        className: "btn-info",
      },
    ],
  },

  // Human Resources
  {
    category: "Human Resources",
    title: "Employee Exit Interview",
    description:
      "Collect feedback from employees leaving the company to improve work environment.",
    fields: [
      {
        id: "employee_name",
        name: "employee_name",
        label: "Employee Name",
        type: "text",
        required: true,
      },
      {
        id: "department",
        name: "department",
        label: "Department",
        type: "text",
        required: true,
      },
      {
        id: "last_working_day",
        name: "last_working_day",
        label: "Last Working Day",
        type: "date",
        required: true,
      },
      {
        id: "reason_for_leaving",
        name: "reason_for_leaving",
        label: "Reason for Leaving",
        type: "select",
        options: [
          { label: "Career Advancement", value: "career" },
          { label: "Work Environment", value: "environment" },
          { label: "Compensation", value: "compensation" },
          { label: "Personal Reasons", value: "personal" },
          { label: "Other", value: "other" },
        ],
        required: true,
      },
      {
        id: "feedback",
        name: "feedback",
        label: "Feedback / Suggestions",
        type: "textarea",
        required: false,
      },
      {
        type: "button",
        subtype: "submit",
        label: "Submit Interview",
        className: "btn-danger",
      },
    ],
  },

  // Reservation/Booking
  {
    category: "Reservation/Booking",
    title: "Appointment Booking Form",
    description: "Schedule an appointment with our specialists.",
    fields: [
      {
        id: "full_name",
        name: "full_name",
        label: "Full Name",
        type: "text",
        required: true,
      },
      {
        id: "email",
        name: "email",
        label: "Email Address",
        type: "email",
        required: true,
      },
      {
        id: "phone",
        name: "phone",
        label: "Phone Number",
        type: "tel",
        required: false,
      },
      {
        id: "preferred_date",
        name: "preferred_date",
        label: "Preferred Date",
        type: "date",
        required: true,
      },
      {
        id: "preferred_time",
        name: "preferred_time",
        label: "Preferred Time",
        type: "time",
        required: false,
      },
      {
        id: "appointment_reason",
        name: "appointment_reason",
        label: "Reason for Appointment",
        type: "textarea",
        required: false,
      },
      {
        type: "button",
        subtype: "submit",
        label: "Book Appointment",
        className: "btn-primary",
      },
    ],
  },

  // Non-profit
  {
    category: "Non-profit",
    title: "Donation Form",
    description: "Contribute to our cause by making a donation.",
    fields: [
      {
        id: "donor_name",
        name: "donor_name",
        label: "Full Name",
        type: "text",
        required: true,
      },
      {
        id: "email",
        name: "email",
        label: "Email Address",
        type: "email",
        required: true,
      },
      {
        id: "donation_amount",
        name: "donation_amount",
        label: "Donation Amount",
        type: "number",
        required: true,
      },
      {
        id: "donation_type",
        name: "donation_type",
        label: "Donation Type",
        type: "select",
        options: [
          { label: "One-time", value: "one_time" },
          { label: "Monthly", value: "monthly" },
          { label: "Yearly", value: "yearly" },
        ],
        required: true,
      },
      {
        id: "comments",
        name: "comments",
        label: "Comments or Dedication",
        type: "textarea",
        required: false,
      },
      {
        type: "button",
        subtype: "submit",
        label: "Donate Now",
        className: "btn-success",
      },
    ],
  },

  // Education
  {
    category: "Education",
    title: "Workshop Registration",
    description: "Register for upcoming educational workshops and seminars.",
    fields: [
      {
        id: "student_name",
        name: "student_name",
        label: "Student Name",
        type: "text",
        required: true,
      },
      {
        id: "email",
        name: "email",
        label: "Email",
        type: "email",
        required: true,
      },
      {
        id: "phone",
        name: "phone",
        label: "Phone Number",
        type: "tel",
        required: false,
      },
      {
        id: "workshop_choice",
        name: "workshop_choice",
        label: "Choose Workshop",
        type: "select",
        options: [
          { label: "Creative Writing", value: "writing" },
          { label: "Photography Basics", value: "photography" },
          { label: "Public Speaking", value: "speaking" },
        ],
        required: true,
      },
      {
        id: "prior_experience",
        name: "prior_experience",
        label: "Prior Experience (if any)",
        type: "textarea",
        required: false,
      },
      {
        type: "button",
        subtype: "submit",
        label: "Register",
        className: "btn-primary",
      },
    ],
  },
];

export default predefinedForms;

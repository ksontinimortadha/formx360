const mongoose = require("mongoose");

const formPermissionSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  permissions: {
    type: [String],
    enum: ["view", "edit", "delete"],
    default: [],
  },
});

module.exports = mongoose.model("Permission", formPermissionSchema);

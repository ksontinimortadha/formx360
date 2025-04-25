// routes/formPermissions.js
const Permission = require("../models/Permission");

// Save or update permissions
exports.savePermission =  async (req, res) => {
  const { formId, permissions } = req.body;

  try {
    // Clear existing permissions for this form
    await Permission.deleteMany({ formId });

    // Save new permissions
    const bulkOps = permissions.map((perm) => ({
      insertOne: {
        document: {
          formId,
          userId: perm.userId,
          permissions: [perm.permission],
        },
      },
    }));

    await Permission.bulkWrite(bulkOps);
    res.status(200).json({ message: "Permissions updated successfully" });
  } catch (error) {
    console.error("Error saving permissions:", error);
    res.status(500).json({ message: "Failed to save permissions" });
  }
};

// Get permissions for a form
exports.getPermission = async (req, res) => {
  const { formId } = req.params;

  try {
    const permissions = await Permission.find({ formId }).populate(
      "userId",
      "firstName lastName role"
    );
    res.status(200).json({ permissions });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ message: "Failed to fetch permissions" });
  }
};


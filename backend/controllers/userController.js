 const UserModel = require("../models/UserModel");

exports.renameProject = async (req, res) => {
  const { projectName } = req.body;
  const userId = req.user.userId;

  if (!projectName || typeof projectName !== "string") {
    return res.status(400).json({ message: "Invalid project name" });
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { projectName },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Project name updated successfully",
      projectName: updatedUser.projectName,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

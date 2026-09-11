export const getHealth = (req, res) => {
  res.json({
    success: true,
    message: "DriveX API is healthy",
  });
};
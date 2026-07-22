import express from "express";

const router = express.Router();

router.get("/stats", (req, res) => {
  res.json({
    success: true,
    totalOrders: 0
  });
});

export default router;
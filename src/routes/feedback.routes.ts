import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
  return res.status(201).json({
    success: true,
    message: "Feedback endpoint working",
  });
});

export default router;

import { Router, type IRouter } from "express";
import healthRouter from "./health";
import fashionRouter from "./fashion";

const router: IRouter = Router();

router.use(healthRouter);
router.use(fashionRouter);

export default router;

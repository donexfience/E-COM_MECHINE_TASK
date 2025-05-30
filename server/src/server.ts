import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { HttpCode } from "@/utils/constants";
import authRoutes from './routes/auth';

class Server {
  private app: Express;
  private port: number;

  constructor() {
    dotenv.config();

    this.app = express();
    this.port = parseInt(process.env.PORT || "3000", 10);

    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      cors({
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        credentials: true,
      })
    );
    this.app.use(morgan("tiny"));
  }

  private configureRoutes(): void {
    this.app.get("/", (req: Request, res: Response) => {
      res.status(HttpCode.OK).json({ message: "hello server is alive" });
    });
    this.app.use('/api/auth', authRoutes);
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(
        `Server running at http://localhost:${
          this.port
        } on ${new Date().toISOString()}`
      );
    });
  }
}

export default Server;

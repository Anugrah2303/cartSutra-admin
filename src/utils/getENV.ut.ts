import { toast } from "sonner";

const getENV = () => {
  const requiredEnv = ["VITE_SERVER_URL"];

  const missingEnv = requiredEnv.filter(
    (key) => !import.meta.env[key]
  );

  if (missingEnv.length > 0) {
    toast.error(`${missingEnv.join(", ")} not found in .env file`);
    throw new Error(`${missingEnv.join(", ")} not found in .env file`);
  }
};

export default getENV;
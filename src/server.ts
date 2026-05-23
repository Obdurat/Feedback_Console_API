import dotenv from "dotenv";

dotenv.config();

import App from "./app";

const PORT = process.env.PORT || 3333;

new App().app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

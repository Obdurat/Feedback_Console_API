export default class CustomError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    console.log(`CustomError created: ${message} (status: ${status})`); // Debug log
  }
}

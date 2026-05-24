import { Response } from "express";

class SSEManager {
  private clients: Set<Response> = new Set();

  addClient(res: Response) {
    this.clients.add(res);
  }

  removeClient(res: Response) {
    this.clients.delete(res);
  }

  broadcast(event: string, data: object) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    this.clients.forEach((client) => {
      client.write(payload);
    });
  }
}

export default new SSEManager();

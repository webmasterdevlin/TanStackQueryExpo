import axios from "axios";
import { Report } from "../models";

export class ReportService {
  private baseUrl = "http://localhost:8080";

  getReportById = async (id: number): Promise<Report> => {
    const response = await axios.get<Report>(`${this.baseUrl}/reports/${id}`);
    return response.data;
  };

  getReports = async (): Promise<Array<Report>> => {
    const response = await axios.get<Array<Report>>(`${this.baseUrl}/reports`);
    return response.data;
  };
}

// Create a singleton instance
const reportService = new ReportService();
export default reportService;

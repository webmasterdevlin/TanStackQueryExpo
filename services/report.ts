import { Report } from '@/models';
import { api } from '@/http-client/api-config';

const endPoint = 'reports';

const reportService = {
  async getReportById(id: string): Promise<Report> {
    const response = await api.get<Report>(`${endPoint}/${id}`);
    return response.data;
  },

  async getReports(): Promise<Array<Report>> {
    const response = await api.get<Array<Report>>(endPoint);
    return response.data;
  },
};

export default reportService;

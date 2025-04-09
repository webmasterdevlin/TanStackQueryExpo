import { CommodityPaginate } from '@/models';
import { api } from '@/http-client/api-config';

const endPoint = 'commodities';

const commodityService = {
  async getCommodities(page: number, perPage: number): Promise<CommodityPaginate> {
    const response = await api.get<CommodityPaginate>(
      `${endPoint}?_page=${page}&_per_page=${perPage}`
    );
    return response.data;
  },
};

export default commodityService;

import axios from "axios";
import { CommodityPaginate } from "../models";
import { delay } from "@/utilities/api";
import { slow } from "./config";

export class CommodityService {
  private baseUrl = "http://localhost:8080";

  getCommodities = async (
    page: number,
    perPage: number
  ): Promise<CommodityPaginate> => {
    // Add artificial delay for development purposes
    await delay(slow);

    const response = await axios.get<CommodityPaginate>(
      `${this.baseUrl}/commodities?_page=${page}&_per_page=${perPage}`
    );
    return response.data;
  };
}

// Create a singleton instance
const commodityService = new CommodityService();
export default commodityService;

import { configureHeaders } from "@/api/index";
import { API_URL } from "@/lib/constant";
import AdminDashboardServiceDef from "./dashboard/dashboard";

const ADMIN_URL = `${API_URL}/cms/admin`;

export const AdminDashboardService = AdminDashboardServiceDef({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

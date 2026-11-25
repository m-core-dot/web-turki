export const STAFF_PREVIEW_STORAGE_KEY = "mtas:staff-preview";

export type StaffPreview = {
  id: string;
  name: string;
  gender: "LAKI-LAKI" | "PEREMPUAN";
  phone: string;
  address: string;
  department: string;
  role: string;
  status: "active" | "inactive";
};

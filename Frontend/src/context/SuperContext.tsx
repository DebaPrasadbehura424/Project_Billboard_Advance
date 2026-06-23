import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import axios from "axios";

interface SuperUser {
  specialId: string;
}

interface Admin {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  category: string;
}

interface Fwr {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  category: string;
}

interface Report {
  reportId: string | number;
  title?: string;
  category: string;
  location: string;
  riskLevel?: string;
  status: string;
  createdAt?: string;
  reportPhotoEntities: {
    id: number;
    imageUrl: string;
  }[];
  citizenName: string;
}

interface SuperAdminContextType {
  user: SuperUser;
  setUser: React.Dispatch<React.SetStateAction<SuperUser>>;

  admins: Admin[];
  pendingAdmins: Admin[];
  approvedAdmins: Admin[];
  rejectedAdmins: Admin[];

  fieldWorkers: Fwr[];
  pendingFw: Fwr[];
  approvedFw: Fwr[];
  rejectedFw: Fwr[];

  reports: Report[];
  liveReports: Report[];

  loading: boolean;
  error: string | null;

  refreshData: () => Promise<void>;
}

export const SuperContext = createContext<SuperAdminContextType | undefined>(
  undefined,
);

export const SuperProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<SuperUser>({
    specialId: "C001",
  });

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [fieldWorkers, setFieldWorkers] = useState<Fwr[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Admin Filters
  const pendingAdmins = useMemo(
    () => admins.filter((a) => a.status === "PENDING"),
    [admins],
  );

  const approvedAdmins = useMemo(
    () => admins.filter((a) => a.status === "APPROVED"),
    [admins],
  );

  const rejectedAdmins = useMemo(
    () => admins.filter((a) => a.status === "REJECTED"),
    [admins],
  );

  // Field Worker Filters
  const pendingFw = useMemo(
    () => fieldWorkers.filter((f) => f.status === "PENDING"),
    [fieldWorkers],
  );

  const approvedFw = useMemo(
    () => fieldWorkers.filter((f) => f.status === "APPROVED"),
    [fieldWorkers],
  );

  const rejectedFw = useMemo(
    () => fieldWorkers.filter((f) => f.status === "REJECTED"),
    [fieldWorkers],
  );

  // Live Reports
  const liveReports = useMemo(
    () =>
      reports.filter(
        (r) => r.status === "LIVE" || r.status?.toUpperCase() === "LIVE",
      ),
    [reports],
  );

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [adminsRes, reportsRes, fwRes] = await Promise.allSettled([
        axios.get("http://localhost:8080/api/admins/all"),
        axios.get("http://localhost:8080/api/reports/all"),
        axios.get("http://localhost:8080/api/fw/all"),
      ]);

      if (adminsRes.status === "fulfilled") {
        setAdmins(adminsRes.value.data || []);
      } else {
        console.error("Failed to fetch admins:", adminsRes.reason);
      }

      if (reportsRes.status === "fulfilled") {
        setReports(reportsRes.value.data || []);
      } else {
        console.error("Failed to fetch reports:", reportsRes.reason);
      }

      if (fwRes.status === "fulfilled") {
        setFieldWorkers(fwRes.value.data || []);
      } else {
        console.error("Failed to fetch field workers:", fwRes.reason);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const refreshData = async () => {
    await fetchAllData();
  };

  return (
    <SuperContext.Provider
      value={{
        user,
        setUser,

        admins,
        pendingAdmins,
        approvedAdmins,
        rejectedAdmins,

        fieldWorkers,
        pendingFw,
        approvedFw,
        rejectedFw,

        reports,
        liveReports,

        loading,
        error,

        refreshData,
      }}
    >
      {children}
    </SuperContext.Provider>
  );
};

import axios from "axios";
import React, {
  createContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";

export interface Report {
  reportId: number;
  title: string;
  description: string;
  riskPercentage: number;
  riskLevel: string;
  lng: number;
  lat: number;
  reportStatus: string;
  category: string;
  fieldWorker: string;
  reportPhotoEntities: {
    id: number;
    photoUrl: string;
  }[];
}

interface CitizenUser {
  id: string;
  name: string;
  email: string;
  age: string;
  totalReports: number;
  Resolved: number;
  Pending: number;
  ImapactScore: number;
}

interface CitizenContextType {
  user: CitizenUser | null;
  reports: Report[];
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<CitizenUser | null>>;
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
}
export const CitizenContext = createContext<CitizenContextType | undefined>(
  undefined,
);

export const CitizenProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const token = sessionStorage.getItem("token");
  let navigate = useNavigate();
  const [user, setUser] = useState<CitizenUser | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const getUserFrom = async () => {
    try {
      setLoading(true);

      const [citizenRes, reportsRes] = await Promise.all([
        axios.get("http://localhost:8080/api/citizens/MyDeatils", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        axios.get("http://localhost:8080/api/reports/my-reports", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const citizen = citizenRes.data;
      const reports = reportsRes.data;
      console.log(reports);

      const resolvedCount = reports.filter(
        (r: Report) => r.reportStatus === "RESOLVED",
      ).length;

      const pendingCount = reports.filter(
        (r: Report) => r.reportStatus === "PENDING",
      ).length;

      setUser({
        id: citizen.id,
        name: citizen.name,
        email: citizen.email,
        age: citizen.age,
        totalReports: reports.length,
        Resolved: resolvedCount,
        Pending: pendingCount,
        ImapactScore: 0,
      });

      setReports(reports);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            error.response?.data ||
            error.message,
        );
      } else {
        alert("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token != null) {
      getUserFrom();
    } else {
      navigate("/login");
    }
  }, [token]);

  return (
    <CitizenContext.Provider
      value={{ user, setUser, reports, setReports, loading }}
    >
      {children}
    </CitizenContext.Provider>
  );
};

// if (citizenResult.status === "fulfilled") {
//   console.log("Citizen:", citizenResult.value.data);

//   setUser(citizenResult.value.data);
// } else {
//   alert(
//     citizenResult.reason?.response?.data?.message ||
//     "Citizen API Failed"
//   );
// }

// if (reportsResult.status === "fulfilled") {
//   console.log("Reports:", reportsResult.value.data);

//   setReports(reportsResult.value.data);
// } else {
//   alert(
//     reportsResult.reason?.response?.data?.message ||
//     "Reports API Failed"
//   );
// }

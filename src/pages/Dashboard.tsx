import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "@/contexts/AuthContext";
import { addWarrantyToFirestore } from "@/lib/addWarranty";
import { getWarrantiesFromFirestore } from "@/lib/getWarranties";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogOut, Search, Filter, Grid, List } from "lucide-react";
import WarrantyCard from "@/components/WarrantyCard";
import AddWarrantyModal from "@/components/AddWarrantyModal";
import warrantyLogo from "@/assets/warranty-vault-logo.png";

const Dashboard = () => {
  const [warranties, setWarranties] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error: any) {
      console.error("Logout error:", error.message);
      alert("Error signing out");
    }
  };

  const handleAddWarranty = async (newWarranty: any) => {
    try {
      const id = await addWarrantyToFirestore(newWarranty);
      setWarranties([{ ...newWarranty, id }, ...warranties]);
    } catch (error) {
      console.error("Error adding warranty:", error);
      alert("Could not save warranty. Try again.");
    }
  };

  // 👇 Load data from Firestore on page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWarrantiesFromFirestore();
        setWarranties(data);
      } catch (error) {
        console.error("Error fetching warranties:", error);
      }
    };

    fetchData();
  }, []);

  const filteredWarranties = warranties.filter((warranty) => {
    const matchesSearch =
      warranty.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.storeName.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;

    const isExpired = new Date(warranty.expiryDate) < new Date();
    const isExpiringSoon =
      !isExpired &&
      new Date(warranty.expiryDate).getTime() - Date.now() <
        30 * 24 * 60 * 60 * 1000;

    if (statusFilter === "active" && !isExpired && !isExpiringSoon)
      return matchesSearch;
    if (statusFilter === "expiring" && isExpiringSoon) return matchesSearch;
    if (statusFilter === "expired" && isExpired) return matchesSearch;

    return false;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-border/50 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img
                src={warrantyLogo}
                alt="Warranty Vault"
                className="w-10 h-10 rounded-xl shadow-soft"
              />
              <div>
                <h1 className="text-xl font-bold text-vault-dark">
                  Warranty Vault
                </h1>
                <p className="text-sm text-muted-foreground">
                  Hello, {user?.email || "User"}!
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search warranties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expiring">Expiring Soon</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border border-border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none border-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none border-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <AddWarrantyModal onAddWarranty={handleAddWarranty} />
            </div>
          </div>
        </div>

        {/* Warranty List */}
        {filteredWarranties.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <img
                src={warrantyLogo}
                alt="No warranties"
                className="w-16 h-16 mx-auto mb-4 opacity-50"
              />
              <h3 className="text-lg font-semibold text-vault-dark mb-2">
                {searchTerm || statusFilter !== "all"
                  ? "No warranties found"
                  : "No warranties yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Start by adding your first warranty to keep track of your purchases."}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <AddWarrantyModal onAddWarranty={handleAddWarranty} />
              )}
            </div>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredWarranties.map((warranty) => (
              <div key={warranty.id} className="animate-fade-in">
                <WarrantyCard {...warranty} />
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {warranties.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                label: "Total Warranties",
                value: warranties.length,
                color: "text-vault-dark",
              },
              {
                label: "Active",
                value: warranties.filter(
                  (w) =>
                    new Date(w.expiryDate) > new Date() &&
                    new Date(w.expiryDate).getTime() - Date.now() >=
                      30 * 24 * 60 * 60 * 1000
                ).length,
                color: "text-green-600",
              },
              {
                label: "Expiring Soon",
                value: warranties.filter(
                  (w) =>
                    new Date(w.expiryDate) > new Date() &&
                    new Date(w.expiryDate).getTime() - Date.now() <
                      30 * 24 * 60 * 60 * 1000
                ).length,
                color: "text-orange-600",
              },
              {
                label: "Expired",
                value: warranties.filter(
                  (w) => new Date(w.expiryDate) < new Date()
                ).length,
                color: "text-red-600",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-soft border border-border/50"
              >
                <div className="text-center">
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

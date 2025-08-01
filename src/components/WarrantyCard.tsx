import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Store, FileText, Download, Eye } from "lucide-react";
import { format } from "date-fns";

interface WarrantyCardProps {
  id: string;
  productName: string;
  storeName: string;
  purchaseDate: Date;
  expiryDate: Date;
  hasReceipt?: boolean;
  receiptUrl?: string;
}

const WarrantyCard = ({
  productName,
  storeName,
  purchaseDate,
  expiryDate,
  hasReceipt = false,
  receiptUrl
}: WarrantyCardProps) => {
  const isExpired = expiryDate < new Date();
  const isExpiringSoon = !isExpired && (expiryDate.getTime() - Date.now()) < (30 * 24 * 60 * 60 * 1000); // 30 days

  const getStatusBadge = () => {
    if (isExpired) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (isExpiringSoon) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
        Expires Soon
      </Badge>;
    }
    return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
      Active
    </Badge>;
  };

  const handleViewReceipt = () => {
    if (receiptUrl) {
      window.open(receiptUrl, '_blank');
    }
  };

  const handleDownloadReceipt = () => {
    if (receiptUrl) {
      // Mock download functionality
      console.log('Downloading receipt:', receiptUrl);
    }
  };

  return (
    <Card className="hover:shadow-card transition-all duration-300 hover:scale-[1.02] border-border/50 bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-card-foreground">
              {productName}
            </CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              <Store className="mr-1 h-3 w-3" />
              {storeName}
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" />
              Purchased
            </div>
            <div className="font-medium">
              {format(purchaseDate, 'MMM dd, yyyy')}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" />
              Expires
            </div>
            <div className={`font-medium ${isExpired ? 'text-destructive' : isExpiringSoon ? 'text-orange-600' : 'text-green-600'}`}>
              {format(expiryDate, 'MMM dd, yyyy')}
            </div>
          </div>
        </div>

        {hasReceipt && (
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <FileText className="mr-1 h-3 w-3" />
                Receipt available
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewReceipt}
                  className="h-8 px-2 text-xs hover:bg-primary/10 hover:border-primary/30"
                >
                  <Eye className="mr-1 h-3 w-3" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadReceipt}
                  className="h-8 px-2 text-xs hover:bg-primary/10 hover:border-primary/30"
                >
                  <Download className="mr-1 h-3 w-3" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WarrantyCard;
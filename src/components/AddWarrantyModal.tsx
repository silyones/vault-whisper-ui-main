import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CalendarIcon, Upload, Plus, Save } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AddWarrantyModalProps {
  onAddWarranty: (warranty: any) => void;
}

const AddWarrantyModal = ({ onAddWarranty }: AddWarrantyModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    storeName: "",
    purchaseDate: undefined as Date | undefined,
    expiryDate: undefined as Date | undefined,
    receipt: null as File | null
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({
      ...formData,
      receipt: file
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productName || !formData.storeName || !formData.purchaseDate || !formData.expiryDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.expiryDate <= formData.purchaseDate) {
      toast({
        title: "Invalid Dates",
        description: "Expiry date must be after purchase date.",
        variant: "destructive",
      });
      return;
    }

    // Create warranty object with mock data
    const newWarranty = {
      id: Date.now().toString(),
      productName: formData.productName,
      storeName: formData.storeName,
      purchaseDate: formData.purchaseDate,
      expiryDate: formData.expiryDate,
      hasReceipt: !!formData.receipt,
      receiptUrl: formData.receipt ? URL.createObjectURL(formData.receipt) : undefined
    };

    onAddWarranty(newWarranty);
    
    // Reset form
    setFormData({
      productName: "",
      storeName: "",
      purchaseDate: undefined,
      expiryDate: undefined,
      receipt: null
    });
    
    setOpen(false);
    
    toast({
      title: "Warranty Added",
      description: `${formData.productName} has been added to your vault.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-[1.02]">
          <Plus className="mr-2 h-4 w-4" />
          Add New Warranty
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-vault-dark">Add New Warranty</DialogTitle>
          <DialogDescription>
            Enter the details of your new warranty. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                name="productName"
                placeholder="e.g., iPhone 15 Pro Max"
                value={formData.productName}
                onChange={handleInputChange}
                required
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name *</Label>
              <Input
                id="storeName"
                name="storeName"
                placeholder="e.g., Best Buy, Amazon, Apple Store"
                value={formData.storeName}
                onChange={handleInputChange}
                required
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Purchase Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.purchaseDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.purchaseDate ? format(formData.purchaseDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.purchaseDate}
                      onSelect={(date) => setFormData({ ...formData, purchaseDate: date })}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Warranty Expiry Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.expiryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.expiryDate ? format(formData.expiryDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.expiryDate}
                      onSelect={(date) => setFormData({ ...formData, expiryDate: date })}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="receipt">Receipt Upload (Optional)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="receipt"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all duration-300"
                />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
              {formData.receipt && (
                <p className="text-xs text-muted-foreground">
                  Selected: {formData.receipt.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Warranty
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWarrantyModal;
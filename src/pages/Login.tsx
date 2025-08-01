import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import warrantyLogo from "@/assets/warranty-vault-logo.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful:", userCredential.user);

      //  React Router's navigation (SPA-friendly)
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error.message);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-purple flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo and Brand */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img 
                src={warrantyLogo} 
                alt="Warranty Vault Logo" 
                className="w-16 h-16 rounded-2xl shadow-glow"
              />
              <div className="absolute inset-0 bg-primary/10 rounded-2xl"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-vault-dark mb-2">
            Welcome to Warranty Vault
          </h1>
          <p className="text-muted-foreground">
            Securely store your warranties and receipts
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-card border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-vault-dark">Sign in</CardTitle>
            <CardDescription>
              Enter your email and password to access your vault
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-[1.02]"
              >
                <Shield className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

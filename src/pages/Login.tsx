import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useLoginMutation } from '@/store/services/authApi';
import { setCredentials } from '@/store/slices/authSlice';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { isAuthenticated } = useAppSelector(state => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: 'ui_dev_user@spyglaz.com',
    password: 'ChangeMe!2025'
  });

  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await login({
        username: loginForm.email,
        password: loginForm.password
      }).unwrap();

      // Dispatch credentials to Redux store
      dispatch(setCredentials({
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        id_token: result.id_token,
        user_id: result.user_id,
        username: result.user_id ? result.user_id.split('@')[0] : 'user',
        role: 'user',
        permissions: ['email_drafting', 'producer_management', 'analytics', 'strategy_planning']
      }));

      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in."
      });

      sessionStorage.setItem('start-new-chat', '1');

    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error?.data?.message || "Please check your credentials and try again.",
        variant: "destructive"
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Signup not available",
      description: "Please contact your administrator to create an account.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">

          <div className="flex items-center justify-center">
            <h1 className="text-3xl font-bold text-foreground tracking-wide">ARIA Acta-1</h1>
          </div>

          <p className="text-muted-foreground">Access your intelligent sales assistant</p>
        </div>

        {/* Auth Tabs */}
        <Card className="p-6 shadow-elegant">
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-6 w-6 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  variant="premium"
                  disabled={isLoading || isLoginLoading}
                >
                  {isLoading || isLoginLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            {/* Signup Form */}
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="pl-10 pr-10"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-6 w-6 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-confirm"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-10"
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  variant="premium"
                  disabled={false}
                >
                  Creating account...
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="p-4 bg-muted/30 border-border/50">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Demo Mode:</strong> Use ui_dev_user@spyglaz.com / ChangeMe!2025 to access the platform
          </p>
        </Card>
      </div>
    </div>
  );
}
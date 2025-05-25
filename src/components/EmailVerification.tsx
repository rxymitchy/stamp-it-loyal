
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface EmailVerificationProps {
  email: string;
  onBack: () => void;
}

const EmailVerification = ({ email, onBack }: EmailVerificationProps) => {
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleResendEmail = async () => {
    setIsResending(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link.",
      });

      // Start cooldown timer
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-amber-600" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Check className="h-4 w-4" />
            <AlertDescription>
              A verification email has been sent to <strong>{email}</strong>
            </AlertDescription>
          </Alert>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Please check your inbox and click the verification link to activate your account.
            </p>
            
            <div className="text-xs text-gray-500">
              Don't see the email? Check your spam folder or try resending.
            </div>

            <Button
              onClick={handleResendEmail}
              disabled={isResending || resendCooldown > 0}
              variant="outline"
              className="w-full"
            >
              {isResending ? (
                "Sending..."
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                "Resend verification email"
              )}
            </Button>

            <Button
              onClick={onBack}
              variant="ghost"
              className="w-full"
            >
              Back to sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;

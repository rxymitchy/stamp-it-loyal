
import { useState } from 'react';
import EmailVerification from "@/components/EmailVerification";
import AuthForm from "@/components/auth/AuthForm";

const Auth = () => {
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const handleShowEmailVerification = (email: string) => {
    setPendingEmail(email);
    setShowEmailVerification(true);
  };

  const handleBackToAuth = () => {
    setShowEmailVerification(false);
    setPendingEmail("");
  };

  if (showEmailVerification) {
    return (
      <EmailVerification
        email={pendingEmail}
        onBack={handleBackToAuth}
      />
    );
  }

  return <AuthForm onShowEmailVerification={handleShowEmailVerification} />;
};

export default Auth;

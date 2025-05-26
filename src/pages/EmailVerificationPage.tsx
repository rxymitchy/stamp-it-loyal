
import { useLocation } from 'react-router-dom';
import EmailVerification from "@/components/EmailVerification";

const EmailVerificationPage = () => {
  const location = useLocation();
  const email = location.state?.email || '';

  return <EmailVerification email={email} onBack={() => window.history.back()} />;
};

export default EmailVerificationPage;

import { useAuthRedirect } from "./hooks/use-auth-redirect";
import AuthForm from "./components";

const Authentication = () => {
  useAuthRedirect();

  return (
    <div className="mx-auto my-auto p-4">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
};

export default Authentication;

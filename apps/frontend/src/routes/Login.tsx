import Button from "../components/Button";
import { useAuth } from "../components/contexts/authContext";
import Input from "../components/Input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  return (
    <div className="bg-black min-h-screen flex justify-center items-center">
      <div className="bg-white text-black rounded-lg p-2 text-center">
        <h1 className="text-2xl font-bold">Login</h1>
        <hr className="my-2" />

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const result = await auth.login(email, password);
            if (result) {
              navigate("/");
            }
          }}
        >
          <div className="my-2 flex flex-col space-y-2">
            <Input
              required={true}
              onChange={setEmail}
              type={"email"}
              placeholder="Email.."
            />
            <Input
              required={true}
              onChange={setPassword}
              type={"password"}
              placeholder="Password.."
            />
          </div>
          <div className="mt-2">
            <Button type="submit" label="Submit" />
            <p className="mt-2 text-red-600 font-semibold">{auth.error}</p>
          </div>
        </form>
      </div>
    </div>
  );
}

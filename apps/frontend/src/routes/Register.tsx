import Button from "../components/Button";
import Input from "../components/Input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function registerUser() {
    if (email && name && password) {
      const user = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          password,
        }),
      });

      const body = await user.json();

      if (user.ok) {
        navigate("/");
      } else if (body.message) {
        setError(body.message);
      } else {
        setError("An unknown error occurred ");
      }
    }
  }

  return (
    <div className="bg-black min-h-screen flex justify-center items-center">
      <div className="rounded-lg bg-white text-black p-2 w-1/4 text-center">
        <h1 className="text-2xl font-bold">Welcome to Army Knife!</h1>
        <hr className="my-2" />
        <p className="text-left">
          <span className="font-semibold">Army Knife</span> is an app that
          handles all custom uploaders that ShareX supports. Images, files, text
          & urls can all be uploaded & shared.
        </p>
        <p className="text-left">
          First, you need to register an admin account. Enter your login
          information below
        </p>
        <hr className="my-2" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            registerUser();
          }}
        >
          <div className="space-y-2 space-x-2">
            <Input required={true} onChange={setName} placeholder="Name.." />
            <Input
              required={true}
              type={"email"}
              onChange={setEmail}
              placeholder="Email.."
            />
            <Input
              type={"password"}
              required={true}
              onChange={setPassword}
              placeholder="Password.."
            />
          </div>

          <div className="my-2">
            <Button type="submit" label="Register" />
            <p className="mt-2 font-semibold text-red-600">{error}</p>
          </div>
        </form>
      </div>
    </div>
  );
}

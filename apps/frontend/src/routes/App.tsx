import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/contexts/authContext";
import Input from "../components/Input";
import Button from "../components/Button";
import type { AllFilesInterface } from "../lib/types";

function App() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [data, setData] = useState<AllFilesInterface | null>(null);
  const [tab, setTab] = useState<"screenshots" | "links" | "files" | "text">(
    "screenshots",
  );

  const pathMap = {
    screenshots: "/s",
    files: "/f",
    links: "/l",
    text: "/t",
  };

  useEffect(() => {
    if (auth.loaded && !auth.user) {
      fetch("/api/auth/has-admin", {
        method: "get",
      }).then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (!data.registered) navigate("/register");
          else {
            if (auth.loaded && !auth.user) {
              navigate("/login");
            }
          }
        }
      });
    }

    if (auth.loaded && auth.user) {
      fetch("/api/content/all", {
        method: "GET",
        credentials: "include",
      }).then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setData(data);
        }
      });
    }
  }, [auth.loaded, auth.user]);

  const submitUploadToken = () => {
    if (token) {
      fetch("/api/auth/upload-token", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      }).then(async (res) => {
        if (res.ok) {
          auth.refreshUser();
        }
      });
    }
  };

  const ItemRow = ({
    name,
    identifier,
  }: {
    name: string;
    identifier?: string;
  }) => {
    return (
      <div
        className="hover:bg-neutral-800 p-2 select-none hover:cursor-pointer"
        onClick={() =>
          navigator.clipboard.writeText(
            `${location.host}${pathMap[tab]}/${identifier || name}`,
          )
        }
      >
        <h1 className="font-semibold">{name}</h1>
        <p className="text-sm opacity-85">{identifier}</p>
      </div>
    );
  };

  if (auth.loaded) {
    return (
      <div className="bg-black min-h-screen flex justify-center items-center text-white">
        <div className="my-2">
          <h1 className="text-2xl font-bold text-center">Army Knife</h1>

          <hr className="my-2 w-1/2 mx-auto" />

          <div className="my-2">
            {!auth.user?.uploadToken && (
              <div className="border border-white border-solid p-2 w-1/2 mx-auto">
                <h1 className="text-2xl font-bold text-center">Welcome!</h1>
                <p className="text-center">
                  Create an upload token - this will be saved & allow you to
                  upload content from ShareX.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitUploadToken();
                  }}
                >
                  <div className="space-x-2 mt-2 text-center">
                    <Input placeholder="Token.." onChange={setToken} />
                    <Button type="submit" label={"Submit"} />
                  </div>
                </form>
              </div>
            )}
            {auth.user?.uploadToken && data && (
              <div>
                <div className="flex flex-row justify-center space-x-2 my-2">
                  <p
                    onClick={() => setTab("screenshots")}
                    className={`hover:cursor-pointer ${tab === "screenshots" && "underline"}`}
                  >
                    Screenshots
                  </p>
                  <p
                    onClick={() => setTab("files")}
                    className={`hover:cursor-pointer ${tab === "files" && "underline"}`}
                  >
                    Files
                  </p>
                  <p
                    onClick={() => setTab("text")}
                    className={`hover:cursor-pointer ${tab === "text" && "underline"}`}
                  >
                    Text
                  </p>
                  <p
                    onClick={() => setTab("links")}
                    className={`hover:cursor-pointer ${tab === "links" && "underline"}`}
                  >
                    Links
                  </p>
                </div>
                <div className="border border-solid border-white p-2">
                  {tab === "screenshots" &&
                    data["screenshots"].map((v) => (
                      <ItemRow name={v.name} identifier={v.identifier} />
                    ))}
                  {tab === "links" &&
                    data["urls"].map((v) => (
                      <ItemRow name={v.url} identifier={v.identifier} />
                    ))}
                  {tab === "files" &&
                    data["files"].map((v) => (
                      <ItemRow name={v.name} identifier={v.identifier} />
                    ))}
                  {tab === "text" &&
                    data["text"].map((v) => <ItemRow name={v.identifier} />)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-black min-h-screen text-white">
        <p className="text-center">Loading..</p>
      </div>
    );
  }
}

export default App;

import Expandable from "../components/Expandable";

export default function GettingStarted() {
  return (
    <div className="bg-black min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-lg p-2 text-center">
        <h1 className="text-2xl font-bold">Getting Started</h1>
        <hr className="my-2" />
        <p className="text-left">
          To get started, follow the instructions below to set up{" "}
          <span className="font-semibold">Custom Uploaders</span> in ShareX.
        </p>

        <Expandable label="Files (screenshots, files)">
          <ul className="list-inside list-disc">
            <li>
              Go to{" "}
              <span className="font-semibold">Custom uploader settings..</span>
            </li>
            <li>Create an uploader</li>
          </ul>
        </Expandable>
        <Expandable label="Files (screenshots, files)">
          <ul className="list-inside list-disc">
            <li>
              Go to{" "}
              <span className="font-semibold">Custom uploader settings..</span>
            </li>
          </ul>
        </Expandable>
      </div>
    </div>
  );
}

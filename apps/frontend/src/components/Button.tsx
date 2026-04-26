interface ButtonProps {
  onClick?: () => void;
  label: string;
  type?: "button" | "submit" | "reset" | undefined;
}
export default function Button({
  onClick,
  label,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      className="bg-black border-white border-solid border text-white rounded-lg p-2"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

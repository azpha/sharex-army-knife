interface InputProps {
  placeholder?: string;
  type?: string;
  onChange: (v: string) => void;
  required?: boolean;
}
export default function Input({
  placeholder,
  onChange,
  required = false,
  type = "text",
}: InputProps) {
  return (
    <input
      type={type}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="bg-black border-white border-solid border text-white p-2 rounded-lg"
    />
  );
}

import { useState, type ReactNode } from "react";

interface ExpandableProps {
  label: string;
  children: ReactNode;
}

export default function Expandable({ label, children }: ExpandableProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen((o) => !o)}>
        {label} {open ? "▲" : "▼"}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

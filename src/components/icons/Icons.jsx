export function PlusIcon() {
  return (
    <svg width="13" height="13" fill="none" viewBox="0 0 14 14">
      <path
        d="M7 2v10M2 7h10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PenIcon() {
  return (
    <svg width="11" height="11" fill="none" viewBox="0 0 13 13">
      <path
        d="M9.5 1.5l2 2L4 11H2V9z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg width="11" height="11" fill="none" viewBox="0 0 13 13">
      <path
        d="M2 3.5h9M4.5 3.5V2a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1.5M5.5 6v3M7.5 6v3M3.5 3.5l.5 7a1 1 0 001 1h3a1 1 0 001-1l.5-7"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
      <path
        d="M3.5 3.5l7 7M10.5 3.5l-7 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChevronIcon({ collapsed }) {
  return (
    <svg
      width="8"
      height="8"
      fill="none"
      viewBox="0 0 8 8"
      style={{
        transform: collapsed ? "rotate(0deg)" : "rotate(90deg)",
        transition: "transform 0.15s",
      }}
    >
      <path d="M2 1l4 3-4 3" fill="#9CA3AF" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg width="9" height="9" fill="none" viewBox="0 0 10 10">
      <path
        d="M2 5.2l2.2 2.2L8 3"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LogoIcon() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
      <path d="M7 1l5.5 3v6L7 13 1.5 10V4z" stroke="#fff" strokeWidth="1.2" />
      <circle cx="7" cy="7" r="1.5" fill="#fff" />
    </svg>
  );
}

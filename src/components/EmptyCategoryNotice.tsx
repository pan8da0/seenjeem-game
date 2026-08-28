import "./EmptyCategoryNotice.css";

export function EmptyCategoryNotice({ children }: { children: React.ReactNode }) {
  return (
    <p className="empty-category hand" role="note">
      {children}
    </p>
  );
}

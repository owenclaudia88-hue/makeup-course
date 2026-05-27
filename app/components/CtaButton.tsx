import Link from "next/link";

export default function CtaButton({
  children,
  large = false,
  className = "",
}: {
  children: React.ReactNode;
  large?: boolean;
  className?: string;
}) {
  return (
    <Link href="/kassa" className={`${large ? "btn-primary-lg" : "btn-primary"} ${className}`}>
      {children}
    </Link>
  );
}

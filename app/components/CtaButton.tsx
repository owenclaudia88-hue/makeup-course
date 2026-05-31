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
    <Link href="/checkout" className={`${large ? "btn-primary-lg" : "btn-primary"} ${className}`}>
      {children}
    </Link>
  );
}

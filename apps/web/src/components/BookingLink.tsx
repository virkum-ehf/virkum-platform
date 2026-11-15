import type { AnchorHTMLAttributes, ReactNode } from "react";

import { BOOKING_URL } from "@/config/site";

type BookingLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel"> & {
  children: ReactNode;
};

/** Link to the booking calendar, opened in a new tab. */
export function BookingLink({ children, ...props }: BookingLinkProps) {
  return (
    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

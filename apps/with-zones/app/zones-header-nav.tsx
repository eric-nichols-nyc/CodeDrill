"use client";

import { ZonesHeader } from "@repo/design-system/components/layout";
import Link from "next/link";

export function ZonesHeaderNav() {
  return <ZonesHeader linkComponent={Link} />;
}

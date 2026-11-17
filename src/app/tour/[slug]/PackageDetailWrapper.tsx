"use client";

import React, { useState, useEffect } from "react";
import PackageDetailClient from "./PackageDetailClient";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PackageCardSkeleton } from "@/components/Skeleton";
import type { TourPackage } from "@/data/packages";

interface PackageDetailWrapperProps {
  pkg: TourPackage;
  currency: "MYR" | "IDR" | "SGD";
  idrPerUnit: number;
  myrToIdr: number;
  whatsappNumber: string;
  whatsappDisplay: string;
}

export default function PackageDetailWrapper({
  pkg,
  currency,
  idrPerUnit,
  myrToIdr,
  whatsappNumber,
  whatsappDisplay,
}: PackageDetailWrapperProps) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <ErrorBoundary>
      {!hydrated ? (
        <PackageCardSkeleton />
      ) : (
        <PackageDetailClient
          pkg={pkg}
          currency={currency}
          idrPerUnit={idrPerUnit}
          myrToIdr={myrToIdr}
          whatsappNumber={whatsappNumber}
          whatsappDisplay={whatsappDisplay}
        />
      )}
    </ErrorBoundary>
  );
}
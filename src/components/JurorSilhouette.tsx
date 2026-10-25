"use client";

import React from "react";
import { SharkAvatar } from "./SharkAvatar";

interface JurorSilhouetteProps {
  index: number;
  isActive: boolean;
  isConvinced: boolean;
  isRejected: boolean;
  size?: number;
}

export const JurorSilhouette: React.FC<JurorSilhouetteProps> = (props) => {
  return <SharkAvatar {...props} />;
};

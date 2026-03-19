import React from "react";

export interface IConfig {
  label: string;
  key: string;
  type: 'open' | 'push';
  isIcon?: boolean;
  icon?: React.ReactNode;
  path: string;
}
import React from 'react';

export const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-slate-700 rounded-md ${className}`} />
  );
};

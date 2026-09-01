'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollFadeUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function ScrollFadeUp({ children, delay = 0, className = '' }: ScrollFadeUpProps) {
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={`animate-fade-up ${className}`}
    >
      {children}
    </div>
  );
}

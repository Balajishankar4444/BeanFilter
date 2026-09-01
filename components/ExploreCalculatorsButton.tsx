'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ExploreCalculatorsButtonProps {
  targetId?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function ExploreCalculatorsButton({
  targetId = 'calculators',
  className = 'inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3.5 text-sm font-medium text-[#E8DCC8] transition-all duration-300 hover:bg-stone-800 hover:scale-[1.02] hover:shadow-lg active:scale-95 cursor-pointer',
  children,
}: ExploreCalculatorsButtonProps) {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      const navOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: window.innerHeight * 0.7,
        behavior: 'smooth',
      });
    }
  };

  return (
    <a href={`#${targetId}`} onClick={handleScroll} className={className}>
      {children || (
        <>
          <span>Explore Calculators</span>
          <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
        </>
      )}
    </a>
  );
}

import Router from 'next/router';
import { useLayoutEffect, useRef } from 'react';
import { useWindowEvent } from '../hooks/use-window-event';

const Logo = () => {
  const logoRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLImageElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useWindowEvent('scroll', (e) => {
    if (window.scrollY > 1) {
      logoRef.current.style.transition = 'all 0.5s';
      logoRef.current.style.transform = 'translateY(-25px)';
      logoRef.current.style.opacity = '0';
      svgRef.current.style.transition = 'all 0.5s';
      svgRef.current.style.transform = 'translateY(0px)';
      svgRef.current.style.opacity = '1';
      return;
    } else if (window.scrollY < 1) {
      logoRef.current.style.transition = 'all 0.5s';
      logoRef.current.style.transform = 'translateY(0px)';
      logoRef.current.style.opacity = '1';
      svgRef.current.style.transition = 'all 0.5s';
      svgRef.current.style.transform = 'translateY(-25px)';
      svgRef.current.style.opacity = '0';
    }
  });

  return (
    <div
      ref={mainRef}
      className="flex font-main text-3xl cursor-pointer"
      onClick={() => Router.push('/')}
    >
      <span>A</span>
      <div>
        <span ref={logoRef} className="absolute">
          CME
        </span>
      </div>
      <img ref={svgRef} className="w-14 opacity-0" src="/mountain.svg" />
    </div>
  );
};

export default Logo;

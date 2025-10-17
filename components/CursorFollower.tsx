
import React, { useEffect, useRef } from 'react';

const CursorFollower: React.FC = () => {
    const dotRef = useRef<HTMLDivElement>(null);
    const outlineRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>();

    const mousePos = useRef({ x: 0, y: 0 });
    const outlinePos = useRef({ x: 0, y: 0 });
    let isFirstMove = true;

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            if (isFirstMove) {
                outlinePos.current = { x: e.clientX, y: e.clientY };
                isFirstMove = false;
            }
            mousePos.current = { x: e.clientX, y: e.clientY };
        };

        const animate = () => {
            const deltaX = mousePos.current.x - outlinePos.current.x;
            const deltaY = mousePos.current.y - outlinePos.current.y;
            
            outlinePos.current.x += deltaX * 0.15;
            outlinePos.current.y += deltaY * 0.15;
            
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
            }
            if (outlineRef.current) {
                outlineRef.current.style.transform = `translate3d(${outlinePos.current.x}px, ${outlinePos.current.y}px, 0)`;
            }
            requestRef.current = requestAnimationFrame(animate);
        };
        
        requestRef.current = requestAnimationFrame(animate);

        const handleMouseOver = (e: MouseEvent) => {
            if (e.target instanceof Element && e.target.closest('a, button, input, textarea, select, [data-cursor-hover]')) {
                 if (outlineRef.current) outlineRef.current.classList.add('hovering');
            }
        };
        
        const handleMouseOut = (e: MouseEvent) => {
             if (e.target instanceof Element && e.target.closest('a, button, input, textarea, select, [data-cursor-hover]')) {
                 if (outlineRef.current) outlineRef.current.classList.remove('hovering');
            }
        };
        
        window.addEventListener('mousemove', moveCursor);
        document.body.addEventListener('mouseover', handleMouseOver);
        document.body.addEventListener('mouseout', handleMouseOut);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.body.removeEventListener('mouseover', handleMouseOver);
            document.body.removeEventListener('mouseout', handleMouseOut);
            if(requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return (
        <>
            <div ref={outlineRef} className="cursor-outline"></div>
            <div ref={dotRef} className="cursor-dot"></div>
        </>
    );
};

export default CursorFollower;

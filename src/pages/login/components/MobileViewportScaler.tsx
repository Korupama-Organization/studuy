import { useEffect, useMemo, useState } from 'react';

interface MobileViewportScalerProps {
    children: React.ReactNode;
    baseWidth?: number;
    baseHeight?: number;
    mode?: 'contain' | 'cover';
}

export default function MobileViewportScaler({
    children,
    baseWidth = 375,
    baseHeight = 812,
    mode = 'cover',
}: MobileViewportScalerProps) {
    const [viewport, setViewport] = useState(() => ({
        width: typeof window !== 'undefined' ? window.innerWidth : baseWidth,
        height: typeof window !== 'undefined' ? window.innerHeight : baseHeight,
    }));

    useEffect(() => {
        const onResize = () => {
            setViewport({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', onResize);
        window.addEventListener('orientationchange', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('orientationchange', onResize);
        };
    }, []);

    const scale = useMemo(() => {
        const widthScale = viewport.width / baseWidth;
        const heightScale = viewport.height / baseHeight;
        return mode === 'cover'
            ? Math.max(widthScale, heightScale)
            : Math.min(widthScale, heightScale);
    }, [viewport.height, viewport.width, baseHeight, baseWidth, mode]);

    return (
        <div className="h-dvh w-full overflow-hidden bg-gradient-to-b from-[#4550C9] via-[#5B56D8] to-[#8C56F1]">
            <div className="relative h-full w-full">
                <div
                    className="absolute left-1/2 top-1/2"
                    style={{
                        width: `${baseWidth}px`,
                        height: `${baseHeight}px`,
                        transform: `translate(-50%, -50%) scale(${scale})`,
                        transformOrigin: 'center center',
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

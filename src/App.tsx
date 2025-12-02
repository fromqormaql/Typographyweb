import { useState, useEffect, useCallback } from 'react';
import Tabloid1 from './imports/Tabloid1';

interface Circle {
  id: number;
  x: number;
  y: number;
  size: number;
  char: string;
}

export default function App() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [nextId, setNextId] = useState(0);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // 입력 가능한 글자만 처리 (특수키 제외)
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      // 랜덤 크기 (11 ~ 18)
      const size = 11 + Math.random() * 7;
      
      // 랜덤 위치 (고정된 프레임 크기 792x1037 내에서)
      const x = Math.random() * (792 - size);
      const y = Math.random() * (1037 - size);
      
      const newCircle: Circle = {
        id: nextId,
        x,
        y,
        size,
        char: event.key
      };
      
      setCircles(prev => [...prev, newCircle]);
      setNextId(prev => prev + 1);
    }
  }, [nextId]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div 
      className="relative w-screen h-screen overflow-auto bg-gray-100 flex items-center justify-center"
      tabIndex={0}
    >
      {/* Figma 디자인 배경 - 고정 비율 792x1037 유지 */}
      <div 
        className="relative overflow-hidden" 
        style={{ 
          width: '100%',
          height: '100%',
          maxWidth: '792px',
          maxHeight: '1037px',
          aspectRatio: '792/1037'
        }}
      >
        <Tabloid1 />
        
        {/* 타이핑으로 생성되는 원들 */}
        <svg 
          className="absolute inset-0 pointer-events-none"
          width="792"
          height="1037"
          viewBox="0 0 792 1037"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          {circles.map((circle) => (
            <circle
              key={circle.id}
              cx={circle.x + circle.size / 2}
              cy={circle.y + circle.size / 2}
              r={circle.size / 2}
              fill="white"
              stroke="black"
              strokeWidth="0.5"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface OrderAmbulanceButtonProps {
  currentLanguage: Language;
  disabled?: boolean;
  onTriggerOrder: () => Promise<boolean>;
  onComplete: () => void;
}

export const OrderAmbulanceButton: React.FC<OrderAmbulanceButtonProps> = ({
  currentLanguage,
  disabled = false,
  onTriggerOrder,
  onComplete,
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const t = translations[currentLanguage];

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled || isAnimating || isDone) return;

    const button = buttonRef.current;
    if (!button) return;

    // Validate form inputs first
    const ok = await onTriggerOrder();
    if (!ok) return;

    const box = button.querySelector('.box') as HTMLElement;
    const truck = button.querySelector('.truck') as HTMLElement;
    if (!box || !truck) return;

    setIsAnimating(true);
    button.classList.add('animation');

    // 1. Box appears
    gsap.to(button, {
      '--box-s': 1,
      '--box-o': 1,
      duration: 0.3,
      delay: 0.5,
    });

    // 2. Box moves towards ambulance
    gsap.to(box, {
      x: 0,
      duration: 0.4,
      delay: 0.7,
    });

    // 3. Ambulance prepares suspension
    gsap.to(button, {
      '--hx': -5,
      '--bx': 50,
      duration: 0.18,
      delay: 0.92,
    });

    gsap.to(box, {
      y: 0,
      duration: 0.1,
      delay: 1.15,
    });

    gsap.set(button, {
      '--truck-y': 0,
      '--truck-y-n': -26,
    });

    // 4. Ambulance takes off across the road with wheels spinning & siren
    gsap.to(button, {
      '--truck-y': 1,
      '--truck-y-n': -25,
      duration: 0.2,
      delay: 1.25,
      onComplete() {
        gsap
          .timeline({
            onComplete() {
              button.classList.add('done');
              setIsDone(true);
              setIsAnimating(false);
              setTimeout(() => {
                onComplete();
              }, 400);
            },
          })
          .to(truck, {
            x: 0,
            duration: 0.4,
          })
          .to(truck, {
            x: 40,
            duration: 1,
          })
          .to(truck, {
            x: 20,
            duration: 0.6,
          })
          .to(truck, {
            x: 120,
            duration: 0.4,
          });

        gsap.to(button, {
          '--progress': 1,
          duration: 2.4,
          ease: 'power2.in',
        });
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center my-3 select-none">
      {/* Exact .truck-button from CodePen with Ambulance customization */}
      <button
        ref={buttonRef}
        onClick={handleClick}
        disabled={disabled || isAnimating}
        type="button"
        className="truck-button"
      >
        <span className="default">
          ПОЛУЧИТЬ ТАЛОН (СКОРАЯ 103)
        </span>
        <span className="success">
          ТАЛОН ЗАРЕГИСТРИРОВАН
          <svg viewBox="0 0 12 10">
            <polyline points="1.5 6 4.5 9 10.5 1" />
          </svg>
        </span>

        {/* 3D Truck container styled as an Ambulance with red medical cross */}
        <div className="truck">
          <div className="wheel" />
          <div className="back">
            {/* Red Medical Cross on the ambulance body */}
            <div className="med-cross">
              <span className="cross-v" />
              <span className="cross-h" />
            </div>
            <span className="med-badge">103</span>
          </div>
          <div className="front">
            {/* Flashing blue and red emergency siren */}
            <div className="siren-light" />
          </div>
          {/* Medical kit box loaded into the ambulance */}
          <div className="box">
            <div className="box-cross">
              <span className="b-v" />
              <span className="b-h" />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

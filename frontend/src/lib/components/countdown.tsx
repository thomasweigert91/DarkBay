"use client";

import { FC, useEffect, useState } from "react";

interface CountdownProps {
  endDate: string | Date;
  className?: string;
  variant?: "digits" | "units"; // "HH:mm:ss" vs "01h 05m 22s"
  onEnd?: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isEnded: boolean;
}

const calculateTimeRemaining = (targetDate: string | Date): TimeRemaining => {
  const difference = new Date(targetDate).getTime() - Date.now();

  if (difference <= 0 || isNaN(difference)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isEnded: true,
    };
  }

  const totalSeconds = Math.floor(difference / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    isEnded: false,
  };
};

export const Countdown: FC<CountdownProps> = ({
  endDate,
  className = "",
  variant = "digits",
  onEnd,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining | null>(null);

  useEffect(() => {
    // Initial calculation on client mount to avoid hydration mismatch
    const initial = calculateTimeRemaining(endDate);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(initial);

    if (initial.isEnded) {
      onEnd?.();
      return;
    }

    const interval = setInterval(() => {
      const current = calculateTimeRemaining(endDate);
      setTimeLeft(current);

      if (current.isEnded) {
        clearInterval(interval);
        onEnd?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate, onEnd]);

  // Placeholder during SSR to prevent hydration mismatch
  if (!timeLeft) {
    return (
      <span
        className={`inline-block tabular-nums whitespace-nowrap ${className}`}
      >
        --:--:--
      </span>
    );
  }

  if (timeLeft.isEnded) {
    return (
      <span
        className={`inline-block tabular-nums whitespace-nowrap ${className}`}
      >
        Beendet
      </span>
    );
  }

  const pad = (num: number) => String(num).padStart(2, "0");

  const formattedHours = pad(timeLeft.hours);
  const formattedMinutes = pad(timeLeft.minutes);
  const formattedSeconds = pad(timeLeft.seconds);

  if (variant === "units") {
    const daysPart = timeLeft.days > 0 ? `${timeLeft.days}d ` : "";
    return (
      <span
        className={`inline-block tabular-nums whitespace-nowrap ${className}`}
      >
        {daysPart}
        {formattedHours}h {formattedMinutes}m {formattedSeconds}s
      </span>
    );
  }

  const daysPart = timeLeft.days > 0 ? `${timeLeft.days}d ` : "";
  return (
    <span
      className={`inline-block tabular-nums whitespace-nowrap ${className}`}
    >
      {daysPart}
      {formattedHours}:{formattedMinutes}:{formattedSeconds}
    </span>
  );
};

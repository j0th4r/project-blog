'use client';
import React from 'react';
import clsx from 'clsx';
import { Play, Pause, RotateCcw } from 'react-feather';

import Card from '@/components/Card';
import VisuallyHidden from '@/components/VisuallyHidden';

import styles from './CircularColorsDemo.module.css';
import { useImmerReducer } from 'use-immer';

import { motion } from 'framer-motion';

const COLORS = [
  { label: 'red', value: 'hsl(348deg 100% 60%)' },
  { label: 'yellow', value: 'hsl(50deg 100% 55%)' },
  { label: 'blue', value: 'hsl(235deg 100% 65%)' },
];

function reducer(draftState, action) {
  switch (action.type) {
    case 'play': {
      draftState.isRunning = true;
      return;
    }

    case 'reset': {
      draftState.isRunning = false;
      draftState.count = 0;
      return;
    }

    case 'pause': {
      draftState.isRunning = false;
      return;
    }

    case 'run': {
      draftState.count++;
      return;
    }
  }
}

function CircularColorsDemo() {
  const id = React.useId();

  // TODO: This value should increase by 1 every second:
  const [timeElapsed, dispatch] = useImmerReducer(reducer, {
    count: 0,
    isRunning: false,
  });

  React.useEffect(() => {
    if (timeElapsed.isRunning) {
      const intervalId = window.setInterval(() => {
        dispatch({ type: 'run' });
      }, 1000);

      return () => {
        window.clearInterval(intervalId);
      };
    }
  }, [timeElapsed.isRunning, dispatch]);

  // TODO: This value should cycle through the colors in the
  // COLORS array:
  const selectedColor = COLORS[timeElapsed.count % COLORS.length];

  return (
    <Card as="section" className={styles.wrapper}>
      <ul className={styles.colorsWrapper}>
        {COLORS.map((color, index) => {
          const isSelected = color.value === selectedColor.value;

          return (
            <li className={styles.color} key={index}>
              {isSelected && (
                <motion.div
                  layoutId={`${id}-selected-color-outline`}
                  className={styles.selectedColorOutline}
                />
              )}
              <div
                className={clsx(
                  styles.colorBox,
                  isSelected && styles.selectedColorBox
                )}
                style={{
                  backgroundColor: color.value,
                }}
              >
                <VisuallyHidden>{color.label}</VisuallyHidden>
              </div>
            </li>
          );
        })}
      </ul>

      <div className={styles.timeWrapper}>
        <dl className={styles.timeDisplay}>
          <dt>Time Elapsed</dt>
          <dd>{timeElapsed.count}</dd>
        </dl>
        <div className={styles.actions}>
          {timeElapsed.isRunning === false ? (
            <button onClick={() => dispatch({ type: 'play' })}>
              <Play />
              <VisuallyHidden>Play</VisuallyHidden>
            </button>
          ) : (
            <button onClick={() => dispatch({ type: 'pause' })}>
              <Pause />
              <VisuallyHidden>Pause</VisuallyHidden>{' '}
            </button>
          )}
          <button onClick={() => dispatch({ type: 'reset' })}>
            <RotateCcw />
            <VisuallyHidden>Reset</VisuallyHidden>
          </button>
        </div>
      </div>
    </Card>
  );
}

export default CircularColorsDemo;

import { useEffect, useRef } from 'react';

export const useInput = () => {
  const input = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    action: false,
  });

  useEffect(() => {
    const handleKey = (e, value) => {
      switch (e.key.toLowerCase()) {
        case 'w': case 'arrowup': input.current.forward = value; break;
        case 's': case 'arrowdown': input.current.backward = value; break;
        case 'a': case 'arrowleft': input.current.left = value; break;
        case 'd': case 'arrowright': input.current.right = value; break;
        case 'enter': input.current.action = value; break;
        default: break;
      }
    };

    const handleKeyDown = (e) => handleKey(e, true);
    const handleKeyUp = (e) => handleKey(e, false);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleGamepad = () => {
    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[0];
    if (!gamepad) return;

    const leftStickY = gamepad.axes[1];
    const leftStickX = gamepad.axes[0];
    const deadzone = 0.25;

    input.current.forward = leftStickY < -deadzone;
    input.current.backward = leftStickY > deadzone;
    input.current.left = leftStickX < -deadzone;
    input.current.right = leftStickX > deadzone;
    input.current.action = gamepad.buttons[0].pressed;
  };

  return { input, handleGamepad };
};
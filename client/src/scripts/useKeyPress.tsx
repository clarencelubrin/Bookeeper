import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

const useKeyPress = (keys, callback, node = null) => {
  // Use a ref to store the latest callback
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // Define key press handler
  const handleKeyPress = useCallback(
    (event) => {
      // Check if all specified keys are pressed
      const allKeysPressed = keys.every((key) => {
        if (['Control', 'Shift', 'Alt', 'Meta'].includes(key)) {
          return event.getModifierState(key);
        }
        return event.key === key;
      });

      // If all keys are pressed, execute the callback
      if (allKeysPressed) {
        callbackRef.current(event);
      }
    },
    [keys]
  );

  useEffect(() => {
    // Target node for event listener (default to document)
    const targetNode = node ?? document;

    // Attach the keydown event listener
    targetNode.addEventListener('keydown', handleKeyPress);

    // Cleanup event listener on unmount
    return () => targetNode.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress, node]);

  return null; // No need to return anything
};

export default useKeyPress;
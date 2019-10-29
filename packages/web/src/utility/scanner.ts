/**
 * Returns whether there's an video input device present.
 */
export const hasVideoInputDevice = async () => {
  if (navigator.mediaDevices === undefined) {
    // Either insecure connection or API is not supported.
    return false;
  }

  return (await navigator.mediaDevices.enumerateDevices()).some(
    deviceInfo => deviceInfo.kind === "videoinput"
  );
};

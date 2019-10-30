/**
 * Returns environment camera media stream object.
 */
export const getEnvironmentCameraMediaStream = async () => {
  if (navigator.mediaDevices === undefined) {
    return undefined;
  }

  try {
    return await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: "environment" } }
    });
  } catch (error) {
    return undefined;
  }
};

/**
 * Returns whether there's an environment camera present.
 */
export const hasEnvironmentCamera = async () => {
  if (navigator.mediaDevices === undefined) {
    // Either insecure connection or API is not supported.
    return false;
  }

  const deviceInfos = await navigator.mediaDevices.enumerateDevices();

  if (!deviceInfos.some(deviceInfo => deviceInfo.kind === "videoinput")) {
    return false;
  }

  const stream = await getEnvironmentCameraMediaStream();

  if (stream === undefined) {
    return false;
  }

  stream.getTracks().forEach(track => track.stop());

  return true;
};

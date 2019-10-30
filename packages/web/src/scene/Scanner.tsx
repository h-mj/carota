import { inject, observer } from "mobx-react";
import * as React from "react";

import {
  BarcodeFormat,
  BrowserBarcodeReader,
  DecodeContinuouslyCallback,
  DecodeHintType,
  Result
} from "@zxing/library";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { SceneTitle } from "../component/SceneTitle";
import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";
import { getEnvironmentCameraMediaStream } from "../utility/scanner";

/**
 * Barcode decode hints.
 */
const DECODE_HINTS = new Map<DecodeHintType, unknown>([
  [DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13]]
]);

/**
 * Required number of consecutive scans with the same result before the scan
 * callback function is called.
 */
const REQUIRED_CONSECUTIVE_RESULT_COUNT = 3;

/**
 * Scanner scene component props.
 */
interface ScannerProps {
  /**
   * Scan callback function.
   */
  onScan: (barcode: string) => void;
}

/**
 * Scanner scene component translation.
 */
interface ScannerTranslation {
  /**
   * Title bar text.
   */
  title: string;
}

/**
 * Barcode scanner scene component.
 */
@inject("views")
@observer
export class Scanner extends SceneComponent<
  "Scanner",
  ScannerProps,
  ScannerTranslation
> {
  /**
   * Barcode reader instance.
   */
  private reader: BrowserBarcodeReader = new BrowserBarcodeReader(
    100,
    DECODE_HINTS
  );

  /**
   * Previous scan result that used to improve accuracy by requiring multiple
   * consecutive successful scans with same result.
   */
  private previousScanResult?: Result;

  /**
   * Number of consecutive identical results.
   */
  private consecutiveResultCount = 0;

  /**
   * Video element reference which will display the camera feed.
   */
  private videoRef = React.createRef<HTMLVideoElement>();

  /**
   * Sets the name of this component.
   */
  public constructor(
    props: ScannerProps & DefaultSceneComponentProps<"Scanner">
  ) {
    super("Scanner", props);
  }

  /**
   * Renders the camera feed.
   */
  public render() {
    return (
      <Container>
        <SceneTitle scene={this.props.scene} title={this.translation.title} />
        <Video ref={this.videoRef} />
        <Mask />
      </Container>
    );
  }

  /**
   * Creates environment camera media stream and decodes it using `BrowserBarcodeReader` instance.
   */
  public async componentDidMount() {
    const stream = await getEnvironmentCameraMediaStream();

    if (stream === undefined) {
      return;
    }

    this.reader.decodeFromStream(
      stream,
      this.videoRef.current!,
      this.decodeCallback
    );
  }

  /**
   * Stops the reader from decoding.
   */
  public componentWillUnmount() {
    this.reader.stopContinuousDecode();
  }

  /**
   * Stream decoding callback function.
   */
  public decodeCallback: DecodeContinuouslyCallback = async result => {
    if (result === null) {
      return;
    }

    if (
      this.previousScanResult !== undefined &&
      this.previousScanResult.getText() === result.getText()
    ) {
      this.consecutiveResultCount += 1;
    } else {
      this.consecutiveResultCount = 0;
    }

    if (this.consecutiveResultCount === REQUIRED_CONSECUTIVE_RESULT_COUNT) {
      this.props.onScan(result.getText());
    }

    this.previousScanResult = result;
  };
}

/**
 * Container that wraps `Video` component so that it does not overflow.
 */
const Container = styled.div`
  position: relative;

  flex-grow: 1;
  overflow: hidden;
`;

/**
 * Camera feed video component.
 */
const Video = styled.video`
  ${RESET};

  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;
`;

/**
 * Mask that guides user to scan the barcode in specific position and rotation.
 */
const Mask = styled.div`
  position: absolute;

  top: 50%;
  left: 50%;

  transform: translateX(-50%) translateY(-50%);

  width: 80vmin;
  height: 60vmin;

  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 0 0 100vmax ${({ theme }) => theme.backgroundColorTranslucent};
`;

import { inject, observer } from "mobx-react";
import * as React from "react";

import {
  BarcodeFormat,
  BrowserBarcodeReader,
  DecodeContinuouslyCallback,
  DecodeHintType,
  Result,
} from "@zxing/library";

import { SceneComponent, SceneComponentProps } from "../base/SceneComponent";
import { TitleBar } from "../component/TitleBar";
import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";
import { getEnvironmentCameraMediaStream } from "../utility/scanner";

/**
 * Barcode decode hints.
 */
const DECODE_HINTS = new Map<DecodeHintType, unknown>([
  [DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13]],
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
  onScan: (barcode?: string) => void;
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
@inject("viewStore")
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
   * Created user media stream.
   */
  private stream?: MediaStream;

  /**
   * Sets the name of this component.
   */
  public constructor(props: SceneComponentProps<"Scanner"> & ScannerProps) {
    super("Scanner", props);
  }

  /**
   * Renders the camera feed.
   */
  public render() {
    return (
      <RelativeFlex>
        <TitleBar
          onClose={this.handleClose}
          title={this.translation.title}
          scanner={true}
        />

        <Video ref={this.videoRef} />

        <RelativeFlex>
          <Mask />
        </RelativeFlex>
      </RelativeFlex>
    );
  }

  /**
   * Creates environment camera media stream and decodes it using `BrowserBarcodeReader` instance.
   */
  public async componentDidMount() {
    this.stream = await getEnvironmentCameraMediaStream();

    if (this.stream === undefined) {
      return;
    }

    this.reader.decodeFromStream(
      this.stream,
      this.videoRef.current!,
      this.decodeCallback
    );
  }

  /**
   * Stops the reader from decoding.
   */
  public componentWillUnmount() {
    this.reader.stopContinuousDecode();

    if (this.stream !== undefined) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
  }

  /**
   * Stream decoding callback function.
   */
  public decodeCallback: DecodeContinuouslyCallback = async (result) => {
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

  /**
   * Calls scan callback with `undefined` value.
   */
  public handleClose = () => {
    this.props.onScan(undefined);
  };
}

/**
 * Relatively positioned flex component.
 */
const RelativeFlex = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;

  flex-grow: 1;
`;

/**
 * Camera feed video component.
 */
const Video = styled.video`
  ${RESET};

  position: absolute;

  top: 0;
  left: 0;

  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  background-color: black;
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
  box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.5);
`;

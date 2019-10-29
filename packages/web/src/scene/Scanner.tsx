import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";

import {
  BarcodeFormat,
  BrowserBarcodeReader,
  DecodeContinuouslyCallback,
  DecodeHintType
} from "@zxing/library";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { RESET } from "../styling/stylesheets";

/**
 * Barcode decode hints.
 */
const DECODE_HINTS = new Map([
  [DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13]]
]);

/**
 * Maps `getUserMedia` function potential thrown error names to error reason
 * strings that are used to provide translated error messages.
 */
const ERROR_REASONS = new Map([
  ["NotAllowedError", "notAllowed" as const],
  ["NotFoundError", "notFound" as const],
  ["SecurityError", "insecure" as const]
]);

/**
 * Union of potential `getUserMedia` reasons.
 */
type Reason = NonNullable<ReturnType<typeof ERROR_REASONS["get"]> | "unknown">;

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
   * Occurred error message translations.
   */
  reasons: Record<Reason, string>;
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
    250,
    DECODE_HINTS
  );

  /**
   * Video element reference which will display the camera feed.
   */
  private videoRef = React.createRef<HTMLVideoElement>();

  /**
   * Occurred error reason.
   */
  @observable private reason?: Reason;

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
      <>
        {this.reason !== undefined && this.translation.reasons[this.reason]}
        <Video ref={this.videoRef} />
      </>
    );
  }

  /**
   * Creates environment camera media stream and decodes it using `BrowserBarcodeReader` instance.
   */
  public async componentDidMount() {
    try {
      if (navigator.mediaDevices === undefined) {
        this.reason = "insecure";
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" } }
      });

      this.reader.decodeFromStream(
        stream,
        this.videoRef.current!,
        this.decodeCallback
      );
    } catch (error) {
      this.reason = ERROR_REASONS.get(error.name) || "unknown";
    }
  }

  /**
   * Stream decoding callback function.
   */
  public decodeCallback: DecodeContinuouslyCallback = async result => {
    if (result === null) {
      return;
    }

    this.reader.stopContinuousDecode();
    this.props.onScan(result.getText());
  };
}

/**
 * Camera feed vide component.
 */
const Video = styled.video`
  ${RESET};

  width: 100%;
  height: 100%;
`;

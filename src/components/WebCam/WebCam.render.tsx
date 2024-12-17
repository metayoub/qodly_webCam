import { useRenderer, useSources } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useRef, useCallback, useState } from 'react';
import { MdOutlinePhotoCamera, MdOutlineCameraswitch } from 'react-icons/md';
import { IWebCamProps } from './WebCam.config';
import Webcam from 'react-webcam';

const WebCam: FC<IWebCamProps> = ({ mirrored, style, className, classNames = [] }) => {
  const { connect, emit } = useRenderer();
  const {
    sources: { datasource: ds },
  } = useSources();
  const [facingMode, setFacingMode] = useState('environment');
  const webcamRef = useRef<Webcam>(null);

  function dataURLtoFile(dataurl: string, filename: string) {
    var arr = dataurl.split(','),
      bstr = atob(arr[arr.length - 1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: 'image/jpeg' });
  }

  const capture = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();

      if (imageSrc && ds) {
        try {
          const imageFile = dataURLtoFile(imageSrc, 'captured_photo.jpg');

          await ds.setValue<any>(null, imageFile);

          emit('oncapture');
        } catch (error) {
          console.error('Error updating datasource:', error);
        }
      } else {
        console.error('Failed to capture image or datasource is not available.');
      }
    }
  }, [webcamRef, ds]);

  const switchCamera = useCallback(() => {
    setFacingMode((prevState) => (prevState === 'user' ? 'environment' : 'user'));
  }, []);

  return (
    <div
      ref={connect}
      style={style}
      className={cn('webCamContainer relative overflow-hidden', className, classNames)}
    >
      <Webcam
        className="webCam"
        mirrored={mirrored}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        screenshotQuality={1}
        videoConstraints={{ facingMode }}
      />
      <div className="flex flex-row w-full justify-around absolute bottom-0 p-4">
        <button
          onClick={switchCamera}
          className="buttonSwicth p-3 bg-gray-200 rounded-full border-2 border-gray-300"
        >
          <MdOutlineCameraswitch className="iconSwitch w-10 h-10 text-gray-600" />
        </button>
        <button
          onClick={capture}
          className="buttonCapture p-3 bg-gray-200 rounded-full border-2 border-gray-300"
        >
          <MdOutlinePhotoCamera className="iconCapture w-10 h-10 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default WebCam;

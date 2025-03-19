import { useRenderer, useSources } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useRef, useCallback, useState, useEffect } from 'react';
import { MdOutlinePhotoCamera, MdOutlineCameraswitch } from 'react-icons/md';
import { IWebCamProps } from './WebCam.config';
import Webcam from 'react-webcam';
import { MdOutlineFileUpload } from 'react-icons/md';

const WebCam: FC<IWebCamProps> = ({
  cameraHeight,
  cameraWidth,
  mirrored,
  style,
  className,
  classNames = [],
}) => {
  const { connect, emit } = useRenderer();
  const {
    sources: { datasource: ds },
  } = useSources();
  const [facingMode, setFacingMode] = useState('environment');
  const [cameraAccess, setCameraAccess] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const imageSrc = webcamRef.current.getScreenshot({
        width: cameraWidth,
        height: cameraHeight,
      });

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

  const openFileUplaod = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedImage = event.target.files?.[0];
    if (uploadedImage && ds) {
      try {
        ds.setValue<any>(null, uploadedImage);
      } catch (error) {
        console.error('Failed to upload the selected image:', error);
      }
    }
  };

  useEffect(() => {
    const checkCameraAccess = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraAccess(true);
      } catch (error) {
        console.error('Camera access denied or not available:', error);
        setCameraAccess(false);
      }
    };
    checkCameraAccess();
  }, []);

  return (
    <div
      ref={connect}
      style={style}
      className={cn('webCamContainer relative overflow-hidden', className, classNames)}
    >
      {cameraAccess ? (
        <>
          <Webcam
            className="webCam"
            mirrored={mirrored}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={1}
            videoConstraints={{ facingMode }}
          />
          <div className="buttonsBloc flex flex-row w-full justify-around absolute bottom-0 p-4">
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
            <button
              onClick={openFileUplaod}
              className="buttonUpload p-3 bg-gray-200 rounded-full border-2 border-gray-300"
            >
              <MdOutlineFileUpload className="iconUpload w-10 h-10 text-gray-600" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileSelect}
              className="fileUpload hidden"
            />
          </div>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center rounded-lg border bg-purple-400 py-4 text-white">
          <p>Camera access is denied or unavailable.</p>
        </div>
      )}
    </div>
  );
};

export default WebCam;

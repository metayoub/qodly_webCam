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
  uploadPictures,
  screenshotQuality = 1,
  style,
  disabled,
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

  //function that will handle the pic compression , reads it and resizes it to the desired size
  const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      const newImage = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        if (!e.target?.result) return reject('FileReader failed');
        newImage.src = e.target.result as string;
      };

      newImage.onload = () => {
        const canvas = document.createElement('canvas');
        let width = newImage.width;
        let height = newImage.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
        if (!context) return reject('Canvas context error');

        context.drawImage(newImage, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject('Compression failed');
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          0.7, // =>for  good quality with reduced file size
        );
      };

      newImage.onerror = reject;

      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedImage = event.target.files?.[0];
    if (uploadedImage && ds) {
      try {
        const resizedImage = await resizeImage(uploadedImage, cameraWidth, cameraHeight);
        ds.setValue<any>(null, resizedImage);
        emit('oncapture');
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
      className={cn(
        'webCamContainer relative overflow-hidden',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
        classNames,
      )}
    >
      {cameraAccess ? (
        <>
          <Webcam
            className="webCam"
            mirrored={mirrored}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={screenshotQuality}
            videoConstraints={{ facingMode }}
          />
          <div className="buttonsBloc flex flex-row w-full justify-around absolute bottom-0 p-4">
            <button
              onClick={switchCamera}
              disabled={disabled}
              className="buttonSwicth p-3 bg-gray-200 rounded-full border-2 border-gray-300"
            >
              <MdOutlineCameraswitch className="iconSwitch w-10 h-10 text-gray-600" />
            </button>
            <button
              onClick={capture}
              disabled={disabled}
              className="buttonCapture p-3 bg-gray-200 rounded-full border-2 border-gray-300"
            >
              <MdOutlinePhotoCamera className="iconCapture w-10 h-10 text-gray-600" />
            </button>
            {uploadPictures && (
              <>
                {' '}
                <button
                  onClick={openFileUplaod}
                  className="buttonUpload p-3 bg-gray-200 rounded-full border-2 border-gray-300"
                  disabled={disabled}
                >
                  <MdOutlineFileUpload className="iconUpload w-10 h-10 text-gray-600" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="fileUpload hidden"
                />{' '}
              </>
            )}
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

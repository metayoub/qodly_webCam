import { useRenderer, useSources } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useRef, useCallback } from 'react';
import { MdOutlinePhotoCamera } from 'react-icons/md';
import { IWebCamProps } from './WebCam.config';
import Webcam from 'react-webcam';

const WebCam: FC<IWebCamProps> = ({ mirrored, style, className, classNames = [] }) => {
  const { connect, emit } = useRenderer();
  const {
    sources: { datasource: ds },
  } = useSources();

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
        } catch (error) {
          console.error('Error updating datasource:', error);
        }
      } else {
        console.error('Failed to capture image or datasource is not available.');
      }
    }
    emit('oncapture');
  }, [webcamRef, ds]);

  return (
    <div
      ref={connect}
      className={cn(
        'flex items-center p-4 bg-gray-100 rounded-lg border border-gray-300 w-fit h-fit',
        className,
        classNames,
      )}
    >
      <Webcam
        style={style}
        mirrored={mirrored}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        screenshotQuality={1}
      />
      <button onClick={capture} className="p-3 bg-gray-200 rounded-full border-2 border-gray-300">
        <MdOutlinePhotoCamera className="w-10 h-10 text-gray-600" />
      </button>
    </div>
  );
};

export default WebCam;

import { useEnhancedNode } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC } from 'react';
import { MdOutlinePhotoCamera } from 'react-icons/md';
import { IWebCamProps } from './WebCam.config';

const WebCam: FC<IWebCamProps> = ({ style, className, classNames = [] }) => {
  const {
    connectors: { connect },
  } = useEnhancedNode();

  return (
    <div
      ref={connect}
      style={style}
      className={cn(
        'webCamContainer',
        'flex items-center justify-center space-x-4',
        className,
        classNames,
      )}
    >
      <button className="buttonCapture p-3 bg-gray-200 rounded-full border-2 border-gray-300">
        <MdOutlinePhotoCamera className="iconCapture w-10 h-10 text-gray-600" />
      </button>
    </div>
  );
};

export default WebCam;

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
        'flex items-center justify-center space-x-4 p-4 bg-gray-100 rounded-lg border border-gray-300 w-fit h-fit',
        className,
        classNames,
      )}
    >
      <button className="p-3 bg-gray-200 rounded-full border-2 border-gray-300">
        <MdOutlinePhotoCamera className="w-10 h-10 text-gray-600" />
      </button>
    </div>
  );
};

export default WebCam;

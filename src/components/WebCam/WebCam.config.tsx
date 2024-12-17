import { EComponentKind, T4DComponentConfig } from '@ws-ui/webform-editor';
import { Settings } from '@ws-ui/webform-editor';
import { MdOutlinePhotoCamera } from 'react-icons/md';

import WebCamSettings, { BasicSettings } from './WebCam.settings';

export default {
  craft: {
    displayName: 'WebCam',
    kind: EComponentKind.BASIC,
    props: {
      name: '',
      classNames: [],
      events: [],
    },
    related: {
      settings: Settings(WebCamSettings, BasicSettings),
    },
  },
  info: {
    displayName: 'WebCam',
    exposed: true,
    icon: MdOutlinePhotoCamera,
    events: [
      {
        label: 'On Capture',
        value: 'oncapture',
      },
    ],
    datasources: {
      accept: ['image'],
    },
  },
  defaultProps: {
    mirrored: false,
    style: {
      width: '450px',
      height: '300px',
      backgroundColor: 'rgb(243 244 246)',
      borderRadius: '0.5rem',
      borderWidth: '1px',
      borderColor: 'rgb(209 213 219)',
    },
  },
} as T4DComponentConfig<IWebCamProps>;

export interface IWebCamProps extends webforms.ComponentProps {
  mirrored?: boolean;
}

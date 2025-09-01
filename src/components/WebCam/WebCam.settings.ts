import { ESetting, TSetting } from '@ws-ui/webform-editor';
import { BASIC_SETTINGS, DEFAULT_SETTINGS, load } from '@ws-ui/webform-editor';

const commonSettings: TSetting[] = [
  {
    key: 'mirrored',
    label: 'Mirrored',
    type: ESetting.CHECKBOX,
  },
  {
    key: 'uploadPictures',
    label: 'Upload Pictures',
    type: ESetting.CHECKBOX,
  },
  {
    key: 'screenshotQuality',
    label: 'Screenshot Quality',
    type: ESetting.NUMBER_FIELD,
  },
  {
    key: 'cameraWidth',
    label: 'Camera width',
    type: ESetting.NUMBER_FIELD,
  },
  {
    key: 'cameraHeight',
    label: 'Camera height',
    type: ESetting.NUMBER_FIELD,
  },
];

const Settings: TSetting[] = [
  {
    key: 'properties',
    label: 'Properties',
    type: ESetting.GROUP,
    components: commonSettings,
  },
  ...DEFAULT_SETTINGS,
];

export const BasicSettings: TSetting[] = [
  ...commonSettings,
  ...load(BASIC_SETTINGS).filter('style.overflow'),
];

export default Settings;

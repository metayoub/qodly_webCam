import config, { IWebCamProps } from './WebCam.config';
import { T4DComponent, useEnhancedEditor } from '@ws-ui/webform-editor';
import Build from './WebCam.build';
import Render from './WebCam.render';

const WebCam: T4DComponent<IWebCamProps> = (props) => {
  const { enabled } = useEnhancedEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return enabled ? <Build {...props} /> : <Render {...props} />;
};

WebCam.craft = config.craft;
WebCam.info = config.info;
WebCam.defaultProps = config.defaultProps;

export default WebCam;

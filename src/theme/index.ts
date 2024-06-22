import { checkboxConfig, datePickerConfig, formConfig, inputConfig, radioConfig, timePickerConfig } from './entry';
import { modalConfig } from './feedback';
import { buttonConfig, typographyConfig } from './general';
import { breadcrumbConfig, menuConfig } from './navigation';
import variantsConfig from './variants';

/* eslint-disable */
export enum THEME {
  LIGHT = 'light',
  DARK = 'dark'
}
/* eslint-enable */

const createThemeToken = (theme: THEME) => {
  return {
    token: variantsConfig(theme),
    components: {
      Menu: menuConfig,
      Form: formConfig,
      Modal: modalConfig,
      Input: inputConfig,
      Radio: radioConfig,
      Button: buttonConfig(theme),
      Checkbox: checkboxConfig(theme),
      InputNumber: inputConfig,
      Typography: typographyConfig,
      TimePicker: timePickerConfig,
      DatePicker: datePickerConfig,
      Breadcrumb: breadcrumbConfig,
      Collapse: {
        headerBg: '#EFEFFF',
        lineType: 'none'
      }
    }
  };
};

export default createThemeToken;

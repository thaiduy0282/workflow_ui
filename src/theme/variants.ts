import { THEME } from './index';

const variantsConfig = (theme: THEME) => ({
  // for both theme
  colorWarning: '#ffca00',
  colorError: '#ff3d57',
  colorErrorHover: '#ff6479',
  colorErrorActive: '#e8384f',
  colorErrorBgHover: '#ffc3cb',
  colorErrorTextActive: '#e8384f',
  colorErrorTextHover: '#ff6479',
  colorErrorBg: '#ffecee',
  colorErrorBorderHover: '#ff6479',
  colorErrorBorder: '#ff3d57',
  colorErrorText: '#ff3d57',
  colorBgLayout: "#6161ff",
  colorPink: '#EB2F96',

  // for specific theme
  ...(theme === THEME.DARK
    ? {
        colorPrimary: '#5555DC',
        colorInfo: '#5555DC',
        colorTextBase: '#ffffffe0',
        colorBgBase: '#000000E5'
      }
    : theme === THEME.LIGHT
      ? {
          colorPrimary: '#6161ff',
          colorInfo: '#6161ff'
        }
      : {})
});

export default variantsConfig;

import { THEME } from '.';

export const inputConfig = {
  inputFontSizeSM: 12,

  colorBorder: 'transparent',
  activeBorderColor: 'transparent',
  hoverBorderColor: 'transparent',
  colorErrorBorderHover: 'transparent',
  colorWarningBorderHover: 'transparent',
  activeShadow: `0px -0.5px 1px 0px rgba(82, 82, 217, 0.30) inset, 
    0px -0.5px 1px 0px rgba(82, 82, 217, 0.25) inset, 
    1px 1.5px 4px 0px rgba(82, 82, 217, 0.08) inset, 
    1px 1.5px 4px 0px rgba(82, 82, 217, 0.10) inset`,
  warningActiveShadow: `0px -0.5px 1px 0px rgba(255, 202, 0, 0.3) inset,
    0px -0.5px 1px 0px rgba(255, 202, 0, 0.25) inset,
    1px 1.5px 4px 0px rgba(255, 202, 0, 0.08) inset,
    1px 1.5px 4px 0px rgba(255, 202, 0, 0.1) inset`,
  errorActiveShadow: `0px -0.5px 1px 0px rgba(255, 61, 87, 0.3) inset,
    0px -0.5px 1px 0px rgba(255, 61, 87, 0.25) inset,
    1px 1.5px 4px 0px rgba(255, 61, 87, 0.08) inset,
    1px 1.5px 4px 0px rgba(255, 61, 87, 0.1) inset`
};

export const radioConfig = { borderRadiusLG: 6, borderRadiusSM: 6, dotSize: 9 };

export const datePickerConfig = { paddingInline: 12, paddingInlineSM: 8 };
export const timePickerConfig = { paddingInline: 12, paddingInlineSM: 8 };
export const formConfig = {
  verticalLabelPadding: '0 0 4px',
  itemMarginBottom: 0
};

export const checkboxConfig = (theme: THEME) => ({
  ...(theme === THEME.DARK ? { colorBorder: '#5555DC' } : {})
});

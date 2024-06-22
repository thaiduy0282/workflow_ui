import { THEME } from '.';

export const typographyConfig = {
  titleMarginTop: 0,
  titleMarginBottom: 0,

  // title
  fontSizeHeading1: 48,
  fontSizeHeading2: 38,
  fontSizeHeading3: 30,
  fontSizeHeading4: 24,
  fontSizeHeading5: 20,
  lineHeightHeading1: 1.29167,
  lineHeightHeading2: 1.21053,
  lineHeightHeading3: 1.26667,
  lineHeightHeading4: 1.3333333,
  lineHeightHeading5: 1.4,

  // text
  fontSize: 16,
  lineHeight: 1.5
};

export const buttonConfig = (theme: THEME) => ({
  contentFontSizeSM: 12,
  contentLineHeightSM: 1.66667,
  onlyIconSize: 15,
  onlyIconSizeLG: 15,
  onlyIconSizeSM: 15,
  paddingInline: 16,
  paddingInlineLG: 16,
  paddingInlineSM: 8,

  ...(theme === THEME.DARK
    ? { defaultShadow: '0px 10px 20px 0px rgba(0, 0, 0, 0.05)', primaryShadow: '0px 10px 20px 0px rgba(0, 0, 0, 0.05)' }
    : theme === THEME.LIGHT
      ? {}
      : {})
});

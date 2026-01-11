import * as hmUI from "@zos/ui";
import { px } from "@zos/utils";
import { DEVICE_WIDTH } from "../../utils/constants";

export const TITLE_TEXT = {
  text: "7天统计",
  x: px(96),
  y: px(40),
  w: DEVICE_WIDTH - 2 * px(96),
  h: px(46),
  color: 0xffffff,
  text_size: px(36),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
};

export const CHART_CONTAINER = {
  x: px(40),
  y: px(100),
  w: DEVICE_WIDTH - 2 * px(40),
  h: px(300),
};

export const BACK_BUTTON = {
  text: "返回",
  press_color: 0x333333,
  normal_color: 0x1a1a1a,
  x: px(108),
  y: px(420),
  w: DEVICE_WIDTH - 2 * px(108),
  h: px(56),
  color: 0xffffff,
  text_size: px(32),
  radius: px(28),
};

export const CHART_AXIS_COLOR = 0x666666;
export const CHART_BAR_COLOR = 0xFF9800;
export const CHART_TEXT_COLOR = 0x999999;
export const CHART_TEXT_SIZE = px(20);
export const CHART_BAR_WIDTH = px(30);
export const CHART_BAR_GAP = px(20);
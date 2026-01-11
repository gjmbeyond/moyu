import * as hmUI from "@zos/ui";
import { px } from "@zos/utils";
import { DEVICE_WIDTH } from "../../utils/constants";

export const TITLE_TEXT = null;

export const CHART_CONTAINER = {
  x: px(4),
  y: px(60),
  w: DEVICE_WIDTH - 2 * px(4),
  h: px(240),
};

export const BACK_BUTTON = {
  text: "返回",
  press_color: 0x333333,
  normal_color: 0x1a1a1a,
  x: px(71),
  y: px(330),
  w: DEVICE_WIDTH - 2 * px(71),
  h: px(56),
  color: 0xffffff,
  text_size: px(28),
  radius: px(28),
};

export const CHART_AXIS_COLOR = 0x666666;
export const CHART_BAR_COLOR = 0xFF9800;
export const CHART_TEXT_COLOR = 0x999999;
export const CHART_TEXT_SIZE = px(18);
export const CHART_BAR_WIDTH = px(24);
export const CHART_BAR_GAP = px(16);